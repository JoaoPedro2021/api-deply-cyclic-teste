import { NextFunction, Request, Response } from "express";
import { NotFoundError, UnauthorzedError } from "../helpers/api-error";
import { userRepository } from "../repositories/userRepository";
import jwt from "jsonwebtoken";

type JwtPayload = {
    id: number
}

export const authOwnerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { idUser } = req.params;

    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        throw new UnauthorzedError("Não Autorizado!")
    }
    const { id } = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload

    const user = await userRepository.findOneBy({ id: Number(idUser) })

    if (!user) {
        throw new NotFoundError("Usuario não existe!")
    }

    if (Number(idUser) != Number(id)) {
        throw new UnauthorzedError("Usuario não tem permissão!")
    }

    const { password: _, ...loggedUser } = user

    req.user = loggedUser;

    next();
}