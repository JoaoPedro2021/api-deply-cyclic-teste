import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorzedError } from "../helpers/api-error";
import { userRepository } from "../repositories/userRepository";

type JwtPayload = {
    id: number
}


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        throw new UnauthorzedError("Não Autorizado!")
    }
    const { id } = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload


    const user = await userRepository.findOneBy({ id })

    if (!user) {
        throw new UnauthorzedError("Não Autorizado!")
    }

    const { password: _, ...loggedUser } = user

    req.user = loggedUser;

    next();
}