import { NullishPropertiesOf } from "sequelize/types/utils";
import { Optional } from "sequelize/types";
import Trip, { TripAttributes, TripCreationAttributes } from "../../models/trips/trips.model";

class TripsRepository {
  // Define your methods for interacting with the Trip model here
  async createTrip(tripData:TripCreationAttributes): Promise<Trip> {
    console.log("Creating trip with data:", tripData); // Debug log
    return Trip.create(tripData);
  }

  async getTripById(id: number): Promise<Trip | null> {
    return Trip.findByPk(id);
  }

  async getAllTrips(): Promise<Trip[]> {
    return Trip.findAll();
  }

  async updateTrip(id: number, tripData: Partial<TripAttributes>): Promise<[number, Trip[]] | null> {
    const [updatedCount, [updatedTrip]] = await Trip.update(tripData, { where: { id }, returning: true });
    return updatedCount > 0 ? [updatedCount, [updatedTrip]] : null;
  }

  async deleteTrip(id: number): Promise<number> {
    return Trip.destroy({ where: { id } });
  }
}
export default TripsRepository;