"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../../config/db"));
const BlogItem_1 = __importDefault(require("../../models/blogs/BlogItem"));
const blogs_model_1 = __importDefault(require("../../models/blogs/blogs.model"));
class BlogRepository {
    // Create a new blog + its items
    async createBlog(data) {
        try {
            const blog = await blogs_model_1.default.create(data);
            if (data.items && data.items.length > 0) {
                const itemsToCreate = data.items.map((item) => ({
                    ...item,
                    blog_id: blog.dataValues.id,
                }));
                await BlogItem_1.default.bulkCreate(itemsToCreate);
            }
            return await blogs_model_1.default.findByPk(blog.dataValues.id, {
                include: [{ model: BlogItem_1.default, as: "items" }],
            });
        }
        catch (error) {
            throw error;
        }
    }
    // Get all blogs with filters
    async getAllBlogs(filters) {
        try {
            const where = {};
            if (filters?.category)
                where.category = filters.category;
            if (filters?.is_published !== undefined)
                where.is_published = filters.is_published;
            if (filters?.id)
                where.id = filters.id;
            const response = await blogs_model_1.default.findAll({
                where,
                include: [{ model: BlogItem_1.default, as: "items" }],
                order: [["published_at", "DESC"]],
            });
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    // Get one blog by ID
    async getBlogById(id) {
        return await blogs_model_1.default.findByPk(id, {
            include: [{ model: BlogItem_1.default, as: "items" }],
        });
    }
    // Update blog (supports partial updates + full item replacement)
    async updateBlog(id, data) {
        return await db_1.default.transaction(async (t) => {
            const blog = await blogs_model_1.default.findByPk(id, { transaction: t });
            if (!blog)
                return null;
            // Update root blog fields
            await blog.update(data, { transaction: t });
            // Replace items completely (simplest & safest for your admin)
            if ("items" in data) {
                await BlogItem_1.default.destroy({
                    where: { blog_id: id },
                    transaction: t,
                });
                if (data.items && data.items.length > 0) {
                    const itemsToCreate = data.items.map((item) => ({
                        ...item,
                        blog_id: id,
                    }));
                    await BlogItem_1.default.bulkCreate(itemsToCreate, { transaction: t });
                }
            }
            return await blogs_model_1.default.findByPk(id, {
                include: [{ model: BlogItem_1.default, as: "items" }],
                transaction: t,
            });
        });
    }
    // Soft or hard delete
    async deleteBlog(id) {
        return await db_1.default.transaction(async (t) => {
            await BlogItem_1.default.destroy({ where: { blog_id: id }, transaction: t });
            const deleted = await blogs_model_1.default.destroy({ where: { id }, transaction: t });
            return deleted > 0;
        });
    }
    // Full-text search across title/content in blog items
    async searchBlogs(query) {
        const searchTerm = `%${query}%`;
        return await blogs_model_1.default.findAll({
            include: [
                {
                    model: BlogItem_1.default,
                    as: "items",
                    where: {
                        [sequelize_1.Op.or]: [
                            { title: { [sequelize_1.Op.like]: searchTerm } },
                            { content: { [sequelize_1.Op.like]: searchTerm } },
                        ],
                    },
                },
            ],
            order: [["published_at", "DESC"]],
        });
    }
    // Publish blog (sets is_published + published_at)
    async publishBlog(id) {
        return await db_1.default.transaction(async (t) => {
            const blog = await blogs_model_1.default.findByPk(id, { transaction: t });
            if (!blog)
                return null;
            blog.is_published = true;
            blog.published_at = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
            await blog.save({ transaction: t });
            return blog;
        });
    }
    // Unpublish blog
    async unpublishBlog(id) {
        const blog = await blogs_model_1.default.findByPk(id);
        if (!blog)
            return null;
        blog.is_published = false;
        // Optionally clear published_at or keep it as history
        // blog.published_at = null;
        await blog.save();
        return blog;
    }
    // Get only published blogs (for frontend)
    async getPublishedBlogs() {
        return await blogs_model_1.default.findAll({
            where: { is_published: true },
            include: [{ model: BlogItem_1.default, as: "items" }],
            order: [["published_at", "DESC"]],
        });
    }
}
exports.default = BlogRepository;
//# sourceMappingURL=blogs.repository.js.map