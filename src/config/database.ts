import { DataSource } from 'typeorm';
import { User } from '../models/User';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'user_profiles_db',
    synchronize: false, // We use init.sql for schema
    logging: false,
    entities: [User],
    subscribers: [],
    migrations: [],
});

export const initDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database connection initialized successfully.');
    } catch (error) {
        console.error('Error during Data Source initialization:', error);
        throw error;
    }
};
