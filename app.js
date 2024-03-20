const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event');
const User = require('./models/user');
const bcrypt = require('bcrypt');


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

    type User {
        _id: ID!
        email: String!
        password: String
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input UserInput {
        email: String!
        password: String!
    }

    type RootQuery {
        events: [Event!]!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
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
            date: new Date(args.eventInput.date),
            creator: '65fa04fadc7ed1e779ec3d4c'
        })

        let createdEvent;

        return event.save().then(result => {
            createdEvent = {...result._doc, _id: event._doc._id.toString() }
            return User.findById('65fa04fadc7ed1e779ec3d4c')
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


