"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_repository_1 = __importDefault(require("../../repository/product/product.repository"));
const upload_1 = require("../../../middleware/upload");
const product_handler_1 = __importDefault(require("../../handler/product/product.handler"));
const productRepo = new product_repository_1.default();
const producthandler = new product_handler_1.default();
class ProductController {
    productRepo = new product_repository_1.default();
    // ✅ Expose Multer middleware for routes
    static upload = upload_1.upload.array("images", 5); // up to 5 images per product
    /**
     * @desc Create new product
     * @route POST /api/products
     */
    async createProduct(req, res) {
        try {
            // Extract form fields
            const { category, product_name, original_price, discount_percent, description, final_price } = req.body;
            // ✅ Safely handle file uploads
            const files = req.files;
            const imageUrls = files?.map((file) => `/uploads/products/${file.filename}`) || [];
            // ✅ Prepare data for repository
            const data = {
                category,
                product_name,
                original_price: Number(original_price),
                discount_percent: discount_percent ? Number(discount_percent) : undefined,
                description: description || null,
                final_price,
                images: imageUrls,
            };
            // ✅ Save product
            const product = await this.productRepo.create(data);
            res.status(201).json({
                success: true,
                message: "Product created successfully",
            });
        }
        catch (error) {
            console.error("❌ Error creating product:", error);
            res.status(500).json({
                success: false,
                message: "Failed to create product",
                error: error.message,
            });
        }
    }
    /**
     * @desc Get all products with pagination and optional search
     * @route GET /api/products
     */
    async getAllProducts(req, res) {
        try {
            const { page = 1, limit = 10, search } = req.query;
            const result = await this.productRepo.findAll({
                page: Number(page),
                limit: Number(limit),
                search: search?.toString(),
            });
            // Add full URLs for images
            const data = result.rows.map(product => {
                const json = product.toJSON();
                if (Array.isArray(json.images)) {
                    // Tell TypeScript: these are all strings
                    json.images = json.images.map((img) => `${req.protocol}://${req.get("host")}${img.startsWith("/") ? "" : "/"}${img}`);
                }
                else {
                    // Wrap single string in array
                    json.images = [
                        `${req.protocol}://${req.get("host")}${json.images.startsWith("/") ? "" : "/"}${json.images}`
                    ];
                }
                return json;
            });
            res.json({ success: true, count: result.count, data });
        }
        catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
    /**
     * @desc Get product by ID
     * @route GET /api/products/:id
     */
    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await this.productRepo.findById(Number(id));
            if (!product) {
                res.status(404).json({ success: false, error: "Product not found" });
                return;
            }
            // const productJson = product.toJSON();
            // productJson.images = productJson.images?.map(
            //   (img: string) => `${req.protocol}://${req.get("host")}${img}`
            // );
            res.json({ success: true });
        }
        catch (error) {
            console.error("❌ Error fetching product:", error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch product",
                error: error.message,
            });
        }
    }
    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            // ✅ Safely handle file uploads
            const files = req.files;
            const imageUrls = files?.map((file) => `/uploads/products/${file.filename}`) || [];
            // ✅ Prepare data for repository
            const data = {
                ...req.body,
                images: imageUrls,
            };
            // Recalculate final_price if original_price or discount_percent is updated
            if (data.original_price || data.discount_percent) {
                const product = await this.productRepo.findById(Number(id));
                if (!product)
                    return res.status(404).json({ success: false, message: "Product not found" });
                const final_price = (data.original_price ?? product.original_price) -
                    ((data.original_price ?? product.original_price) * (data.discount_percent ?? product.discount_percent) / 100);
                data.final_price = final_price;
            }
            const updatedProduct = await this.productRepo.update(Number(id), data);
            res.json({ success: true, message: "Product updated successfully", product: updatedProduct });
        }
        catch (error) {
            console.error("Error updating product:", error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // DELETE PRODUCT
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            await this.productRepo.delete(Number(id));
            res.json({ success: true, message: "Product deleted successfully" });
        }
        catch (error) {
            console.error("Error deleting product:", error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async createOrder(req, res) {
        try {
            const { customer, items, subtotal, total } = req.body;
            if (!customer || !items || !subtotal || !total) {
                return res.status(400).json({ error: "Missing required fields" });
            }
            // create a repository instance for this static method
            const order = await producthandler.CreateOrder(customer, items, subtotal, total);
            if (!order.success) {
                return res.status(400).json({ error: order.message });
            }
            return res.status(201).json({
                status: true,
                message: "Order created successfully",
            });
        }
        catch (error) {
            console.error("Error creating order:", error);
            return res.status(500).json({ error: error.message || "Server error" });
        }
    }
    async updateOrder(req, res) {
        try {
            const { id } = req.params; // get order ID from URL parameter
            const { name, email, phone, status, items, subtotal, total } = req.body;
            if (!id) {
                return res.status(400).json({ error: "Order ID is required" });
            }
            if (!items && !subtotal && !total) {
                return res.status(400).json({ error: "At least one field is required to update" });
            }
            // Call your handler/repository update method
            const order = await producthandler.UpdateOrder(id, { name, email, phone, status, items, subtotal, total });
            if (!order.success) {
                return res.status(400).json({ error: order.message });
            }
            return res.status(200).json({
                status: true,
                message: "Order updated successfully",
                data: order.data, // optionally return the updated order
            });
        }
        catch (error) {
            console.error("Error updating order:", error);
            return res.status(500).json({ error: error.message || "Server error" });
        }
    }
    async getOrders(req, res) {
        try {
            const orders = await productRepo.getAllOrders();
            return res.status(200).json({ orders });
        }
        catch (error) {
            console.error("Error fetching orders:", error);
            return res.status(500).json({ error: error.message || "Server error" });
        }
    }
}
exports.default = ProductController;
//# sourceMappingURL=product.controller.js.map