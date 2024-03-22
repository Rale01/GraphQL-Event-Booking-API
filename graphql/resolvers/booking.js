const { dateToString } = require('../../helpers/date');
const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { transformBooking } = require('./merge')




module.exports = {

    bookings: async (req) => {
        try {
            if(!req.isAuth){
                throw new Error('Unauthenticated!');
            }
            const bookings = await Booking.find();
            return bookings.map(async (booking) => {
                const transformedBooking = await transformBooking(booking);
                return {
                    ...transformedBooking,
                    createdAt: dateToString(transformedBooking.createdAt),
                    updatedAt: dateToString(transformedBooking.updatedAt),
                };
            });
        } catch (err) {
            throw err;
        }
    },

    bookEvent: async ({ eventId }, req) => {
        try {
            if(!req.isAuth){
                throw new Error('Unauthenticated!');
            }
            const fetchedEvent = await Event.findById(eventId);
            if (!fetchedEvent) {
                throw new Error('Event not found.');
            }
    
            const booking = new Booking({
                user: req.userId,
                event: fetchedEvent,
            });
            const result = await booking.save();
    
            const user = await User.findById(req.userId);
            if (!user) {
                throw new Error('User not found.');
            }
    
            // Update the user's createdEvents array atomically
            await User.findOneAndUpdate(
                { _id: req.userId },
                { $push: { createdEvents: fetchedEvent } }
            );
    
            const transformedBooking = transformBooking(result);
            return {
                ...transformedBooking,
                user: {
                    _id: user.id,
                    email: user.email,
                },
                event: fetchedEvent,
                createdAt: dateToString(result.createdAt),
                updatedAt: dateToString(result.updatedAt),
            };
        } catch (err) {
            throw err;
        }
    },
    
    
    

    cancelBooking: async ({ bookingId }, req) => {
        try {
            if(!req.isAuth){
                throw new Error('Unauthenticated!');
            }
            const booking = await Booking.findById(bookingId).populate('event');
            if (!booking) {
                throw new Error('Booking not found.');
            }
            if (!booking.event) {
                throw new Error('Event not found for the booking.');
            }
    
            const creator = await User.findById(booking.event.creator);
            if (!creator) {
                throw new Error('Creator not found for the booking.');
            }
    
            await Booking.deleteOne({ _id: bookingId });
    
            const transformedBooking = transformBooking(booking);
            return {
                ...transformedBooking,
                createdAt: dateToString(transformedBooking.createdAt),
                updatedAt: dateToString(transformedBooking.updatedAt),
            };
        } catch (err) {
            throw err;
        }
    },
    
    
};