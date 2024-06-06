import { Request, Response } from "express";
import { productRepository } from "../repositories/productRepository";
import { BadRequestError, Base64Error, UnauthorizedError } from "../helpers/api-erros";
import { saveImageToFile } from "../utils/fileUtils";
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

        const filename = `${name.replace(/\s+/g, '_')}_${Date.now()}.png`;
        let imagePath;
        try {
            imagePath = await saveImageToFile(image, filename);
        } catch (error) {
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
        try {
            const products = await productRepository.find();

            if (products.length > 0) {
                const productsWithImages = [];
                for (const product of products) {
                    const imagePath = product.image;
                    const data = fs.readFileSync(imagePath, { encoding: 'base64' });
                    productsWithImages.push({ ...product, image: data });
                }
                return res.status(200).json({ message: "All products with images!", data: productsWithImages });
            } else {
                return res.status(404).json({ message: "No products found." });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error fetching product images." });
        }
    }

    public async getOne(req: Request, res: Response) {
        const { id } = req.body

        if (!id) {
            throw new BadRequestError('Necessário ID do produto')
        }

        try {
            const products = await productRepository.findOneBy({ id: id })

            if (products) {
                const product = products;

                const imagePath = product.image;
                fs.readFile(imagePath, { encoding: 'base64' }, (err, data) => {
                    if (err) throw err;
                    return res.status(200).json({ message: "Product found!", data: { ...product, image: data } });
                });

            } else {
                return res.status(404).json({ message: "No products found." });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error fetching product image." });
        }
    }




}
