# Event Booking GraphQL API
![GraphQL Event Booking API](https://i.postimg.cc/BvSRfPL7/GraphQl.png)

This GraphQL API is built using MongoDB, Node.js, and GraphQL technologies. Each of these technologies has its own role in constructing the API:
- **MongoDB** is used as the database for storing data about events, users, and reservations.
- **Node.js** combined with Express.js is used for the backend implementation of the API and for executing GraphQL queries.
- **GraphQL** is used as the query language for accessing data and defining the structure of the API.

## Models
![GraphQL Event Booking API](https://i.postimg.cc/JhbXL08X/Graph-QL-Event-Booking-API-PMOV.png)

The API has three primary models:
1. **Event** - A model representing an individual event with attributes such as id, title, description, price, date, and creator (a reference to the User model, the id of the user who created the event).
2. **User** - A model representing a user with attributes such as id, email, password, isManager (role, either a regular user or a manager), and createdEvents (a list of ids of all events).
3. **Booking** - A model representing a user's booking for a specific event. It contains attributes such as id, event (a reference to the Event model), user (a reference to the User model), createdAt, and updatedAt.

The cardinalities of the relationships between the models are as follows:
- A User can create multiple Events, while an Event can be created by one and only one User.
- A Booking can be created by one and only one User, while a User can create multiple Bookings.
- A Booking can relate to one and only one Event, while an Event can be part of multiple Bookings.

## User roles
![GraphQL Event Booking API](https://i.postimg.cc/bYWP0r7K/Korisnicke-uloge.png)

The User model has two user roles:
- **Regular User** - Can make and cancel bookings.
- **Manager** - Can perform CRUD operations on events and view all bookings.

## Use Cases
The API supports the following use cases:
- User registration
- Manager registration
- User login
- Manager login
- Creating an event
- Editing an event
- Viewing all events
- Deleting an event
- Making a booking
- Canceling a booking
- Viewing all bookings
- User/Manager logout