"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const review_handler_1 = __importDefault(require("../../handler/review/review.handler"));
const reviewHandler = new review_handler_1.default();
class ReviewController {
    // ✅ Create Review
    async createReview(req, res, next) {
        try {
            const { name, email, rating, comment, status } = req.body;
            const response = await reviewHandler.CreateReview({ name, email, rating, comment, status });
            res.status(201).json({ success: true, message: "Review created successfully.", data: response });
        }
        catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
        }
    }
    // ✅ Update Review
    async updateReview(req, res, next) {
        try {
            const { id } = req.params;
            const { name, email, rating, comment, status } = req.body;
            const [updatedCount, updatedReviews] = await reviewHandler.updateReview(Number(id), { name, email, rating, comment, status });
            if (updatedCount === 0) {
                res.status(404).json({ success: false, message: "Review not found." });
                return;
            }
            res.status(200).json({ success: true, message: "Review updated successfully.", data: updatedReviews });
        }
        catch (error) {
            next(error);
        }
    }
    // ✅ Fetch All Reviews
    async fetchAll(req, res, next) {
        try {
            const response = await reviewHandler.fetchAll();
            res.status(200).json({
                success: true,
                message: "Reviews fetched successfully.",
                response,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async fetchReview(req, res, next) {
        try {
            const response = await reviewHandler.fetchUserReview();
            res.status(200).json({
                success: true,
                message: "Reviews fetched successfully.",
                response,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // ✅ Delete Review
    async deleteReview(req, res, next) {
        try {
            const { id } = req.params;
            const deletedCount = await reviewHandler.deleteReview(Number(id));
            if (deletedCount === 0) {
                res.status(404).json({ success: false, message: "Review not found." });
                return;
            }
            res.status(200).json({ success: true, message: "Review deleted successfully." });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = ReviewController;
//# sourceMappingURL=review.controller.js.map