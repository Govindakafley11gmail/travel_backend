import { Request, Response } from "express";
import UserService from "../../handler/user/user.handler";

const userService = new UserService();

class UserController {
  async createUser(req: Request, res: Response) {
    console.log("hello world")
    try {
      const { name, email, password } = req.body;
      const user = await userService.createUser(name, email, password, req.body.role, req.body.status);
      res.status(201).json({
        status: "success",
        message: "User created successfully",
      });
    } catch (error) {
      res.status(401).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json({
        status: "success",
        message: "User fetch successfully",
        data: users
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(Number(id));
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, role, status,password } = req.body;
      const user = await userService.updateUser(Number(id), { name, email, role, status, password });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await userService.deleteUser(Number(id));
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      console.log(req.body)
      const { email, password } = req.body;

      // Login logic
      const { accessToken, refreshToken } = await userService.loginUser(email, password);

      // Set cookies
      res.cookie("accessToken", accessToken, {
        httpOnly: false,       // not accessible via JavaScript
        secure: process.env.NODE_ENV === "production", // HTTPS only in prod
        maxAge: 15 * 60 * 1000, // 15 minutes
        sameSite: "strict",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "strict",
      });

      // Respond with message only (tokens are in cookies)
      res.json({ message: "Login successful" });

    } catch (error: unknown) {
      res.status(401).json({
        error: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }
}

export default UserController;
