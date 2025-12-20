import { Request, Response } from "express";
import { tripupload } from "../../../middleware/tripupload";
import TripsRepository from "../../repository/trips/trips.repository";

const tripRepo = new TripsRepository();

class TripController {

  // ✅ Expose Multer middleware for routes
  static upload = tripupload.array("images", 5); // up to 5 images per trip

  /**
   * @desc Create a new trip
   * @route POST /api/trips
   */
  async createTrip(req: Request, res: Response): Promise<void> {
    try {
      // ✅ Handle Cloudinary file uploads
      const files = req.files as Express.Multer.File[] | undefined;
      
      // Get Cloudinary URLs (not local paths)
      const imageUrls = files?.map(file => (file as any).path) || [];

      // ✅ Prepare data for repository
      const data = {
        ...req.body,
        images: imageUrls, // Now contains full Cloudinary URLs
      };

      // ✅ Save trip
      const trip = await tripRepo.createTrip(data);

      res.status(201).json({
        success: true,
        message: "Trip created successfully",
        trip,
      });
    } catch (error: any) {
      console.error("❌ Error creating trip:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create trip",
        error: error.message,
      });
    }
  }

  /**
   * @desc Get all trips
   * @route GET /api/trips
   */
  async getAllTrips(req: Request, res: Response): Promise<void> {
    try {
      const { isFirsttime, category } = req.query;
      const filters: any = {};
      if (isFirsttime) filters.isFirsttime = isFirsttime;
      if (category) filters.category = category;

      const trips = await tripRepo.getAllTrips(filters);

      // ✅ Cloudinary URLs are already complete - no need to modify
      const data = trips.map(trip => {
        const json = trip.toJSON();
        // Ensure images is always an array
        if (!Array.isArray(json.images)) {
          json.images = json.images ? [json.images] : [];
        }
        return json;
      });

      res.json({ success: true, count: data.length, data });
    } catch (error: any) {
      console.error("❌ Error fetching trips:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * @desc Get trip by ID
   * @route GET /api/trips/:id
   */
  async getTripById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const trip = await tripRepo.getTripById(Number(id));

      if (!trip) {
        return res.status(404).json({ success: false, message: "Trip not found" });
      }

      // ✅ Cloudinary URLs are already complete
      const json = trip.toJSON();
      if (!Array.isArray(json.images)) {
        json.images = json.images ? [json.images] : [];
      }

      res.json({ success: true, data: json });
    } catch (error: any) {
      console.error("❌ Error fetching trip:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * @desc Update a trip
   * @route PUT /api/trips/:id
   */
  async updateTrip(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const tripData = { ...req.body };
      
      // ✅ If images are uploaded, use Cloudinary URLs
      if (req.files && Array.isArray(req.files)) {
        tripData.images = (req.files as Express.Multer.File[]).map(
          (file) => (file as any).path // Cloudinary URL
        );
      }

      const trip = await tripRepo.updateTrip(Number(id), tripData);
      res.json({ message: "Trip updated successfully", data: trip });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "An error occurred" });
    }
  }

  /**
   * @desc Delete a trip
   * @route DELETE /api/trips/:id
   */
  async deleteTrip(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await tripRepo.deleteTrip(Number(id));
      res.json({ success: true, message: "Trip deleted successfully" });
    } catch (error: any) {
      console.error("❌ Error deleting trip:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default TripController;