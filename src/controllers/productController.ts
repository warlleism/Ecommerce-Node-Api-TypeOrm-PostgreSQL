import { Request, Response } from "express";
import { productRepository } from "../repositories/productRepository";
import { BadRequestError, Base64Error, UnauthorizedError } from "../helpers/api-erros";
import { deleteImage, saveImageToFile } from "../utils/fileUtils";
import { favoriteRepository } from "../repositories/favoriteRepository";
import { JwtPayload } from "jsonwebtoken";
import jwt from 'jsonwebtoken'
import fs from 'fs';

export class ProductController {

    async create(req: Request, res: Response) {
        const { name, image, description, price, rate, category } = req.body;

        if (!name || !image || !description || !price || !rate || !category) {
            throw new UnauthorizedError("Data needs to be filled in")
        }

        const productExists = await productRepository.findOneBy({ name });

        if (productExists) {
            throw new UnauthorizedError('Product already exists')
        }

        const filename = `${name}.png`;
        let imagePath;

        imagePath = await saveImageToFile(image, filename);

        const newUser = productRepository.create({
            name,
            image: imagePath,
            description,
            price,
            rate,
            category
        });

        await productRepository.save(newUser);
        const { ...user } = newUser;
        return res.status(200).json({ message: "Product registered successfully", data: user });
    }

    async getAll(req: Request, res: Response) {

        const { authorization } = req.headers

        if (!authorization) {
            throw new UnauthorizedError('Não autorizado')
        }

        const token = authorization.split(' ')[1]
        const { id } = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload
        const favoriteExists = await favoriteRepository.findBy({ user_id: id })
        const productArray: number[] = [];
        const productMap = favoriteExists.map((e) => { productArray.push(e.product_id) });
        const products = await productRepository.find();

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found." });
        }

        const allProducts = await Promise.all(products.map(async product => {
            const imagePath = product.image;
            const data = await fs.promises.readFile(imagePath, 'base64');
            return { ...product, image: data };
        }));

        return res.status(200).json({ message: "All products with images!", data: allProducts, favorites: productArray });

    }
    async getOne(req: Request, res: Response) {

        const { id } = req.body
        if (!id) { throw new BadRequestError('Product ID required') }

        const product = await productRepository.findOneBy({ id: id })

        if (!product) {
            throw new BadRequestError('Product not found.')
        }

        const imagePath = product.image;
        const data = fs.readFileSync(imagePath, { encoding: 'base64' });
        return res.status(200).json({ message: "Product found!", data: { ...product, image: data } })
    }

    async getSearch(req: Request, res: Response) {
        const { search } = req.body;
        if (!search) {
            throw new BadRequestError('Product ID required');
        }

        const products = await productRepository.find();
        const filteredProducts = products.filter(product => product.name.includes(search));

        if (filteredProducts.length === 0) {
            throw new BadRequestError('Product not found.');
        }

        const productsWithImages = filteredProducts.map(product => {
            const imagePath = product.image;
            const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });
            return { ...product, image: imageData };
        });

        return res.status(200).json({ message: "Products found!", data: productsWithImages });
    }

    async delete(req: Request, res: Response) {

        const { id } = req.body;
        if (!id) { throw new BadRequestError('Product ID required') }

        const productImage = await productRepository.findOneBy({ id: id });
        if (productImage?.name) { await deleteImage(productImage.name) }
        else {
            throw new BadRequestError('Fail to delete image.')
        }

        const product = await productRepository.delete({ id: id });
        if (!product) {
            throw new BadRequestError('Product not found.')
        }

        res.status(200).json({ massage: 'Product and image deleted successfully.' });
    }

    async update(req: Request, res: Response) {

        const { id, name, image, description, price, rate, category } = req.body;
        if (!name || !image || !description || !price || !rate || !category) { throw new UnauthorizedError("Data needs to be filled in") }

        const product = await productRepository.findOneBy({ id: id });
        if (!product) {
            throw new BadRequestError('Product not found.')
        }

        product.category
        product.description
        product.image
        product.name
        product.price
        product.rate

        await productRepository.save(product);

        res.status(200).json({ massage: 'product has been updated successfully' });
    }




}
