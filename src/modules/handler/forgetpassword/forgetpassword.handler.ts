// src/handler/forgetpassword/forgetpassword.handler.ts
import { NotFoundError } from "../../../middleware/error";
import { UserAttributes } from "../../models/user/user.model";
import UserRepository from "../../repository/user/user.repository";
import bcrypt from "bcrypt";

const userRepo = new UserRepository();
export class ForgetPsswordHandler {
 

  async forgetPassword(
    email: string,
    password: string,
    passwordConfirm: string
  ): Promise<{ message: string }> {
  if (password !== passwordConfirm) {
    throw new Error('Passwords do not match');
  }

  // 2. Find user by email
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new NotFoundError('User not registered');
  }
const {id} = user
  // 3. Hash new password
  const passwordHash = await bcrypt.hash(password, 12);

  // 4. Update password
  await userRepo.updatePassword(id, passwordHash);

    return { message: "Password reset successfully" };
  }
}