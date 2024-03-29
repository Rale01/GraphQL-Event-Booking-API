const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

const events = async (eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(transformEvent);
    } catch (err) {
        throw err;
    }
};

const user = async (userId) => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: await events(user._doc.createdEvents),
        };
    } catch (err) {
        throw err;
    }
};

const singleEvent = async (eventId) => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
    } catch (err) {
        throw err;
    }
};

const transformEvent = async (event) => ({
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: await user(event.creator),
});

const transformBooking = async (booking) => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: await user(booking._doc.user),
        event: await singleEvent(booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt),
    };
};


exports.user = user;
exports.events = events;
exports.singleEvent = singleEvent; 
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;