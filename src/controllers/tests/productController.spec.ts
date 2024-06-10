import { ProductController } from "../productController";
import { productRepository } from "../../repositories/productRepository";
import { Request, Response } from "express";
import { Base64Error, UnauthorizedError } from "../../helpers/api-erros";
import { error } from "console";

jest.mock('../../repositories/favoriteRepository');
jest.mock('bcrypt');

declare var global: {
    saveImageToFile: jest.Mock;
};

describe('ProductController', () => {
    let productController: ProductController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        productController = new ProductController();
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

    it('should throw an UnauthorizedError if required data is not provided', async () => {
        req.body = {};

        await expect(productController.create(req as Request, res as Response))
            .rejects
            .toThrow(new UnauthorizedError("Data needs to be filled in"));
    });

    it('should throw an UnauthorizedError if product already exists', async () => {
        const existingProduct = {
            name: 'Test Products',
            image: 'base64string',
            description: 'Test description',
            price: 10,
            rate: 5,
            category: 'Test category'
        };
    
        req.body = {
            name: 'Test Products',
            image: 'base64string',
            description: 'Test description',
            price: 10,
            rate: 5,
            category: 'Test category'
        };
    
        productRepository.findOneBy = jest.fn().mockResolvedValueOnce(existingProduct);
    
        await expect(productController.create(req as Request, res as Response))
            .rejects
            .toThrow(new UnauthorizedError('Product already exists'));
    });
    
    it('should throw a Base64Error if failed to save image', async () => {
        req.body = {
            name: 'Test Product',
            image: 'base64string',
            description: 'Test description',
            price: 10,
            rate: 5,
            category: 'Test category'
        };

        productRepository.findOneBy = jest.fn().mockResolvedValueOnce(null);
        global.saveImageToFile = jest.fn().mockResolvedValueOnce(null);

        await expect(productController.create(req as Request, res as Response))
            .rejects
            .toThrow();
    });

    // it('should create a new product and return status 200 with product data', async () => {
    //     req.body = {
    //         name: 'Test Product',
    //         image: 'base64string',
    //         description: 'Test description',
    //         price: 10,
    //         rate: 5,
    //         category: 'Test category'
    //     };

    //     productRepository.findOneBy = jest.fn().mockResolvedValueOnce(null);
    //     global.saveImageToFile = jest.fn().mockResolvedValueOnce('savedImagePath');
    //     const newUser = { ...req.body };
    //     productRepository.create = jest.fn().mockReturnValueOnce(newUser);
    //     productRepository.save = jest.fn().mockResolvedValueOnce(newUser);

    //     await productController.create(req as Request, res as Response);

    //     expect(statusMock).toHaveBeenCalledWith(200);
    //     expect(jsonMock).toHaveBeenCalledWith({ message: 'Product registered successfully', data: newUser });
    // });
});
