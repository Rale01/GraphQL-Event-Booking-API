const Event = require('../../models/event');
const { transformEvent } = require('./merge');


module.exports = {
    events: async () => {
        try {
            const eventsList = await Event.find();
            return eventsList.map(transformEvent);
        } catch (err) {
            throw err;
        }
    },
    

    createEvent: async (args) => {
        try {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '65fb1bb2520d4774afd83531',
            });

            const result = await Event.insertMany([event]); // Use insertMany for batch operation

            const createdEvent = transformEvent(result[0]); // Get the first inserted event

            const user = await User.findById('65fb1bb2520d4774afd83531');
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

