const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');




module.exports = {
    events: async (_, req ) => {

        if(!req.isAuth){
            throw new Error('Unauthenticated!');
        }
        
        const userCheck = await User.findById(req.userId);
        const isManager = userCheck.isManager;
    
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

        try {
            if(!req.isAuth){
                throw new Error('Unauthenticated!');
            }

            const userCheck = await User.findById(req.userId);
            const isManager = userCheck.isManager;
        
            if(!isManager){
              throw new Error('Unauthorized!');
            }

            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: req.userId,
            });

            const result = await Event.insertMany([event]); 

            const createdEvent = transformEvent(result[0]); 

            const user = await User.findById(req.userId);
            if (!user) {
                throw new Error('User not found.');
            }
            user.createdEvents.push(result[0]); 
            await user.save();

            return createdEvent;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    updateEvent: async ({ eventId, eventInput }, req) => {

        try {
            if (!req.isAuth) {
                throw new Error('Unauthenticated!');
            }

            const userCheck = await User.findById(req.userId);
            const isManager = userCheck.isManager;
        
            if(!isManager){
              throw new Error('Unauthorized!');
            }

            const event = await Event.findById(eventId);
            if (!event) {
                throw new Error('Event not found.');
            }

            event.title = eventInput.title;
            event.description = eventInput.description;
            event.price = +eventInput.price;
            event.date = new Date(eventInput.date);

            const updatedEvent = await event.save();
            return transformEvent(updatedEvent);
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    deleteEvent: async ({ eventId }, req) => {

        try {
            if (!req.isAuth) {
                throw new Error('Unauthenticated!');
            }

            const userCheck = await User.findById(req.userId);
            const isManager = userCheck.isManager;
        
            if(!isManager){
              throw new Error('Unauthorized!');
            }

            const event = await Event.findById(eventId);
            if (!event) {
                throw new Error('Event not found.');
            }

            const user = await User.findById(event.creator);
            if (!user) {
                throw new Error('User not found.');
            }

            await Event.deleteOne({ _id: eventId });


            user.createdEvents.pull(eventId);
            await user.save();


            return "Event successfully deleted!";
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
};

