import { Request, Response, NextFunction } from "express";
import ReviewHandler from "../../handler/review/review.handler";
import { ReviewIProps } from "../../repository/review/review.repository";

const reviewHandler = new ReviewHandler();

class ReviewController {
  // ✅ Create Review
  async createReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        console.log(req.body)
      const { name, email, rating, comment,status } = req.body as ReviewIProps;

      const response = await reviewHandler.CreateReview({ name, email, rating, comment, status });
      res.status(201).json({ success: true, message: "Review created successfully.", data: response });
    } catch (error) {
      next(error);
    }
  }

  // ✅ Update Review
  async updateReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email, rating, comment, status } = req.body as ReviewIProps;

      const [updatedCount, updatedReviews] = await reviewHandler.updateReview(Number(id), { name, email, rating, comment, status });

      if (updatedCount === 0) {
        res.status(404).json({ success: false, message: "Review not found." });
        return;
      }

      res.status(200).json({ success: true, message: "Review updated successfully.", data: updatedReviews });
    } catch (error) {
      next(error);
    }
  }

  // ✅ Fetch All Reviews
  async fetchAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = await reviewHandler.fetchAll();

      res.status(200).json({
        success: true,
        message: "Reviews fetched successfully.",
        response,
      });
    } catch (error) {
      next(error);
    }
  }

  // ✅ Delete Review
  async deleteReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deletedCount = await reviewHandler.deleteReview(Number(id));

      if (deletedCount === 0) {
        res.status(404).json({ success: false, message: "Review not found." });
        return;
      }

      res.status(200).json({ success: true, message: "Review deleted successfully." });
    } catch (error) {
      next(error);
    }
  }
}

export default ReviewController;
