import { Router } from "express";
import { UserController } from "../controllers/userContoller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ProductController } from "../controllers/productContoller";
const routes = Router()

routes.post('/register-user', new UserController().create)
routes.post('/login-user', new UserController().login)

routes.post('/create-product', authMiddleware, new ProductController().create)
routes.get('/get-all', authMiddleware, new ProductController().getAll)
routes.post('/get-one', authMiddleware, new ProductController().getOne)
routes.post('/delete-product', authMiddleware, new ProductController().delete)


export default routes;