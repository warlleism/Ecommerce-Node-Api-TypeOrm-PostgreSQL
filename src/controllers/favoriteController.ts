import { Request, Response } from "express"
import { UnauthorizedError } from "../helpers/api-erros"
import { favoriteRepository } from "../repositories/favoriteRepository"
import { productRepository } from "../repositories/productRepository"
import { userRepository } from "../repositories/userRepository"
import fs from 'fs';

export class FavoriteController {

    async create(req: Request, res: Response) {
        const { user_id, product_id } = req.body

        if (!user_id || !product_id) { throw new UnauthorizedError("The data needs to be filled in.") }

        const productExists = await productRepository.findOneBy({ id: product_id })
        const userExists = await userRepository.findOneBy({ id: user_id })
        const favoriteExists = await favoriteRepository.findBy({ product_id: product_id })

        if (favoriteExists.length !== 0) { throw new UnauthorizedError("Product already favorited.") }
        if (!productExists || !userExists) { throw new UnauthorizedError("Product or user does not exist.") }

        const newFavorite = favoriteRepository.create({ user_id, product_id })
        await favoriteRepository.save(newFavorite)

        const { ...favorite } = newFavorite

        return res.status(200).json({ message: "Successfully favorited product", data: favorite })
    }

    async get(req: Request, res: Response) {
        const { products_id } = req.body

        if (!products_id || products_id.length === 0) { throw new UnauthorizedError("The data needs to be filled in.") }

        const product = await productRepository.find()

        if (!product) {
            throw new UnauthorizedError("Product not favorited.")
        }

        const filteredProducts = product.filter(product => {
            if (products_id.includes(product.id)) {
                const imagePath = product.image;
                product.image = fs.readFileSync(imagePath, { encoding: 'base64' });
                return product
            }
        })

        if (!filteredProducts || filteredProducts.length === 0) {
            throw new UnauthorizedError("Product not favorited.")
        }

        return res.status(200).json({ message: "Successfully! all products", data: filteredProducts })
    }

}