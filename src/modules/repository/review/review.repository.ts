import Review from "../../models/review/review.model";
import { Optional } from 'sequelize';

export interface ReviewAttributes {
    id: number;
    name: string;
    email: string;
    rating: string;
    comment: string;
    status: boolean;
}

export interface ReviewIProps extends Optional<ReviewAttributes, 'id'> {}
export class ReviewRepository {
    async createReview(data: ReviewIProps):Promise<Review> {
        const response = await Review.create(data)
        return response;
    }
    async updateReview(id:number,data: ReviewIProps):Promise<[number, Review[]]>{
        const response = await Review.update(data,{ where:{ id }, returning: true });
        return response as unknown as [number, Review[]];
    }

    async fetchReview(): Promise<Review[]> {
        const response = await Review.findAll();
        return response || null;
    }
    async deleteReview(id: number):Promise<number>{
        const response = await Review.destroy({where:{id}});
        return response;
    }
}
