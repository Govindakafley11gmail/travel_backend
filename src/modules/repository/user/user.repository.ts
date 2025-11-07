import User from "../../models/user/user.model"; // adjust path according to your project

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

  async update(id: number, data: { name?: string; email?: string; role?: string; status?: string, password?: string }): Promise<User | null> {
    const user = await User.findByPk(id);
    if (!user) return null;

    await User.update(data, { where: { id } });
    return user;
  }

  async delete(id: number): Promise<void> {
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
    }
  }
  async updatePassword(id: number, password: string): Promise<any> {
    try {
      const [rowsAffected, [updatedUser]] = await User.update(
        { password },                     // fields to update
        {
          where: { id },                  // condition
          returning: true,                // <-- important for PostgreSQL
          individualHooks: true,          // runs beforeUpdate hook (hashing, etc.)
        }
      );

      // `returning` works only with PostgreSQL. For MySQL/SQLite we fetch after update.

      return updatedUser ?? (await User.findByPk(id))!;
    } catch (error) {
      console.error('Error updating password:', error);
      throw new Error('Failed to update password');
    }
  }

}
