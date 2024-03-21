const { dateToString } = require('../../helpers/date');
const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { transformBooking } = require('./merge')




module.exports = {

    bookings: async () => {
        try {
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

    bookEvent: async ({ eventId }) => {
        try {
            const fetchedEvent = await Event.findById(eventId);
            if (!fetchedEvent) {
                throw new Error('Event not found.');
            }
    
            const booking = new Booking({
                user: '65fb1bb2520d4774afd83531',
                event: fetchedEvent,
            });
            const result = await booking.save();
    
            const user = await User.findById('65fb1bb2520d4774afd83531');
            if (!user) {
                throw new Error('User not found.');
            }
    
            // Update the user's createdEvents array atomically
            await User.findOneAndUpdate(
                { _id: '65fb1bb2520d4774afd83531' },
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
    
    
    

    cancelBooking: async ({ bookingId }) => {
        try {
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