const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event')


require('dotenv').config();


const app = express();

app.use(bodyParser.json());

const schema = buildSchema(`
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type RootQuery {
        events: [Event!]!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

const rootValue = {
    events: () => {
        return Event.find()
            .then(events => {
                return events.map(event => {
                    return { ...event._doc, _id: event.id };
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
            date: new Date(args.eventInput.date)
        })
        return event.save().then(result => {
            console.log(result);
            return {...result._doc, _id: event._doc._id.toString() };
        }).catch(err =>{
            console.log(err);
            throw err;
        });
    }
};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: rootValue,
    graphiql: true // Enable GraphQL playground
}));

// Default route to open GraphQL playground without a query
app.get('/', (req, res) => {
    res.redirect('/graphql?query={}');
});

mongoose.
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@eventbookingapicluster.dyeksib.mongodb.net/${process.env.MONGO_DB}`)
.then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port http://localhost:3000');
        console.log(`MongoDB successfully connected to the database called ${process.env.MONGO_DB}`);
    });
}).catch(err => {
    console.log(err);
});


