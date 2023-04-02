const User = require('../models/User');

exports.getUserById = (req, res, next, id) => {
    // console.log("Function Called");
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                meta: {
                    errorCode: 1,
                    message: "No User was found"
                },
                data: {}
            })
        }
        req.profile = user;
        next();
    })
}

exports.getRefUserById = (req, res, next, id) => {

    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                meta: {
                    errorCode: 1,
                    message: "No User was found"
                },
                data: {}
            })
        }
        req.refUser = user;
        next();
    })
}


exports.updateProfile = (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.profile._id },
        { $set: req.body }
    ).exec((err, updatedProfile) => {
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
            data: updatedProfile
        });
    })
}

exports.getAllUsers = (req, res) => {
    User.find().exec((err, user) => {
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
            data: user
        })
    })
}

exports.removeUser = (req, res) => {

    User.findByIdAndRemove({ _id: req.refUser._id })
        .exec((err, deletedUser) => {
            if (err) {
                return res.status(400).json({
                    meta: {
                        errorCode: 1,
                        message: err
                    },
                    data: {}
                })
            }
            return res.json(
                {
                    meta: {
                        errorCode: 0,
                        message: "Following User Removed"
                    },
                    data: {
                        user: { deletedUser }
                    }
                }
            );
        })
}

exports.getUserDetails = (req, res) => {
    User.findById(req.profile._id)
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    meta: {
                        errorCode: 1,
                        message: "No User was found"
                    },
                    data: {}
                })
            }

            return res.json({
                meta: {
                    errorCode: 0,
                    message: "success"
                },
                data: user
            })
        })
}

exports.user = (req, res) => {

}