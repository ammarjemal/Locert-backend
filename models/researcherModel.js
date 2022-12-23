const mongoose = require('mongoose');

const researcherSchema = new mongoose.Schema({
    displayName: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Email is required'],
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'Title is required'],
    },
    profession: {
        type: String,
        trim: true,
        required: [true, 'Profession is required'],
    },
    bio: {
        type: String,
        trim: true,
        required: [true, 'Bio is required'],    
    },
    gender: {
        type: String,
        trim: true,
        required: [true, 'Gender is required'],    
    },
    nationality: {
        type: String,
        trim: true,
        required: [true, 'Nationality is required'],
    },
    organization: {
        type: String,
        trim: true,
        required: [true, 'Organization is required'],
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Password is required'],
    },
    uid: {
        type: String,
        required: [true, 'UID is required'],
        unique: true
    },
    photoURL: {
        type: String,
        default: "https://firebasestorage.googleapis.com/v0/b/react-project-dff24.appspot.com/o/profile%20images%2Fprofile-DeIBNJnDQvV2vMaatKpWpEOdPsv1.jpg?alt=media&token=ab201d8c-bbcf-48a6-9751-84e3089ae71c",
    },
    isBanned: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    joinedAt: {
        type: Date,
        default: Date.now()
    },
  },
);

const Researcher = mongoose.model('researchers', researcherSchema); // it's a convention to make model variables begin with an uppercase letter

module.exports = Researcher;