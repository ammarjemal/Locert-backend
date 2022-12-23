const Article = require('./../models/articleModel');
const Researcher = require('./../models/researcherModel');
const Admin = require('./../models/adminModel');
const bcrypt = require('bcrypt');

exports.changeArticleStatus = async (req, res) => {
    try{
        const _id = req.params.articleId;
        const article = await Article.findByIdAndUpdate(_id, req.body, {
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

exports.getResearchers = async (req, res) => {
    try {
        //BUILD QUERY
        // 1A) Filtering
        const queryObj = { ...req.query };
        const exculdedFields = ['page', 'sort', 'limit', 'fields'];  // fields => to specify what columns should be returned
        exculdedFields.forEach(el => delete queryObj[el]);

        //1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        let query = Researcher.find(JSON.parse(queryStr)).sort({ joinedAt: -1 });

        const researchers = await query;
        res.status(200).json({
            status: 'success',
            results: researchers.length,
            data: {
                researchers
            }
        })
    }catch (error){
        res.status(404).json({
            status: 'fail',
            message: error
        })
    }
}

// Change researcher status... isBanned and isAdmin
exports.changeResearcherStatus = async (req, res) => {
    try{
        const _id = req.params.researcherId;
        const researcher = await Researcher.findByIdAndUpdate(_id, req.body, {
            new: true, // to return the updated (new) document
            runValidators: true,
        })
        if(req.body.isAdmin){
            // Promote to Admin
            const adminData = {
                email: researcher.email,
                password: researcher.password,
                uid: researcher.uid,
            }
            const admin = await Admin.create(adminData);
            res.status(201).json({
                status: "success",
                data: {
                    admin
                }
            });
        }else{
            // Remove from Admin
            const admin = await Admin.deleteOne({ uid: researcher.uid });
            res.status(201).json({
                status: "success",
                data: {
                    admin
                }
            });
        }
    }catch (error){
        res.status(400).json({
            status: "fail",
            message: error
        })
    }
}

exports.changeArticleStatus = async (req, res) => {
    try{
        const _id = req.params.articleId;
        const article = await Article.findByIdAndUpdate(_id, req.body, {
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

exports.login = async (req, res) => {
    try {
        return res.send({status: "success"});
        
        const isAdmin = await Researcher.findOne({$and: [ {uid: req.body.uid}, {isAdmin: true} ]});
        if(!isAdmin){
            return res.send({status: "no-privilege"})
        }
        const admin = await Admin.findOne({ uid: req.body.uid });
        if(admin === null){
            return res.send({status: "not-found"})
        }
        if(await bcrypt.compare(req.body.password, admin.password)){
            return res.send({status: "success"});
        }else{
            return res.send({status: "fail"});
        }
    }catch (error){
        res.status(404).json({
            status: 'fail',
            message: error
        })
    }
}