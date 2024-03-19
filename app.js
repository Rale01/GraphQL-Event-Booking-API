const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

const schema = buildSchema(`
    type RootQuery {
        events: [String!]!
    }

    type RootMutation {
        createEvent(name: String): String
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

const rootValue = {
    events: () => {
        return [
            'Romanting Cooking',
            'Sailing',
            'All-Night Coding'
        ];
    },

    createEvent: (args) => {
        const eventName = args.name;
        return eventName;
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
    console.log('Server is running on port 3000');
});
