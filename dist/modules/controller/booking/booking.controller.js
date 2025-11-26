"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const booking_handler_1 = __importDefault(require("../../handler/booking/booking.handler"));
const bookingHandler = new booking_handler_1.default();
class BookingController {
    // Controller methods here
    async createBooking(req, res) {
        try {
            const bookingData = req.body;
            const booking = await bookingHandler.createBooking(bookingData);
            res.status(201).json({
                success: "success",
                message: "crated Booking Successfully"
            });
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
        }
    }
    async getBookingById(req, res) {
        try {
            const { id } = req.params;
            const booking = await bookingHandler.getBookingById(Number(id));
            if (!booking)
                return res.status(404).json({ error: "Booking not found" });
            res.json(booking);
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
        }
    }
    async updateBooking(req, res) {
        try {
            const { id } = req.params;
            const bookingData = req.body;
            const booking = await bookingHandler.updateBooking(Number(id), bookingData);
            res.json({
                success: "success",
                message: "Updated Booking Successfully"
            });
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
        }
    }
    async deleteBooking(req, res) {
        try {
            const { id } = req.params;
            await bookingHandler.deleteBooking(Number(id));
            res.json({ message: "Booking deleted successfully" });
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
        }
    }
    async getAllBookings(req, res) {
        try {
            const bookings = await bookingHandler.getAllBookings();
            res.json(bookings);
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
        }
    }
    async getBookingByEmail(req, res) {
        try {
            const { email } = req.params;
            const booking = await bookingHandler.getBookingByEmail(email);
            if (!booking)
                return res.status(404).json({ error: "Booking not found" });
            res.json(booking);
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
        }
    }
}
exports.default = BookingController;
//# sourceMappingURL=booking.controller.js.map