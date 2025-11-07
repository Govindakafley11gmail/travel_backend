import { ACCESS_TOKEN } from "../../../middleware/token";
import UserRepository from "../../repository/user/user.repository";
import bcrypt from "bcrypt";

const userRepo = new UserRepository();

export default class UserService {
  async createUser(name: string, email: string, password: string, role: string, status: string   ) {
    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) throw new Error("User already exists");
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

  async updateUser(id: number, data: { name?: string; email?: string, role?: string; status?: string, password?: string }) {
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
    const { accessToken, refreshToken } = await ACCESS_TOKEN({ id: user.dataValues.id, name: user.dataValues.name, email: user.dataValues.email, role: user.dataValues.role, status:user.dataValues.status  });
    return { accessToken, refreshToken };
  }

  async findUserByEmail(email: string): Promise<any> {
     const user = await userRepo.findByEmail(email);
     return user;
  }
}
