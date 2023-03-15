import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { authMiddleware } from "./middlewares/authMiddleware";
import { authOwnerUser } from "./middlewares/authOwnerUser";


const routes = Router();


routes.post('/user', new UserController().create)

routes.post('/login', new UserController().login)

routes.get('/profile', authMiddleware, new UserController().getProfile)

routes.delete('/user/:idUser', authOwnerUser, new UserController().deleteUser)

routes.patch('/user/:idUser', authOwnerUser, new UserController().updateUser)


export default routes;