"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const review_repository_1 = require("../../repository/review/review.repository");
const booking_repository_1 = __importDefault(require("../../repository/booking/booking.repository"));
const reviewRepo = new review_repository_1.ReviewRepository();
const bookingRepo = new booking_repository_1.default();
class ReviewHandler {
    async CreateReview(data) {
        const hasBooked = await bookingRepo.findByEmail(data.email);
        if (!hasBooked) {
            throw new Error("User has not booked any tours yet. You can book a tour first before Reviewing.");
        }
        const response = await reviewRepo.createReview(data);
        return response;
    }
    async updateReview(id, data) {
        const response = await reviewRepo.updateReview(id, data);
        return response;
    }
    async fetchAll() {
        const response = await reviewRepo.fetchReview();
        return response;
    }
    async fetchUserReview() {
        const response = await reviewRepo.fetchActiveReview();
        return response;
    }
    async deleteReview(id) {
        return await reviewRepo.deleteReview(id);
    }
}
exports.default = ReviewHandler;
//# sourceMappingURL=review.handler.js.map