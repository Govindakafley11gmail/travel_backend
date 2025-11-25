import { ReviewIProps, ReviewRepository } from "../../repository/review/review.repository";
import Review from "../../models/review/review.model";
import BookingRepository from "../../repository/booking/booking.repository";

const reviewRepo = new ReviewRepository();
const bookingRepo = new BookingRepository()
class ReviewHandler {
  async CreateReview(data: ReviewIProps): Promise<Review> {
        const hasBooked = await bookingRepo.findByEmail(data.email);
            if (!hasBooked) {
                throw new Error("User has not booked any tours yet. You can book a tour first before Reviewing.");
            }
    const response = await reviewRepo.createReview(data);
    return response;
  }

  async updateReview(id: number, data: ReviewIProps): Promise<[number, Review[]]> {
    const response = await reviewRepo.updateReview(id, data);
    return response;
  }

  async fetchAll(): Promise<Review[]> {
    const response = await reviewRepo.fetchReview();
    return response;
  }
  async fetchUserReview():  Promise<Review[] | null> {
    const response = await reviewRepo.fetchActiveReview();
    return response;
  }

  async deleteReview(id: number): Promise<number> {
    return await reviewRepo.deleteReview(id);
  }
}

export default ReviewHandler;
