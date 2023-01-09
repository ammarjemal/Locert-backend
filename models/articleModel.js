const mongoose = require('mongoose');

const articlesSchema = new mongoose.Schema({
    articleText: {
      type: String,
      required: [true, 'Text is required'],
      trim: true,
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
    uid: {
        type: String,
        required: [true, 'UID is required'],
    },
    comments: {
        type: Array,
    },
    likes: {
        type: Array,
    },
  },
);

const Articles = mongoose.model('articles', articlesSchema); // it's a convention to make model variables begin with an uppercase letter

module.exports = Articles;