// src/controllers/forgetPassword.controller.ts
import { NextFunction, Request, Response } from "express";
import { ForgetPsswordHandler } from "../../handler/forgetpassword/forgetpassword.handler";

const forgetHandler = new ForgetPsswordHandler();

export class ForgetPasswordController {
    async forgetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password, passwordConfirm } = req.body;

            const user = await forgetHandler.forgetPassword(email,
                password,
                passwordConfirm);

            res.status(200).json({
                success: true,
                message: "Password reset successfully",

            });
        } catch (error: any) {
            next(error);
        }
    }
}

