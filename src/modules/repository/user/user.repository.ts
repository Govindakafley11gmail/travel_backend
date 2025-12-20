import User from "../../models/user/user.model"; // adjust path

export default class UserRepository {
  async create(data: {
    name: string;
    email: string;
    password: string;
    identificationNo?: string;
    role: string;
    status: string;
    permissions?: Record<string, string[]>;
    permissionsList?: string[];
  }): Promise<User> {
    const user = await User.create(data);
    return user;
  }

  async findAll(): Promise<User[]> {
    return await User.findAll();
  }

  async findById(id: number): Promise<User | null> {
    return await User.findByPk(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  async update(
    id: number,
    data: {
      name?: string;
      email?: string;
      role?: string;
      identificationNo?: string;
      status?: string;
      password?: string;
      permissions?: Record<string, string[]>;
      permissionsList?: string[];
    }
  ): Promise<User | null> {
    const user = await User.findByPk(id);
    if (!user) return null;

    await User.update(data, { where: { id } });
    return await User.findByPk(id);
  }

  async delete(id: number): Promise<void> {
    const user = await User.findByPk(id);
    if (user) await user.destroy();
  }

  async updatePasswordWithHash(user: User, hashedPassword: string): Promise<User> {
    try {
      user.dataValues.password = hashedPassword;
      // Skip hooks so we don't double-hash
      await User.update({ password: hashedPassword }, { where: { id: user.dataValues.id }, hooks: false });
      // OR use raw query / User.update() if you prefer
      return user;
    } catch (error) {
      throw error;
    }

  }
}
