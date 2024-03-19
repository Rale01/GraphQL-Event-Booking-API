const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const events = [];

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
        return events;
    },

    createEvent: (args) => {
        const event = {
            _id: Math.random().toString(),
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: args.eventInput.date
        }
        events.push(event);
        return event;
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

app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
});
