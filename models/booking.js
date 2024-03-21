const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema(
    {
        event: {
            type: Schema.Types.ObjectId,
            ref: 'Event',
            require: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);