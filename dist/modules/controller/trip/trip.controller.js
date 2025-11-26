"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trips_repository_1 = __importDefault(require("../../repository/trips/trips.repository"));
const tripupload_1 = require("../../../middleware/tripupload");
const tripRepo = new trips_repository_1.default();
class TripController {
    // ✅ Expose Multer middleware for routes
    static upload = tripupload_1.tripupload.array("images", 5); // up to 5 images per trip
    /**
     * @desc Create a new trip
     * @route POST /api/trips
     */
    async createTrip(req, res) {
        try {
            // Extract form fields
            // ✅ Handle file uploads
            const files = req.files;
            const imageUrls = files?.map(file => `/uploads/trips/${file.filename}`) || [];
            // ✅ Prepare data for repository
            const data = {
                ...req.body,
                images: imageUrls,
            };
            // ✅ Save trip
            const trip = await tripRepo.createTrip(data);
            res.status(201).json({
                success: true,
                message: "Trip created successfully",
                trip,
            });
        }
        catch (error) {
            console.error("❌ Error creating trip:", error);
            res.status(500).json({
                success: false,
                message: "Failed to create trip",
                error: error.message,
            });
        }
    }
    /**
     * @desc Get all trips
     * @route GET /api/trips
     */
    async getAllTrips(req, res) {
        try {
            const { isFirsttime, category } = req.query;
            const filters = {};
            if (isFirsttime)
                filters.isFirsttime = isFirsttime;
            if (category)
                filters.category = category;
            // const blogs = await blogRepo.getAllBlogs(filters);
            const trips = await tripRepo.getAllTrips(filters);
            // ✅ Add full URLs for images
            const data = trips.map(trip => {
                const json = trip.toJSON();
                if (Array.isArray(json.images)) {
                    json.images = json.images.map((img) => `${req.protocol}://${req.get("host")}${img.startsWith("/") ? "" : "/"}${img}`);
                }
                else if (json.images) {
                    json.images = [`${req.protocol}://${req.get("host")}${json.images}`];
                }
                else {
                    json.images = [];
                }
                return json;
            });
            res.json({ success: true, count: data.length, data });
        }
        catch (error) {
            console.error("❌ Error fetching trips:", error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
    /**
     * @desc Get trip by ID
     * @route GET /api/trips/:id
     */
    async getTripById(req, res) {
        try {
            const { id } = req.params;
            const trip = await tripRepo.getTripById(Number(id));
            if (!trip) {
                return res.status(404).json({ success: false, message: "Trip not found" });
            }
            // Add full URLs for images
            const json = trip.toJSON();
            if (Array.isArray(json.images)) {
                json.images = json.images.map((img) => `${req.protocol}://${req.get("host")}${img.startsWith("/") ? "" : "/"}${img}`);
            }
            else if (json.images) {
                json.images = [`${req.protocol}://${req.get("host")}${json.images}`];
            }
            else {
                json.images = [];
            }
            res.json({ success: true, data: json });
        }
        catch (error) {
            console.error("❌ Error fetching trip:", error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
    /**
     * @desc Update a trip
     * @route PUT /api/trips/:id
     */
    async updateTrip(req, res) {
        try {
            const { id } = req.params;
            const tripData = { ...req.body };
            // If images are uploaded, attach file paths
            if (req.files && Array.isArray(req.files)) {
                tripData.images = req.files.map((file) => `/uploads/trips/${file.filename}`);
            }
            const trip = await tripRepo.updateTrip(Number(id), tripData);
            res.json({ message: "Trip updated successfully", data: trip });
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "An error occurred" });
        }
    }
    /**
     * @desc Delete a trip
     * @route DELETE /api/trips/:id
     */
    async deleteTrip(req, res) {
        try {
            const { id } = req.params;
            await tripRepo.deleteTrip(Number(id));
            res.json({ success: true, message: "Trip deleted successfully" });
        }
        catch (error) {
            console.error("❌ Error deleting trip:", error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.default = TripController;
//# sourceMappingURL=trip.controller.js.map