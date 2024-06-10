import { Request, Response } from "express"
import { UnauthorizedError } from "../helpers/api-erros"
import { favoriteRepository } from "../repositories/favoriteRepository"
import { productRepository } from "../repositories/productRepository"
import { userRepository } from "../repositories/userRepository"

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
    
}