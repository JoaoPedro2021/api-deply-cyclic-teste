import { Request, Response, NextFunction } from "express";
import { z, AnyZodObject } from "zod";

// ...

export const validate = (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated = schema.parse(req.body);
            req.body = validated
            return next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json(error.flatten().fieldErrors);
            }
        }
    };