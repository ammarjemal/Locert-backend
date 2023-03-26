const Prediction = require('../models/predictionModel');

exports.storePrediction = async (req, res) => {
    try{
        const newPrediction = await Prediction.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                prediction: newPrediction
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
exports.getAllPredictions = async (req, res) => {
    try {
        const predictions = await Prediction.aggregate([{
            $lookup: {
             from: 'researchers',
             let: { uid: '$uid'},
             pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ['$uid', '$$uid'],
                        }
                    }
                }
                ,{
                    $sort: {date: -1}
                }
            ],
            as: 'researcherData'
        }}]);
        res.status(200).json({
            status: 'success',
            results: predictions.length,
            data: {
                predictions
            }
        })
    }catch (error){
        console.log(error);
        res.status(404).json({
            status: 'fail',
            message: error
        })
    }
}
exports.getAlertedPredictions = async (req, res) => {
    try {
        const predictions = await Prediction.aggregate([
            {
                $match: { status: "ALERTED"}
            },{
                $lookup: {
                    from: 'researchers',
                    let: { uid: '$uid'},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$uid', '$$uid'],
                                }
                            }
                        }
                        ,{
                            $sort: {date: -1}
                        }
                    ],
                    as: 'researcherData'
                }
            },{
                $sort: {date: -1}
            }
        ]
        );
        res.status(200).json({
            status: 'success',
            results: predictions.length,
            data: {
                predictions
            }
        })
    }catch (error){
        console.log(error);
        res.status(404).json({
            status: 'fail',
            message: error
        })
    }
}

exports.changePredictionStatus = async (req, res) => {
    try{
        const _id = req.params.predictionId;
        console.log(req.body, _id)
        const prediction = await Prediction.findByIdAndUpdate(_id, req.body, {
            new: true, // to return the updated (new) document
            runValidators: true,
        })
        res.status(201).json({
            status: "success",
            data: {
                prediction
            }
        });
    }catch (error){
        res.status(400).json({
            status: "fail",
            message: error
        })
    }
}