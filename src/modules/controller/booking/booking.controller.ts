import BookingHandler from "../../handler/booking/booking.handler";
const bookingHandler = new BookingHandler();

class BookingController {
    // Controller methods here
    async createBooking(req: any, res: any) {
        try {
            const bookingData = req.body;
            const booking = await bookingHandler.createBooking(bookingData);
            res.status(201).json({
                success: "success",
                message: "crated Booking Successfully"
            });
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
        }
    }

    async getBookingById(req: any, res: any) {
        try {
            const { id } = req.params;
            const booking = await bookingHandler.getBookingById(Number(id));
            if (!booking) return res.status(404).json({ error: "Booking not found" });
            res.json(booking);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
        }
    }
    async updateBooking(req: any, res: any) {
        try {
            const { id } = req.params;
            const bookingData = req.body;
            const booking = await bookingHandler.updateBooking(Number(id), bookingData);
            res.json({
                  success: "success",
                message: "Updated Booking Successfully"
            });
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
        }
    }
    async deleteBooking(req: any, res: any) {
        try {
            const { id } = req.params;
            await bookingHandler.deleteBooking(Number(id));
            res.json({ message: "Booking deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
        }
    }
    async getAllBookings(req: any, res: any) {
        try {
            const bookings = await bookingHandler.getAllBookings();
            res.json(bookings);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
        }
    }
    async getBookingByEmail(req: any, res: any) {
        try {
            const { email } = req.params;
            const booking = await bookingHandler.getBookingByEmail(email);
            if (!booking) return res.status(404).json({ error: "Booking not found" });
            res.json(booking);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
        }   
    }
}
export default BookingController;

