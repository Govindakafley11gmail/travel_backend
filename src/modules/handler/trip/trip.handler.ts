import { Optional } from "sequelize";
import { NullishPropertiesOf } from "sequelize/types/utils";
import tripsRepository from "../../repository/trips/trips.repository";
import TripsRepository from "../../repository/trips/trips.repository";
import Trip, { TripCreationAttributes } from "../../models/trips/trips.model";
const tripHandler = new TripsRepository();
class TripHandler {
    // Trip handling logic here
    async createTrip(tripData: TripCreationAttributes): Promise<Trip> {
        return tripHandler.createTrip(tripData);
    }
    async getTripById(id: number): Promise<Trip | null> {
        return tripHandler.getTripById(id);
    }
    async getAllTrips(): Promise<Trip[]> {
        return tripHandler.getAllTrips();
    }
    async updateTrip(id: number, tripData: Partial<TripCreationAttributes>): Promise<[number, Trip[]] | null> {
        return tripHandler.updateTrip(id, tripData);
    }
    async deleteTrip(id: number): Promise<number> {
        return tripHandler.deleteTrip(id);
    }
}

export default TripHandler;