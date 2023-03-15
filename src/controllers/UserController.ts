import { Request, Response } from "express";
import { BadRequestError, NotFoundError, UnauthorzedError } from "../helpers/api-error";
import { userRepository } from "../repositories/userRepository";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';


export class UserController {
    async create(req: Request, res: Response) {
        const { name, email, password } = req.body;

        // Vai buscar no banco algum usuario que já tenha esse email cadastrado 
        const userExists = await userRepository.findOneBy({ email })

        // Se o email existir, ele não vai deixar criar o usuario 
        if (userExists) {
            throw new BadRequestError("Email já existe")
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = userRepository.create({
            name,
            email,
            password: hashedPassword
        });

        await userRepository.save(newUser);

        const { password: _, ...user } = newUser

        return res.status(201).json(user)
    }


    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const user = await userRepository.findOneBy({ email })

        if (!user) {
            throw new NotFoundError("Email ou senha inválidos")
        }

        const verifyPass = await bcrypt.compare(password, user.password);

        if (!verifyPass) {
            throw new NotFoundError("Email ou senha inválidos")
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_PASS ?? '',
            { expiresIn: '8h', }
        )

        const { password: _, ...userLogin } = user

        return res.json({
            user: userLogin,
            token: token
        })
    }

    async getProfile(req: Request, res: Response) {

        return res.json(req.user)
    }

    async deleteUser(req: Request, res: Response) {

        const { id } = req.user

        await userRepository.delete({ id })

        return res.status(204).send()
    }


    async updateUser(req: Request, res: Response) {
        const { name } = req.body;

        if (!name) {
            throw new BadRequestError("Field name is required!")
        }

        const { id } = req.user

        const user = await userRepository.findOneBy({ id: Number(id) })

        if (user?.name === name) {
            throw new BadRequestError("name is already in use")
        }

        await userRepository.update({ id }, {
            name
        })

        return res.status(200).json({ message: "User updated" })
    }
}