import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validateRequest } from '../middleware/validationMiddleware';
import { createUserSchema, updateUserSchema, userIdParamSchema } from '../validators/userValidator';

const router = Router();
const userController = new UserController();

router.post('/', validateRequest(createUserSchema), userController.createUser);
router.get('/:id', validateRequest(userIdParamSchema), userController.getUser);
router.get('/:id/enriched', validateRequest(userIdParamSchema), userController.getEnrichedUser);
router.put('/:id', validateRequest(updateUserSchema), userController.updateUser);
router.delete('/:id', validateRequest(userIdParamSchema), userController.deleteUser);

export default router;
