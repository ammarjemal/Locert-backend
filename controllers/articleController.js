const Article = require('./../models/articleModel');

exports.getArticles = async (req, res) => {
    try {
        //{ status: 'APPROVED' }
        const articles = await Article.aggregate([
            { $match: req.query },
            {
                $lookup: {
                    from: 'researchers',
                    let: { uid: '$uid'},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$uid', '$$uid']
                                }
                            }
                        }
                    ],
                as: 'researcherData'
                }
            },{ $sort: {date: -1} }
        ]);
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
        const articles = await Article.aggregate([
            {
                $match: {$and: [{ uid: req.params.uid }, req.query]}
            },{
                $lookup: {
                    from: 'researchers',
                    let: { uid: '$uid'},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$uid', '$$uid']
                                }
                            }
                        }
                        
                    ],
                as: 'researcherData'
                }
            },{
                $sort: {date: -1}
            }
        ]);
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
        const comments = await Article.aggregate([
            {   $match: { $expr : { $eq: [ "$_id" , { $toObjectId: postId } ] } } },
            {
                $addFields: { 
                    "comments": { "$ifNull" : [ "$comments", [ ] ] }    
                } 
            },
            {
                $lookup: {
                    from: "researchers",
                    localField: "comments.uid",
                    foreignField: "uid",
                    as: "researchers"
                }
            },
            {
                $addFields: {
                    comments: {
                        $map: {
                            input: "$comments",
                            in: {
                                $mergeObjects: [
                                    "$$this",
                                    { "researcher": {
                                        $arrayElemAt: [
                                            "$researchers",
                                            { 
                                                $indexOfArray: [
                                                    "$researchers.uid",
                                                    "$$this.uid"
                                                ] 
                                            }
                                        ]
                                    } }
                                ]
                            }
                        }
                    }
                } 
            },
            {   $project: { "comments": 1 } },
        ])
        if(comments){
            res.status(200).json({
                status: "success",
                results: comments.length,
                data: {
                    comments: comments[0].comments
                }
            })
        }else{
            res.status(200).json({}); // no comment was found with the uid
        }
    }catch(error){
        console.log(error);
        res.status(400).json({
            status: "fail",
            message: error
        })
    }
}
exports.likeComment = async (req, res) => {
    try{
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const query = {_id: postId };
        const updateDocument = {
            $push: { "comments.$[commentItem].likes": req.body }
        };
        const options = {
            arrayFilters: [{
                "commentItem.commentId": commentId,
            }]
        };
        const article = await Article.updateOne(query, updateDocument, options);
        console.log(article)
        res.status(201).json({
            status: "success",
            data: {
                article
            }
        });
    }catch (error){
        console.log(error);
        res.status(400).json({
            status: "fail",
            message: error
        })
    }
}
exports.unlikeComment = async (req, res) => {
    try{
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const query = {_id: postId };
        const updateDocument = {
            $pull: { "comments.$[commentItem].likes": req.body }
        };
        const options = {
            arrayFilters: [{
                "commentItem.commentId": commentId,
            }]
        };
        const article = await Article.updateOne(query, updateDocument, options);
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
exports.deleteArticle = async (req, res) => {
    try{
        const postId = req.params.postId;
        // const commentId = req.params.commentId;
    
        const article = await Article.findByIdAndDelete(postId)
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
