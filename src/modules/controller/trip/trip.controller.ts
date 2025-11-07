import { Request, Response } from "express";
import TripHandler from "../../handler/trip/trip.handler";
const tripHandler = new TripHandler();
class TripController {
    // Controller methods here
    async createTrip(req: Request, res: Response) {
        try {
            console.log("Request Body:", req.body); // Debug log
            const tripData = req.body;
            const trip = await tripHandler.createTrip(tripData);
            res.status(201).json(trip);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
        }
    }
    async getTripById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const trip = await tripHandler.getTripById(Number(id));
            if (!trip) return res.status(404).json({ error: "Trip not found" });
            res.json(trip);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
        }
    }
    async getAllTrips(req: Request, res: Response) {
        try {
            const trips = await tripHandler.getAllTrips();
            res.json(trips);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
        }   
    }
    async updateTrip(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const tripData = req.body;
            const trip = await tripHandler.updateTrip(Number(id), tripData);
            res.json(trip);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
        }   
    }
    async deleteTrip(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await tripHandler.deleteTrip(Number(id));
            res.json({ message: "Trip deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
        }
    }
}
export default TripController;