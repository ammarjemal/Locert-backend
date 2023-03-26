const express = require('express');
const predictionController = require('../controllers/predictionController');

const router = express.Router();

router
    .route('/')
    .post(predictionController.storePrediction)
    .get(predictionController.getAllPredictions)


router
    .route('/change-prediction-status/:predictionId')
    .patch(predictionController.changePredictionStatus)

router
    .route('/get-alerted-predictions')
    .get(predictionController.getAlertedPredictions)

module.exports = router;
