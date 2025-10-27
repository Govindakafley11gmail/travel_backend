import { ACCESS_TOKEN } from "../../../middleware/token";
import UserRepository from "../../repository/user/user.repository";
import bcrypt from "bcrypt";

const userRepo = new UserRepository();

export default class UserService {
  async createUser(name: string, email: string, password: string, role: string, status: string   ) {
    console.log("Creating user with:", { name, email, password, role, status });
    const existingUser = await userRepo.findByEmail(email);
    if (!existingUser) throw new Error("User already exists");
    const hashedPassword = await bcrypt.hash(password, 10);
    return userRepo.create({ name, email, password: hashedPassword, role:role||'user', status:status||'active'  });
  }

  async getAllUsers() {
    return userRepo.findAll();
  }

  async getUserById(id: number) {
    if (!id) throw new Error("Invalid user ID");
    return userRepo.findById(id);
  }

  async updateUser(id: number, data: { name?: string; email?: string }) {
    if (!id) throw new Error("Invalid user ID");
    return userRepo.update(id, data);
  }

  async deleteUser(id: number) {
    if (!id) throw new Error("Invalid user ID");
    return userRepo.delete(id);
  }

  async loginUser(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await userRepo.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user?.dataValues.password))) throw new Error("Invalid credentials");
    const { accessToken, refreshToken } = await ACCESS_TOKEN({ id: user.id, name: user.name, email: user.email });
    return { accessToken, refreshToken };
  }
}
