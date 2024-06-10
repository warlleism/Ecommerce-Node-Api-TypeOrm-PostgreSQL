import { UserController } from "../userController";
import { Request, Response } from "express";
import { userRepository } from "../../repositories/userRepository";
import { UnauthorizedError } from "../../helpers/api-erros";
import bcrypt from 'bcrypt';

jest.mock('../../repositories/userRepository');
jest.mock('bcrypt');

describe('UserController', () => {
    let userController: UserController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        userController = new UserController();
        req = {};
        jsonMock = jest.fn();
        statusMock = jest.fn(() => ({ json: jsonMock }));
        res = {
            status: statusMock,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw an UnauthorizedError if email or password is not provided', async () => {
        req.body = {};

        await expect(userController.create(req as Request, res as Response))
            .rejects
            .toThrow(new UnauthorizedError("Os dados precisam ser preenchidos"));

        req.body = { email: 'test@test.com' };

        await expect(userController.create(req as Request, res as Response))
            .rejects
            .toThrow(new UnauthorizedError("Os dados precisam ser preenchidos"));

        req.body = { password: 'password' };

        await expect(userController.create(req as Request, res as Response))
            .rejects
            .toThrow(new UnauthorizedError("Os dados precisam ser preenchidos"));
    });

    it('should throw an UnauthorizedError if email already exists', async () => {
        const mockEmail = 'test@test.com';

        (userRepository.findOneBy as jest.Mock).mockResolvedValue({ email: mockEmail });

        req.body = { email: mockEmail, password: 'password' };

        await expect(userController.create(req as Request, res as Response))
            .rejects
            .toThrow(new UnauthorizedError("E-mail já existe"));

        expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: mockEmail });
    });

    it('should create a new user if valid email and password are provided', async () => {
        const mockEmail = 'test@test.com';
        const mockPassword = 'password';
        const mockHashedPassword = 'hashedPassword';
        const mockNewUser = { email: mockEmail, password: mockHashedPassword };
        const mockSavedUser = { ...mockNewUser, id: 1 };

        (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
        (userRepository.findOneBy as jest.Mock).mockResolvedValue(null);
        (userRepository.create as jest.Mock).mockReturnValue(mockSavedUser);

        req.body = { email: mockEmail, password: mockPassword };

        await userController.create(req as Request, res as Response);

        expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10);
        expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: mockEmail });
        expect(userRepository.create).toHaveBeenCalledWith({ email: mockEmail, password: mockHashedPassword });
        expect(userRepository.save).toHaveBeenCalledWith(mockSavedUser);
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ message: "Usuário cadastrado com sucesso", data: { email: mockEmail, id: 1 } });
    });

    
});