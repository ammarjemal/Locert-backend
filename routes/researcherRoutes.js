const express = require('express');
const researcherController = require('../controllers/researcherController');

const router = express.Router();

router
    .route('/')
    .post(researcherController.createResearcher)

router
    .route('/get-researcher/:uid')
    .get(researcherController.getResearcherByUID)

router
    .route('/searchUsers/:username')
    .get(researcherController.getResearcherByUsername)

router
    .route('/check-isBanned/:email')
    .get(researcherController.checkIsBanned)

router
    .route('/update-user/:_id')
    .patch(researcherController.updateUser)

router
    .route('/update-profile-picture/:_id')
    .patch(researcherController.updateProfilePicture)

router
    .route('/get-suggested-users')
    .get(researcherController.getSuggestedUsers)

module.exports = router;