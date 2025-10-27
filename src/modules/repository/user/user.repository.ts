import  User  from "../../models/user/user.model"; // adjust path according to your project

export default class UserRepository {
  async create(data: { name: string; email: string; password: string, role: string, status: string }): Promise<User> {
    const user = await User.create(data);
    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await User.findAll();
    return users;
  }

  async findById(id: number): Promise<User | null> {
    const user = await User.findByPk(id);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await User.findOne({ where: { email } });
    return user;
  }

  async update(id: number, data: { name?: string; email?: string }): Promise<User | null> {
    const user = await User.findByPk(id);
    if (!user) return null;

    await user.update(data);
    return user;
  }

  async delete(id: number): Promise<void> {
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
    }
  }
}
