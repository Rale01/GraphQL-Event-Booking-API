const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

const authResolver = require('../resolvers/auth');

let isManager = authResolver.isManager;

module.exports = {
    events: async () => {
        if(!isManager){
            throw new Error('Unauthorized!');
          }
        try {
            const eventsList = await Event.find();
            return eventsList.map(transformEvent);
        } catch (err) {
            throw err;
        }
    },
    

    createEvent: async (args, req) => {
        if(!isManager){
            throw new Error('Unauthorized!');
          }
        try {
            if(!req.isAuth){
                throw new Error('Unauthenticated!');
            }

            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: req.userId,
            });

            const result = await Event.insertMany([event]); // Use insertMany for batch operation

            const createdEvent = transformEvent(result[0]); // Get the first inserted event

            const user = await User.findById(req.userId);
            if (!user) {
                throw new Error('User not found.');
            }
            user.createdEvents.push(result[0]); // Push the first inserted event
            await user.save();

            return createdEvent;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
};

