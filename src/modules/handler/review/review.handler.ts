import { ReviewIProps, ReviewRepository } from "../../repository/review/review.repository";
import Review from "../../models/review/review.model";

const reviewRepo = new ReviewRepository();

class ReviewHandler {
  async CreateReview(data: ReviewIProps): Promise<Review> {
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

  async deleteReview(id: number): Promise<number> {
    return await reviewRepo.deleteReview(id);
  }
}

export default ReviewHandler;
