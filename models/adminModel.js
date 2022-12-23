const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: [true, 'Email is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
    },
    uid: {
        type: String,
        required: [true, 'UID is required'],
        unique: true
    }
  },
);

const Admin = mongoose.model('admins', adminSchema); // it's a convention to make model variables begin with an uppercase letter

module.exports = Admin;