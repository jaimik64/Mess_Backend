const Day = require('../models/DaySchema');
const Mash = require('../models/MeshUser')

exports.addDishInDay = (req, res) => {

    const dayData = new Day(req.body);

    dayData.save((err, day) => {
        if (err) {
            return res.status(400).json({
                meta: {
                    errorCode: 1,
                    message: err
                },
                data: {}
            })
        }
        res.json({
            meta: {
                errorCode: 0,
                message: "success"
            },
            data: {
                day: day.dname,
                rate: day.rate,
                isLunch: day.isLunch,
                description: day.description,
                meshUser: day.meshUser
            }
        })
    })
}

exports.updateDish = (req, res) => {
    Day.findByIdAndUpdate(
        { _id: req.item._id },
        { $set: req.body },
        { new: true, userFindAndModify: false }
    ).exec((err, updatedDish) => {
        console.log("ERR : " + err)
        if (err || !updatedDish) {
            return res.status(400).json({
                meta: {
                    errorCode: 1,
                    message: "Not Authorized to update this information"
                },
                data: {}
            })
        }
        res.json({
            meta: {
                errorCode: 0,
                message: "success"
            },
            data: updatedDish
        })
    })
}

exports.removeDish = (req, res) => {
    const id = req.item._id;

    Day.findByIdAndRemove(id)
        .exec((err, deletedDish) => {
            if (err) {
                return res.status(400).json({
                    meta: {
                        errorCode: 1,
                        message: err
                    },
                    data: {}
                })
            }

            res.json({
                meta: {
                    errorCode: 0,
                    message: "success"
                },
                data: deletedDish
            })
        })
}

exports.getDishesByMeshId = (req, res) => {
    Day.find({ meshuser: req.profile._id })
        .exec((err, dishes) => {
            if (err) {
                return res.status(400).json({
                    meta: {
                        errorCode: 1,
                        message: err
                    },
                    data: {}
                })
            }
            res.json({
                meta: {
                    errorCode: 0,
                    message: "success"
                },
                data: dishes
            })
        })
}

exports.getDishesByMeshIdToUser = (req, res) => {
    Day.find({
        $and: [
            { meshuser: req.mesh._id },
            { dayname: { $ne: "Subscription" } }
        ]
    }).sort({ createdAt: -1 })
        .exec((err, dishes) => {
            if (err) {
                return res.status(400).json({
                    meta: {
                        errorCode: 1,
                        message: err
                    },
                    data: {}
                })
            }
            res.json({
                meta: {
                    errorCode: 0,
                    message: "success"
                },
                data: dishes
            })
        })
}


exports.getSubscriptionsByMeshIdToUser = (req, res) => {
    Day.find({
        $and: [
            { meshuser: req.mesh._id },
            { dayname: { $eq: "Subscription" } }
        ]
    }).sort({ createdAt: -1 })
        .exec((err, dishes) => {
            console.log(err)
            if (err) {
                return res.status(400).json({
                    meta: {
                        errorCode: 1,
                        message: err
                    },
                    data: {}
                })
            }
            return res.json({
                meta: {
                    errorCode: 0,
                    message: "success"
                },
                data: dishes
            })
        })
}

exports.getAllDishes = (req, res) => {
    Day.aggregate([
        // {
        //     $lookup: {
        //         from: "meshusers",
        //         localField: "meshuser",
        //         foreignField: "_id",
        //         as: "meshUserDatw"
        //     }
        // },
        {
            $lookup: {
                from: "meshusers",
                let: { id: "$meshuser" },
                pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$id"] } } }, {
                    $project: {
                        name: 1,
                        mobile: 1,
                        email: 1,
                        location: 1,
                        city: 1
                    }
                }],
                as: "meshUser"
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ]).then((data) => {
        return res.json({
            meta: {
                errorCode: 0,
                message: "success"
            },
            data: data
        })
    })
}

exports.getMashWiseDishes = async (req, res) => {
    const getDishes = await Mash.aggregate([
        {
            $match: {}
        },
        {
            $lookup: {
                from: "days",
                let: { meshId: "$_id" },
                pipeline: [{ $match: { $expr: { $and: [{ $eq: ["$meshuser", "$$meshId"] }, { $eq: ["$isLunch", 0] }] } } }, {
                    $project: {
                        __v: 0,
                        _id: 0
                    }
                }],
                as: "dishes"
            }
        }, {
            $project: {
                __v: 0,
                _id: 0
            }
        },
        {
            $sort: { updatedAt: 1 }
        }
    ])

    return res.json({
        meta: {
            errorCode: 0,
            message: "success"
        },
        data: getDishes
    })
}
