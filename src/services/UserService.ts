import { IUnitOfWork } from '../repositories/interfaces/IUnitOfWork';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { ExternalEnrichmentClient, EnrichmentData } from '../external/EnrichmentClient';
import { User } from '../models/User';
import { NotFoundError, ConflictError } from '../utils/Errors';
import { v4 as uuidv4 } from 'uuid';
import { DataSource } from 'typeorm';
import { TypeORMUnitOfWork } from '../repositories/impl/TypeORMUnitOfWork';

export class UserService {
    private enrichmentClient: ExternalEnrichmentClient;

    constructor(private dataSource: DataSource) {
        this.enrichmentClient = new ExternalEnrichmentClient();
    }

    private createUnitOfWork(): IUnitOfWork {
        return new TypeORMUnitOfWork(this.dataSource);
    }

    async createUser(name: string, email: string): Promise<User> {
        const uow = this.createUnitOfWork();
        try {
            await uow.startTransaction();
            const userRepository = uow.getUserRepository();

            const existingUser = await userRepository.findByEmail(email);
            if (existingUser) {
                throw new ConflictError('User with this email already exists');
            }

            const user = new User();
            user.id = uuidv4();
            user.name = name;
            user.email = email;
            // registrationDate is automatically set by DB default / TypeORM CreateDateColumn
            user.registrationDate = new Date();

            const savedUser = await userRepository.save(user);

            await uow.commit();
            return savedUser;
        } catch (error) {
            await uow.rollback();
            throw error;
        } finally {
            await uow.release();
        }
    }

    async getUserById(id: string): Promise<User> {
        const uow = this.createUnitOfWork();
        try {
            const userRepository = uow.getUserRepository();
            const user = await userRepository.findById(id);
            if (!user) {
                throw new NotFoundError(`User with id ${id} not found`);
            }
            return user;
        } finally {
            await uow.release();
        }
    }

    async updateUser(id: string, updates: { name?: string; email?: string }): Promise<User> {
        const uow = this.createUnitOfWork();
        try {
            await uow.startTransaction();
            const userRepository = uow.getUserRepository();

            const user = await userRepository.findById(id);
            if (!user) {
                throw new NotFoundError(`User with id ${id} not found`);
            }

            if (updates.email && updates.email !== user.email) {
                const existingUser = await userRepository.findByEmail(updates.email);
                if (existingUser) {
                    throw new ConflictError('User with this email already exists');
                }
                user.email = updates.email;
            }

            if (updates.name) {
                user.name = updates.name;
            }

            const updatedUser = await userRepository.save(user);
            await uow.commit();
            return updatedUser;
        } catch (error) {
            await uow.rollback();
            throw error;
        } finally {
            await uow.release();
        }
    }

    async deleteUser(id: string): Promise<void> {
        const uow = this.createUnitOfWork();
        try {
            await uow.startTransaction();
            const userRepository = uow.getUserRepository();

            const user = await userRepository.findById(id);
            if (!user) {
                throw new NotFoundError(`User with id ${id} not found`);
            }

            await userRepository.delete(id);
            await uow.commit();
        } catch (error) {
            await uow.rollback();
            throw error;
        } finally {
            await uow.release();
        }
    }

    async getEnrichedUser(id: string): Promise<any> {
        const user = await this.getUserById(id);
        
        try {
            const enrichedData = await this.enrichmentClient.getEnrichmentData(id);
            return {
                ...user,
                enrichedDataStatus: 'available',
                enrichedData
            };
        } catch (error: any) {
            return {
                ...user,
                enrichedDataStatus: 'unavailable',
                message: 'Enrichment data is currently unavailable'
            };
        }
    }
}
