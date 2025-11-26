"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const blogs_repository_1 = __importDefault(require("../../repository/blogs/blogs.repository"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const blogRepo = new blogs_repository_1.default();
// AUTO-CREATE UPLOAD DIRECTORY (Fixes ENOENT forever)
const uploadDir = path_1.default.join(process.cwd(), "uploads", "blogs");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
    console.log("Created upload directory:", uploadDir);
}
class BlogController {
    async createBlog(req, res) {
        try {
            const { category, is_published, published_at } = req.body;
            // Parse items if sent as string
            let items = typeof req.body.items === "string" ? JSON.parse(req.body.items) : req.body.items || [];
            const uploadedFiles = req.files;
            console.log("Uploaded files:", uploadedFiles?.map(f => f.originalname));
            // Map images to correct items
            items = items.map((item, index) => {
                const itemFiles = uploadedFiles?.filter((file) => {
                    const match = file.fieldname.match(/items\[(\d+)\]\[images\]\[\]/);
                    return match && parseInt(match[1]) === index;
                });
                const imageUrls = itemFiles?.map(file => `/uploads/blogs/${file.filename}`) || [];
                return { ...item, images: imageUrls };
            });
            const blogData = {
                category,
                is_published: is_published === "true",
                published_at: published_at || null,
                items,
            };
            const blog = await blogRepo.createBlog(blogData);
            return res.status(201).json({
                success: true,
                message: "Blog created successfully",
                data: blog,
            });
        }
        catch (error) {
            console.error("Create blog error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to create blog",
                error: error.message,
            });
        }
    }
    async updateBlog(req, res) {
        try {
            const { id } = req.params;
            const { category, is_published, published_at } = req.body;
            let items = typeof req.body.items === "string" ? JSON.parse(req.body.items) : req.body.items || [];
            const uploadedFiles = req.files;
            console.log("Update - Uploaded files:", uploadedFiles?.map(f => f.originalname));
            if (uploadedFiles && uploadedFiles.length > 0) {
                items = items.map((item, index) => {
                    const itemFiles = uploadedFiles.filter((file) => {
                        const match = file.fieldname.match(/items\[(\d+)\]\[images\]\[\]/);
                        return match && parseInt(match[1]) === index;
                    });
                    const newImageUrls = itemFiles.map(file => `/uploads/blogs/${file.filename}`);
                    return {
                        ...item,
                        images: newImageUrls.length > 0 ? newImageUrls : item.images || [],
                    };
                });
            }
            const updateData = {
                category,
                is_published: is_published === "true",
                published_at: published_at || null,
                items,
            };
            const blog = await blogRepo.updateBlog(Number(id), updateData);
            if (!blog) {
                return res.status(404).json({ success: false, message: "Blog not found" });
            }
            return res.status(200).json({
                success: true,
                message: "Blog updated successfully",
                data: blog,
            });
        }
        catch (error) {
            console.error("Update blog error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to update blog",
                error: error.message,
            });
        }
    }
    async deleteBlog(req, res) {
        try {
            const { id } = req.params;
            const deleted = await blogRepo.deleteBlog(Number(id));
            if (!deleted)
                return res.status(404).json({ success: false, message: "Blog not found" });
            return res.status(200).json({ success: true, message: "Blog deleted successfully" });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Failed to delete blog", error: error.message });
        }
    }
    async getAllBlogs(req, res) {
        try {
            const { category, is_published, id } = req.query;
            const filters = {};
            if (category)
                filters.category = category;
            if (is_published !== undefined)
                filters.is_published = is_published === "true";
            if (id)
                filters.id = Number(id);
            const blogs = await blogRepo.getAllBlogs(filters);
            // Convert to plain objects
            const plainBlogs = blogs.map(blog => blog.get({ plain: true }));
            const host = `${req.protocol}://${req.get("host")}`;
            const withFullUrls = plainBlogs.map((blog) => {
                if (blog.items && Array.isArray(blog.items)) {
                    blog.items = blog.items.map((item) => {
                        // FIX THE MAIN BUG: Clean invalid images
                        let cleanImages = [];
                        if (Array.isArray(item.images)) {
                            cleanImages = item.images
                                .filter((img) => {
                                return typeof img === "string" && img.trim() !== "";
                            })
                                .map((img) => img.startsWith("http") ? img : `${host}${img}`);
                        }
                        return {
                            ...item,
                            images: cleanImages, // ← Now always clean array of strings
                        };
                    });
                }
                return blog;
            });
            return res.status(200).json({
                success: true,
                message: "List successfully",
                data: withFullUrls, // ← You wanted "blogs" key
            });
        }
        catch (error) {
            console.error("Error in getAllBlogs:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch blogs",
                error: error.message || "Internal server error",
            });
        }
    }
    async getBlogById(req, res) {
        try {
            const blog = await blogRepo.getBlogById(Number(req.params.id));
            if (!blog)
                return res.status(404).json({ success: false, message: "Blog not found" });
            const plainBlogs = [blog].map(blog => blog.get({ plain: true }));
            const host = `${req.protocol}://${req.get("host")}`;
            const withFullUrls = plainBlogs.map((blog) => {
                if (blog.items && Array.isArray(blog.items)) {
                    blog.items = blog.items.map((item) => {
                        // FIX THE MAIN BUG: Clean invalid images
                        let cleanImages = [];
                        if (Array.isArray(item.images)) {
                            cleanImages = item.images
                                .filter((img) => {
                                return typeof img === "string" && img.trim() !== "";
                            })
                                .map((img) => img.startsWith("http") ? img : `${host}${img}`);
                        }
                        return {
                            ...item,
                            images: cleanImages, // ← Now always clean array of strings
                        };
                    });
                }
                return blog;
            });
            return res.status(200).json({ success: true, data: withFullUrls });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Failed to fetch blog", error: error.message });
        }
    }
    async searchBlogs(req, res) {
        try {
            const { q } = req.query;
            if (!q || typeof q !== "string" || q.trim().length < 2) {
                return res.status(400).json({ success: false, message: "Search query must be at least 2 characters" });
            }
            const blogs = await blogRepo.searchBlogs(q.trim());
            return res.status(200).json({ success: true, count: blogs.length, data: blogs });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Search failed", error: error.message });
        }
    }
    async publishBlog(req, res) {
        try {
            const blog = await blogRepo.publishBlog(Number(req.params.id));
            if (!blog)
                return res.status(404).json({ success: false, message: "Blog not found" });
            return res.status(200).json({ success: true, message: "Blog published", data: blog });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Failed to publish", error: error.message });
        }
    }
    async unpublishBlog(req, res) {
        try {
            const blog = await blogRepo.unpublishBlog(Number(req.params.id));
            if (!blog)
                return res.status(404).json({ success: false, message: "Blog not found" });
            return res.status(200).json({ success: true, message: "Blog unpublished", data: blog });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Failed to unpublish", error: error.message });
        }
    }
    async getCountries(req, res) {
        try {
            const response = await fetch("https://www.apicountries.com/countries");
            // Convert body to JSON
            const data = await response.json();
            return res.status(200).json(data);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch countries",
                error: error instanceof Error ? error.message : error
            });
        }
    }
}
exports.BlogController = BlogController;
exports.default = new BlogController();
//# sourceMappingURL=blogs.controller.js.map