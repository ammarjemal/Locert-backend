const Article = require('./../models/articleModel');

exports.getArticles = async (req, res) => {
    try {
        //BUILD QUERY
        // 1A) Filtering
        const queryObj = { ...req.query };
        const exculdedFields = ['page', 'sort', 'limit', 'fields'];  // fields => to specify what columns should be returned
        exculdedFields.forEach(el => delete queryObj[el]);
        //{ status: 'APPROVED' }
        //1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        // let query = Article.find(JSON.parse(queryStr));

        const articles = await Article.find(JSON.parse(queryStr)).sort({date: -1});
        res.status(200).json({
            status: 'success',
            results: articles.length,
            data: {
                articles
            }
        })
    }catch (error){
        res.status(404).json({
            status: 'fail',
            message: error
        })
    }
}

exports.getUserPosts = async (req, res) => {
    try {
        const articles = await Article.find({$and: [{ uid: req.params.uid }, { status: "APPROVED" }]}).sort({date: -1});

        res.status(200).json({
            status: 'success',
            results: articles.length,
            data: {
                articles
            }
        })
    }catch (error){
        res.status(404).json({
            status: 'fail',
            message: error
        })
    }
}


exports.postArticle = async (req, res) => {
    try{
        const newArticle = await Article.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                article: newArticle
            }
        });
    }catch (error){
        res.status(400).json({
            status: "fail",
            message: error
        })
    }
}

exports.likePost = async (req, res) => {
    try{
        const _id = req.params.id;
        const updateDocument = {
            $push: { "likes": req.body } 
          };
        const article = await Article.findByIdAndUpdate(_id, updateDocument, {
            new: true, // to return the updated (new) document
            runValidators: true,
        })
        res.status(201).json({
            status: "success",
            data: {
                article
            }
        });
    }catch (error){
        res.status(400).json({
            status: "fail",
            message: error
        })
    }
}

exports.unlikePost = async (req, res) => {
    try{
        const _id = req.params.id;
        const updateDocument = {
            $pull: { "likes": req.body } 
          };
        const article = await Article.findByIdAndUpdate(_id, updateDocument, {
            new: true, // to return the updated (new) document
            runValidators: true,
        })
        res.status(201).json({
            status: "success",
            data: {
                article
            }
        });
    }catch (error){
        res.status(400).json({
            status: "fail",
            message: error
        })
    }
}

// comments
exports.postComment = async (req, res) => {
    try{
        const _id = req.params.id;
        const updateDocument = {
            $push: { "comments": req.body } 
        };
        const article = await Article.findByIdAndUpdate(_id, updateDocument, {
            new: true, // to return the updated (new) document
            runValidators: true,
        })
        res.status(201).json({
            status: "success",
            data: {
                article
            }
        });
    }catch (error){
        res.status(400).json({
            status: "fail",
            message: error
        })
    }
}
exports.getComments = async (req, res) => {
    try{
        const postId = req.params.postId;
        const { comments } = await Article.findOne(
            { 
                _id: postId 
            },{
                comments: 1
            }
        ).sort({date: -1});
        if(comments){
            res.status(200).json({
                status: "success",
                results: comments.length,
                data: {
                    comments
                }
            })
        }else{
            res.status(200).json({}); // no comment was found with the uid
        }
    }catch(error){
        res.status(400).json({
            status: "fail",
            message: error
        })
    }
}
exports.likeComment = async (req, res) => {
    try{
        const postId = req.params.postId;
        // const commentId = req.params.commentId;
        const updateDocument = {
            $push: { "comments.$.likes": req.body } 
          };
        const article = await Article.findByIdAndUpdate(postId, updateDocument, {
            new: true, // to return the updated (new) document
            runValidators: true,
        })
        res.status(201).json({
            status: "success",
            data: {
                article
            }
        });
    }catch (error){
        res.status(400).json({
            status: "fail",
            message: error
        })
    }
}

exports.unlikeComment = async (req, res) => {
    try{
        const postId = req.params.postId;
        // const commentId = req.params.commentId;
        const updateDocument = {
            $push: { "comments.$.likes": req.body } 
        };
        const article = await Article.findByIdAndUpdate(postId, updateDocument, {
            new: true, // to return the updated (new) document
            runValidators: true,
        })
        res.status(201).json({
            status: "success",
            data: {
                article
            }
        });
    }catch (error){
        res.status(400).json({
            status: "fail",
            message: error
        })
    }
}
