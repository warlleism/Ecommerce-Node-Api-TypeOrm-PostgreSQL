import { Router } from "express";
import { UserController } from "../controllers/userContoller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ProductController } from "../controllers/productContoller";
const routes = Router()

routes.post('/register-user', new UserController().create)
routes.post('/login-user', new UserController().login)

routes.post('/product/create', authMiddleware, new ProductController().create)
routes.get('/product/get', authMiddleware, new ProductController().getAll)
routes.post('/product/all', authMiddleware, new ProductController().getOne)
routes.delete('/product/delete', authMiddleware, new ProductController().delete)
routes.put('/product/update', authMiddleware, new ProductController().update)


export default routes;