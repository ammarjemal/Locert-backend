const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    predictionData: {
      type: Object,
      required: [true, 'Prediction data is required'],
    },
    date: {
        type: Date,
        trim: true,
        default: Date.now()
    },
    status: {
        type: String,
        trim: true,
        default: "PENDING",
    },
    result: {
        type: String,
        trim: true,
        required: [true, 'Result is required'],
    },
    uid: {
        type: String,
        required: [true, 'UID is required'],
    }
  },
);

const Predictions = mongoose.model('predictions', predictionSchema); // it's a convention to make model variables begin with an uppercase letter

module.exports = Predictions;