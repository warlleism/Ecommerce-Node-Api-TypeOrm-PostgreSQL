import { Request, Response } from "express";
import { productRepository } from "../repositories/productRepository";
import { BadRequestError, Base64Error, UnauthorizedError } from "../helpers/api-erros";
import { deleteImage, saveImageToFile } from "../utils/fileUtils";
import fs from 'fs';

export class ProductController {

    async create(req: Request, res: Response) {
        const { name, image, description, price, rate } = req.body;

        if (!name || !image || !description || !price || !rate) {
            throw new UnauthorizedError("Os dados precisam ser preenchidos");
        }

        const productExists = await productRepository.findOneBy({ name });

        if (productExists) {
            throw new UnauthorizedError('Produto já existe');
        }

        const filename = `${name}.png`;
        console.log(filename)
        let imagePath;

        imagePath = await saveImageToFile(image, filename);

        if (!imagePath) {
            throw new Base64Error('Falha ao salvar a imagem');
        }

        const newUser = productRepository.create({
            name,
            image: imagePath,
            description,
            price,
            rate,
        });

        await productRepository.save(newUser);
        const { ...user } = newUser;
        return res.status(200).json({ message: "Produto cadastrado com sucesso", data: user });
    }

    public async getAll(req: Request, res: Response) {
        const products = await productRepository.find();

        if (!products) {
            throw new BadRequestError('Products not found!');
        }

        if (products.length > 0) {
            const allProducts = [];
            for (const product of products) {
                const imagePath = product.image;
                const data = fs.readFileSync(imagePath, { encoding: 'base64' });
                allProducts.push({ ...product, image: data });
            }
            return res.status(200).json({ message: "All products with images!", data: allProducts });
        } else {
            return res.status(404).json({ message: "No products found." });
        }

    }

    public async getOne(req: Request, res: Response) {
        const { id } = req.body

        if (!id) {
            throw new BadRequestError('Product ID required')
        }

        const product = await productRepository.findOneBy({ id: id })

        if (!product) {
            throw new BadRequestError('Product not found.');
        }

        const imagePath = product.image;
        fs.readFile(imagePath, { encoding: 'base64' }, (err, data) => {
            if (err) throw err;
            return res.status(200).json({ message: "Product found!", data: { ...product, image: data } });
        });
    }

    public async delete(req: Request, res: Response) {
        const { id } = req.body;

        if (!id) {
            throw new BadRequestError('Product ID required');
        }

        const productImage = await productRepository.findOneBy({ id: id });

        if (productImage?.name) {
            await deleteImage(productImage.name);
        } else {
            throw new BadRequestError('Fail to delete image.');
        }

        const product = await productRepository.delete({ id: id });

        if (!product) {
            throw new BadRequestError('Product not found.');
        }

        res.status(200).send('Product and image deleted successfully.');
    }




}
