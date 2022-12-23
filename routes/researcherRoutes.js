const express = require('express');
const researcherController = require('../controllers/researcherController');

const router = express.Router();

router
    .route('/')
    // .get(researcherController.getAllResearchers)
    .post(researcherController.createResearcher)

router
    .route('/:uid')
    .get(researcherController.getResearcherByUID)

router
    .route('/searchUsers/:username')
    .get(researcherController.getResearcherByUsername)

router
    .route('/check-isBanned/:email')
    .get(researcherController.checkIsBanned)

module.exports = router;