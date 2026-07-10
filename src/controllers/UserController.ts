import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/database';

export class UserController {
    private userService: UserService;

    constructor() {
        // In a real app we'd inject this via a DI container
        this.userService = new UserService(AppDataSource);
    }

    createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email } = req.body;
            const user = await this.userService.createUser(name, email);
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    };

    getUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const user = await this.userService.getUserById(id);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    };

    getEnrichedUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const enrichedUser = await this.userService.getEnrichedUser(id);
            res.status(200).json(enrichedUser);
        } catch (error) {
            next(error);
        }
    };

    updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const updates = req.body;
            const user = await this.userService.updateUser(id, updates);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    };

    deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            await this.userService.deleteUser(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
