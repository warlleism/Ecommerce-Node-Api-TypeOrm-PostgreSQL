import { Request, Response } from "express"
import { userRepository } from "../repositories/userRepository"
import { BadRequestError, UnauthorizedError } from "../helpers/api-erros"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class UserController {

    async create(req: Request, res: Response) {
        const { email, password } = req.body

        if (!email || !password) { throw new UnauthorizedError("Os dados precisam ser preenchidos") }

        const userExists = await userRepository.findOneBy({ email })

        if (userExists) { throw new UnauthorizedError('E-mail já existe') }

        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = userRepository.create({ email: email, password: hashPassword })
        await userRepository.save(newUser)
        const { password: _, ...user } = newUser
        return res.status(200).json({ message: "Usuário cadastrado com sucesso", data: user })

    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body

        if (!email || !password) { return res.status(400).json({ message: "Os dados precisam ser preenchidos" }) }

        const user = await userRepository.findOneBy({ email })

        if (!user) { throw new BadRequestError('E-mail ou senha inválidos') }

        const verifyPass = await bcrypt.compare(password, user.password)

        if (!verifyPass) { throw new BadRequestError('E-mail ou senha inválidos') }

        const token = jwt.sign({ id: user.id }, process.env.JWT_PASS ?? '', { expiresIn: '8h', })

        const { password: _, ...userLogin } = user

        return res.json({
            user: userLogin,
            token: token,
        })

    }

}