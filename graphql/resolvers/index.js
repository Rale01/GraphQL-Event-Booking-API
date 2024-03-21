const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
const bcrypt = require('bcrypt');

const events = eventIds => {
    return Event.find({_id: {$in: eventIds}})
    .then(
        events => {
            return events.map(event => {
                return { 
                    ...event._doc,
                     _id: event.id,
                     date: new Date(event._doc.date).toISOString(),
                    creator: user(event.creator) };
            })
        }
    )
    .catch(err =>{
        throw err;
    })
}

const user = userId => {
    return User.findById(userId)
    .then(user => {
        return { 
            ...user._doc,
            _id: user.id,
            createdEvents: events(user._doc.createdEvents) 
        };
    })
    .catch(err => {
        throw err;
    })
}

const singleEvent = eventId => {
    return Event.findById(eventId)
    .then(event => {
        return {
            ...event._doc,
            _id: event.id, 
            creator: user(event.creator)
        };
    })
    .catch(err => {
        throw err;
    })
}

module.exports = {
    events: () => {
        return Event.find()
            .then(events => {
                return events.map(event => {
                    return { 
                        ...event._doc, 
                        _id: event.id,
                        date: new Date(event._doc.date).toISOString(),
                        creator: user(event._doc.creator)
                    };
                });
            })
            .catch(err => {
                throw err;
            });
    },

    bookings: () => {
        return Booking.find()
            .then(bookings => {
                return bookings.map(booking => {
                    return { 
                        ...booking._doc,
                        _id: booking.id,
                        user: user(booking._doc.user),
                        event: singleEvent(booking._doc.event),
                        createdAt: new Date(booking._doc.createdAt).toISOString(),
                        updatedAt: new Date(booking._doc.updatedAt).toISOString(),
                    };
                });
            })
            .catch(err => {
                throw err;
            });
    },

    createEvent: (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '65fb1bb2520d4774afd83531'
        })

        let createdEvent;

        return event.save().then(result => {
            createdEvent = {
                ...result._doc,
                _id: event._doc._id.toString(), 
                date: new Date(event._doc.date).toISOString(),
                creator: user(result._doc.creator) 
            }
            return User.findById('65fb1bb2520d4774afd83531')
        })
        .then(user => {
            if(!user){
                throw new Error('User not found.')
            }
            user.createdEvents.push(event);
            return user.save();
        })
        .then(result => {
            return createdEvent;
        })
        .catch(err =>{
            console.log(err);
            throw err;
        });
    },

    createUser: (args) => {
       return  User.findOne({email: args.userInput.email}).then(
            user => {
                if(user){
                    throw new Error('User exists already.')
                }
                return bcrypt.hash(args.userInput.password, 12)
            }
        ).then(
            hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                });
                return user.save();
            })
            .then(result => {
                return {...result._doc, _id: result.id, password: null};
            })
            .catch(err => {
            throw err;
        })

    },

    bookEvent: ({ eventId }) => {
        return Event.findOne({_id: eventId})
        .then(fetchedEvent => {
            const booking = new Booking({
                user: '65fb1bb2520d4774afd83531',
                event: fetchedEvent
            });
            return booking.save();
        })
        .then(result => {
            return { 
                ...result._doc,
                _id: result.id, 
                user: user(result._doc.user),
                event: singleEvent(result._doc.event),
                createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString(),
            };
        });
    },
    cancelBooking: ({ bookingId }) => {
        return Booking.findById(bookingId).populate('event')
        .then(booking => {
            if (!booking) {
                throw new Error('Booking not found.');
            }
            if (!booking.event) {
                throw new Error('Event not found for the booking.');
            }

            return User.findById(booking.event.creator)
            .then(creator => {
                if (!creator) {
                    throw new Error('Creator not found for the booking.');
                }

                const event = {
                    ...booking.event.toObject(),
                    _id: booking.event._id,
                    creator: creator
                };

                return Booking.deleteOne({ _id: bookingId }).then(() => event);
            });
        })
        .catch(err => {
            throw err;
        });
    }
};
