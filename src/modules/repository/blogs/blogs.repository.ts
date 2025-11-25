import { Op, Transaction } from "sequelize";
import sequelize from "../../../config/db";

import BlogItem, {
  BlogItemCreationAttributes,
} from "../../models/blogs/BlogItem";
import Blog, { BlogCreationAttributes } from "../../models/blogs/blogs.model";

class BlogRepository {
  // Create a new blog + its items
  async createBlog(
    data: BlogCreationAttributes & { items?: BlogItemCreationAttributes[] }
  ) {
    try {
      const blog = await Blog.create(data);
      if (data.items && data.items.length > 0) {
        const itemsToCreate = data.items.map((item: any) => ({
          ...item,
          blog_id: blog.dataValues.id,
        }));
        await BlogItem.bulkCreate(itemsToCreate);
      }

      return await Blog.findByPk(blog.dataValues.id, {
        include: [{ model: BlogItem, as: "items" }],
      });
    } catch (error) {
      throw error;
    }

  }

  // Get all blogs with filters
  async getAllBlogs(filters?: {
    category?: string;
    is_published?: boolean;
    id?: number;
  }) {
    try {
      const where: any = {};

      if (filters?.category) where.category = filters.category;
      if (filters?.is_published !== undefined)
        where.is_published = filters.is_published;
      if (filters?.id) where.id = filters.id;

      const response = await Blog.findAll({
        where,
        include: [{ model: BlogItem ,as: "items"}],
        order: [["published_at", "DESC"]],
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get one blog by ID
  async getBlogById(id: number) {
    return await Blog.findByPk(id, {
      include: [{ model: BlogItem, as: "items" }],
    });
  }

  // Update blog (supports partial updates + full item replacement)
  async updateBlog(
    id: number,
    data: Partial<BlogCreationAttributes> & {
      items?: BlogItemCreationAttributes[];
    }
  ) {
    return await sequelize.transaction(async (t: Transaction) => {
      const blog = await Blog.findByPk(id, { transaction: t });
      if (!blog) return null;

      // Update root blog fields
      await blog.update(data, { transaction: t });

      // Replace items completely (simplest & safest for your admin)
      if ("items" in data) {
        await BlogItem.destroy({
          where: { blog_id: id },
          transaction: t,
        });

        if (data.items && data.items.length > 0) {
          const itemsToCreate = data.items.map((item: any) => ({
            ...item,
            blog_id: id,
          }));
          await BlogItem.bulkCreate(itemsToCreate, { transaction: t });
        }
      }

      return await Blog.findByPk(id, {
        include: [{ model: BlogItem, as: "items" }],
        transaction: t,
      });
    });
  }

  // Soft or hard delete
  async deleteBlog(id: number): Promise<boolean> {
    return await sequelize.transaction(async (t: Transaction) => {
      await BlogItem.destroy({ where: { blog_id: id }, transaction: t });
      const deleted = await Blog.destroy({ where: { id }, transaction: t });
      return deleted > 0;
    });
  }

  // Full-text search across title/content in blog items
  async searchBlogs(query: string) {
    const searchTerm = `%${query}%`;

    return await Blog.findAll({
      include: [
        {
          model: BlogItem,
          as: "items",
          where: {
            [Op.or]: [
              { title: { [Op.like]: searchTerm } },
              { content: { [Op.like]: searchTerm } },
            ],
          },
        },
      ],
      order: [["published_at", "DESC"]],
    });
  }

  // Publish blog (sets is_published + published_at)
  async publishBlog(id: number) {
    return await sequelize.transaction(async (t: Transaction) => {
      const blog = await Blog.findByPk(id, { transaction: t });
      if (!blog) return null;

      blog.is_published = true;
      blog.published_at = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      await blog.save({ transaction: t });

      return blog;
    });
  }

  // Unpublish blog
  async unpublishBlog(id: number) {
    const blog = await Blog.findByPk(id);
    if (!blog) return null;

    blog.is_published = false;
    // Optionally clear published_at or keep it as history
    // blog.published_at = null;
    await blog.save();
    return blog;
  }

  // Get only published blogs (for frontend)
  async getPublishedBlogs() {
    return await Blog.findAll({
      where: { is_published: true },
      include: [{ model: BlogItem, as: "items" }],
      order: [["published_at", "DESC"]],
    });
  }
}

export default BlogRepository;