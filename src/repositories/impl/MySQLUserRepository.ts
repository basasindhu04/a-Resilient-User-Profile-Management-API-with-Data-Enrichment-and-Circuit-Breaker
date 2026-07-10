import { EntityManager, Repository } from 'typeorm';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../../models/User';

export class MySQLUserRepository implements IUserRepository {
    private repository: Repository<User>;

    constructor(private entityManager: EntityManager) {
        this.repository = this.entityManager.getRepository(User);
    }

    async save(user: User): Promise<User> {
        return await this.repository.save(user);
    }

    async findById(id: string): Promise<User | null> {
        return await this.repository.findOne({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.repository.findOne({ where: { email } });
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
