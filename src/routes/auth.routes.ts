import { Router } from "express";
import UserController from "../modules/controller/user/user.controller";
import { VERIFY_TOKEN } from "../middleware/token";
import BookingController from "../modules/controller/booking/booking.controller";
import ContactController from "../modules/controller/contactus/contactus.controller";
import TripController from "../modules/controller/trip/trip.controller";
import ReviewController from "../modules/controller/review/review.controller";
import { ForgetPasswordController } from "../modules/controller/forgetpassword/forgetpssword.controller";

const router = Router();
const userController = new UserController();
const bookingController = new BookingController();
const contactController = new ContactController();
const tripController = new TripController();
const reviewController = new ReviewController();
const forgetPasswordController = new ForgetPasswordController();

router.post("/user", userController.createUser.bind(userController));
router.get("/user", userController.getAllUsers.bind(userController));
router.get("/user/:id", VERIFY_TOKEN, userController.getUserById.bind(userController));
router.put("/user/:id", userController.updateUser.bind(userController));
router.delete("/user/:id", userController.deleteUser.bind(userController));

router.post("/login", userController.loginUser.bind(userController));

// bookings and trips routes can be added here similarly
router.post("/booking", bookingController.createBooking.bind(bookingController));
router.get("/booking",  bookingController.getAllBookings.bind(bookingController));
router.get("/booking/:id", VERIFY_TOKEN, bookingController.getBookingById.bind(bookingController));
router.put("/booking/:id", bookingController.updateBooking.bind(bookingController));
router.delete("/booking/:id", bookingController.deleteBooking.bind(bookingController));
router.get("/booking/:email", bookingController.getBookingByEmail.bind(bookingController));


//contact us routes can be added here similarly
router.post("/contact", contactController.createContact.bind(contactController));
router.get("/contact", contactController.getAllContacts.bind(contactController));
router.get("/contact/:id", contactController.getContactById.bind(contactController));
router.put("/contact/:id", contactController.updateContact.bind(contactController));
router.delete("/contact/:id", contactController.deleteContact.bind(contactController));


// trips routes can be added here similarly
router.post("/trips", tripController.createTrip.bind(tripController));
router.get("/trips", tripController.getAllTrips.bind(tripController));
router.get("/trips/:id", VERIFY_TOKEN, tripController.getTripById.bind(tripController));
router.put("/trips/:id", tripController.updateTrip.bind(tripController));
router.delete("/trips/:id", tripController.deleteTrip.bind(tripController));

// review routes 
router.post("/review", reviewController.createReview.bind(reviewController));
router.get("/review", reviewController.fetchAll.bind(reviewController));
router.put("/review/:id", reviewController.updateReview.bind(reviewController));
router.delete("/review/:id", reviewController.deleteReview.bind(reviewController));


router.post('/changepassword',forgetPasswordController.forgetPassword.bind(forgetPasswordController));
export default router;
