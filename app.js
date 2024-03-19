const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    res.send('Hello World!');
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
