import { Router } from "express";
import UserController from "../modules/controller/user/user.controller";
import { VERIFY_TOKEN } from "../middleware/token";

const router = Router();
const userController = new UserController();

router.post("/user", VERIFY_TOKEN, userController.createUser.bind(userController));
router.get("/user", VERIFY_TOKEN, userController.getAllUsers.bind(userController));
router.get("/user/:id", VERIFY_TOKEN, userController.getUserById.bind(userController));
router.put("/user/:id", VERIFY_TOKEN, userController.updateUser.bind(userController));
router.delete("/user/:id", VERIFY_TOKEN, userController.deleteUser.bind(userController));

router.post("/login", userController.loginUser.bind(userController));

export default router;
