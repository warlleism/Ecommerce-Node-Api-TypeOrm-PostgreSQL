import { Router } from "express";
import { UserController } from "../controllers/userContoller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ProductController } from "../controllers/productContoller";
import { FavoriteController } from "../controllers/favoriteContoller";
const routes = Router()

routes.post('/user/register', new UserController().create)
routes.post('/user/login', new UserController().login)

routes.post('/product/create', authMiddleware, new ProductController().create)
routes.get('/product/all', authMiddleware, new ProductController().getAll)
routes.post('/product/one', authMiddleware, new ProductController().getOne)
routes.delete('/product/delete', authMiddleware, new ProductController().delete)
routes.put('/product/update', authMiddleware, new ProductController().update)
routes.post('/product/search', authMiddleware, new ProductController().getSearch)

routes.post('/favorite/create', authMiddleware, new FavoriteController().create)


export default routes;