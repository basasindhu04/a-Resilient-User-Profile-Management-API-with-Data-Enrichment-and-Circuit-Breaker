import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from '../utils/Errors';

export const validateRequest = (schema: z.ZodTypeAny) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const zodError = error as any;
                const details = zodError.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`);
                next(new ValidationError('Validation failed', details));
            } else {
                next(error);
            }
        }
    };
};
