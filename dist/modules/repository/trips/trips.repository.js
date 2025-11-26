"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trips_model_1 = __importDefault(require("../../models/trips/trips.model"));
class TripsRepository {
    // Define your methods for interacting with the Trip model here
    async createTrip(tripData) {
        return trips_model_1.default.create(tripData);
    }
    async getTripById(id) {
        return trips_model_1.default.findByPk(id);
    }
    async getAllTrips(filters) {
        const where = {};
        if (filters?.isFirsttime)
            where.isFirsttime = filters.isFirsttime;
        if (filters?.category)
            where.category = filters.category;
        return trips_model_1.default.findAll({
            where,
            order: [["createdAt", "DESC"]],
        });
    }
    async updateTrip(id, tripData) {
        const [updatedCount, [updatedTrip]] = await trips_model_1.default.update(tripData, { where: { id }, returning: true });
        return updatedCount > 0 ? [updatedCount, [updatedTrip]] : null;
    }
    async deleteTrip(id) {
        return trips_model_1.default.destroy({ where: { id } });
    }
}
exports.default = TripsRepository;
//# sourceMappingURL=trips.repository.js.map