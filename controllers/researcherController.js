const Researcher = require('./../models/researcherModel');
const bcrypt = require('bcrypt');
exports.createResearcher = async (req, res) => {
    try{
        const plainPassword = req.body.password;
        delete req.body.password; // remove the plain text password from the object
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        const newResearcher = await Researcher.create({ ...req.body, password: hashedPassword });
        res.status(201).json({
            status: "success",
            data: {
                researcher: newResearcher
            }
        });
    }catch (error){
        res.status(400).json({
            status: "fail",
            message: error
        })
    }
}
exports.checkIsBanned = async (req, res) => {
    try{
        const researcher = await Researcher.findOne({ email: req.params.email }, {isBanned: 1});
        res.status(201).json({
            status: "success",
            data: {
                researcher
            }
        });
    }catch (error){
        res.status(400).json({
            status: "fail",
            message: error
        })
    }
}

exports.getResearcherByUID = async (req, res) => {
    try{
        const uid = req.params.uid;
        const researcher = await Researcher.findOne({uid: { $eq: uid } });
        if(researcher){
            res.status(200).json({
                [researcher._id]: researcher
            })
        }else{
            res.status(200).json({}); // no researcher was found with the uid
        }
    }catch(error){
        res.status(400).json({
            status: "fail",
            message: error
        })
    }
}

exports.getResearcherByUsername= async (req, res) => { // search
    try{
        const username = req.params.username;
        const researchers = await Researcher.find({
            displayName: {
                $regex: username
            }
        },
        {
            displayName: 1,
            photoURL: 1,
            uid: 1
        }
            );
        if(researchers){
            res.status(200).json({
                researchers
            })
        }else{
            res.status(200).json({}); // no researcher was found with the username
        }
    }catch(error){
        res.status(400).json({
            status: "fail",
            message: error
        })
    }
}