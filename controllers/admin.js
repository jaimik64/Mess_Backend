const User = require('../models/User');

exports.updateRole = (req, res) => {
    const { _id } = req.refUser;

    User.findByIdAndUpdate(
        { _id },
        { $set: req.body }
    ).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                meta: {
                    errorCode: 1,
                    message: "User not Found"
                },
                data: {}
            })
        }

        return res.json({
            meta: {
                errorCode: 0,
                message: "User Details Updated"
            },
            data: {}
        })
    })
}