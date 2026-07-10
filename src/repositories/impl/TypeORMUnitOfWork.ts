import { DataSource, QueryRunner } from 'typeorm';
import { IUnitOfWork } from '../interfaces/IUnitOfWork';
import { IUserRepository } from '../interfaces/IUserRepository';
import { MySQLUserRepository } from './MySQLUserRepository';

export class TypeORMUnitOfWork implements IUnitOfWork {
    private queryRunner: QueryRunner;
    private userRepository: IUserRepository | null = null;

    constructor(private dataSource: DataSource) {
        this.queryRunner = this.dataSource.createQueryRunner();
    }

    async startTransaction(): Promise<void> {
        await this.queryRunner.connect();
        await this.queryRunner.startTransaction();
    }

    async commit(): Promise<void> {
        await this.queryRunner.commitTransaction();
    }

    async rollback(): Promise<void> {
        await this.queryRunner.rollbackTransaction();
    }

    getUserRepository(): IUserRepository {
        if (!this.userRepository) {
            this.userRepository = new MySQLUserRepository(this.queryRunner.manager);
        }
        return this.userRepository;
    }

    async release(): Promise<void> {
        await this.queryRunner.release();
    }
}
