const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router
    .route('/change-article-status/:articleId')
    .patch(adminController.changeArticleStatus)

router
    .route('/change-researcher-status/:researcherId')
    .patch(adminController.changeResearcherStatus)

router
    .route('/get-researchers')
    .get(adminController.getResearchers)

router
    .route('/login')
    .post(adminController.login)

router
    .route('/update-password/:uid')
    .patch(adminController.updatePassword)


module.exports = router;