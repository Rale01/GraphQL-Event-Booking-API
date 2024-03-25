const Event = require('../../models/event');
const Booking = require('../../models/booking');
const User = require('../../models/user');
const { transformBooking, transformEvent } = require('./merge');






module.exports = {
  bookings: async (_, req ) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    const user = await User.findById(req.userId);
    const isManager = user.isManager;


    if(!isManager){
      throw new Error('Unauthorized!');
    }
    
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
    
    const user = await User.findById(req.userId);
    const isManager = user.isManager;
  

    if(isManager){
      throw new Error('Unauthorized!');
    }
 
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent,
      createdAt: new Date(),
      updateAt: new Date(),
    });
    const result = await booking.save();
    return transformBooking(result);
  },

  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    const user = await User.findById(req.userId);
    const isManager = user.isManager;
  

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