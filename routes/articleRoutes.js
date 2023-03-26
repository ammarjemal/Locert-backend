const express = require('express');
const articleController = require('../controllers/articleController');

const router = express.Router();

router
    .route('/')
    .get(articleController.getArticles)
    .post(articleController.postArticle)

router
    .route('/:uid')
    .get(articleController.getUserPosts)

router
    .route('/like-post/:id')
    .patch(articleController.likePost)

router
    .route('/unlike-post/:id')
    .patch(articleController.unlikePost)
    
router
    .route('/post-comment/:id')
    .patch(articleController.postComment)

router
    .route('/get-comments/:postId')
    .get(articleController.getComments)

router
    .route('/like-comment/:postId/:commentId')
    .patch(articleController.likeComment)

router
    .route('/unlike-comment/:postId/:commentId')
    .patch(articleController.unlikeComment)

router
    .route('/delete-article/:postId')
    .delete(articleController.deleteArticle)

module.exports = router;