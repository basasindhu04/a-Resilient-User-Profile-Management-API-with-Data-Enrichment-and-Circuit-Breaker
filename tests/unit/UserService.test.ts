import { UserService } from '../../src/services/UserService';
import { User } from '../../src/models/User';
import { NotFoundError, ConflictError } from '../../src/utils/Errors';

// Mock TypeORM DataSource and UnitOfWork
const mockUserRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    delete: jest.fn(),
};

const mockUnitOfWork = {
    startTransaction: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn(),
    getUserRepository: jest.fn().mockReturnValue(mockUserRepository),
    release: jest.fn(),
};

const mockDataSource = {
    createQueryRunner: jest.fn(),
} as any;

describe('UserService Unit Tests', () => {
    let userService: UserService;

    beforeEach(() => {
        jest.clearAllMocks();
        userService = new UserService(mockDataSource);
        // Override the createUnitOfWork private method for testing
        (userService as any).createUnitOfWork = () => mockUnitOfWork;
    });

    describe('createUser', () => {
        it('should create a user successfully', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockUserRepository.save.mockImplementation(async (u) => u);

            const user = await userService.createUser('Test User', 'test@example.com');

            expect(user.name).toBe('Test User');
            expect(user.email).toBe('test@example.com');
            expect(user.id).toBeDefined();
            expect(mockUnitOfWork.startTransaction).toHaveBeenCalled();
            expect(mockUnitOfWork.commit).toHaveBeenCalled();
            expect(mockUnitOfWork.release).toHaveBeenCalled();
        });

        it('should throw ConflictError if email exists', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(new User());

            await expect(userService.createUser('Test User', 'test@example.com')).rejects.toThrow(ConflictError);
            expect(mockUnitOfWork.rollback).toHaveBeenCalled();
            expect(mockUnitOfWork.release).toHaveBeenCalled();
        });
    });

    describe('getUserById', () => {
         it('should throw NotFoundError if user does not exist', async () => {
            mockUserRepository.findById.mockResolvedValue(null);

            await expect(userService.getUserById('invalid-id')).rejects.toThrow(NotFoundError);
         });
    });
});
