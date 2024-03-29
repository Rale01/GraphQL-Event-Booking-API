const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');

const isAuth = require('./middleware/is-auth').isAuth;

require('dotenv').config();

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true // Enable GraphQL playground
}));



mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@eventbookingapicluster.dyeksib.mongodb.net/${process.env.MONGO_DB}`)
.then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port http://localhost:3000');
        console.log(`MongoDB successfully connected to the database called ${process.env.MONGO_DB}`);
    });
}).catch(err => {
    console.log(err);
});


