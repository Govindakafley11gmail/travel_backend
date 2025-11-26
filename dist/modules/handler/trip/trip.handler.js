"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trips_repository_1 = __importDefault(require("../../repository/trips/trips.repository"));
const tripHandler = new trips_repository_1.default();
class TripHandler {
    // Trip handling logic here
    async createTrip(tripData) {
        return tripHandler.createTrip(tripData);
    }
    async getTripById(id) {
        return tripHandler.getTripById(id);
    }
    async getAllTrips() {
        return tripHandler.getAllTrips();
    }
    async updateTrip(id, tripData) {
        return tripHandler.updateTrip(id, tripData);
    }
    async deleteTrip(id) {
        return tripHandler.deleteTrip(id);
    }
}
exports.default = TripHandler;
//# sourceMappingURL=trip.handler.js.map