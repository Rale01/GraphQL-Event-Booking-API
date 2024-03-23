const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Booking {
        _id: ID!
        event: Event!
        user: User!
        createdAt: String!
        updatedAt: String!
    }

    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
    }

    type User {
        _id: ID!
        email: String!
        password: String
        createdEvents: [Event!]
        isManager: Boolean!
    }

    type AuthData {
        userId: ID!
        accessToken: String!
        refreshToken: String!
        accessTokenExpiration: Int!
        refreshTokenExpiration: Int!
        isManager: Boolean!
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
        isManager: Boolean
    }

    type RootQuery {
        events: [Event!]!
        bookings: [Booking!]!
        login(email: String!, password: String!): AuthData!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
        updateEvent(eventId: ID!, eventInput: EventInput): Event
        deleteEvent(eventId: ID!): String
        createUser(userInput: UserInput): User
        bookEvent(eventId: ID!): Booking!
        cancelBooking(bookingId: ID!): Event!
        logout: String!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
