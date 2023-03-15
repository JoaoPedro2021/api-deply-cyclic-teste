import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { authMiddleware } from "./middlewares/authMiddleware";
import { authOwnerUser } from "./middlewares/authOwnerUser";
import { validate } from "./middlewares/validateZod";
import { userSchema } from "./schemas/userSchema";


const routes = Router();


routes.post('/user', validate(userSchema), new UserController().create)

routes.post('/login', new UserController().login)

routes.get('/profile', authMiddleware, new UserController().getProfile)

routes.delete('/user/:idUser', authOwnerUser, new UserController().deleteUser)

routes.patch('/user/:idUser', authOwnerUser, new UserController().updateUser)


export default routes;