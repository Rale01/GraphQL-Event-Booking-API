const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { transformBooking, transformEvent } = require('./merge');
const { dateToString } = require('../../helpers/date');

const authResolver = require('../resolvers/auth');

let isManager = authResolver.isManager;

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    if(isManager){
      throw new Error('Unauthorized!');
    }
    console.log(isManager);
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    if(isManager){
      throw new Error('Unauthorized!');
    }
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent,
      createdAt: dateToString(new Date()),
      updateAt: dateToString(new Date()),
    });
    const result = await booking.save();
    return transformBooking(result);
  },

  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    if(isManager){
      throw new Error('Unauthorized!');
    }
    try {

      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;

    } catch (err) {
      throw err;
    }
  }
};