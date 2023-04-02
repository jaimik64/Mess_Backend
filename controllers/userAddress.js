const Address = require('../models/AddressSchema');

exports.getAddressId = (req, res, next, id) => {
    Address.findById(id)
        .exec((err, address) => {
            if (err) {
                return res.status(400).json({
                    meta: {
                        errorCode: 1,
                        message: "Address Not found"
                    },
                    data: {}
                })
            }
            req.address = address;
            next();
        })
}


exports.addAddress = (req, res) => {
    const address = new Address(req.body);

    address.save((err, address) => {
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
                errorCode: 1,
                message: "No User was found"
            },
            data: {
                id: address._id,
                user: address.user
            }
        })
    })
}

exports.updateAddress = (req, res) => {
    Address.findByIdAndUpdate(
        { _id: req.address._id },
        { $set: req.body },
        { new: true, userFindAndModify: false }
    ).exec((err, updatedAddress) => {
        if (err || !updatedAddress) {
            return res.status(400).json({
                meta: {
                    errorCode: 1,
                    message: "Not Authorised to update this information"
                },
                data: {}
            })
        }

        res.json({
            meta: {
                errorCode: 0,
                message: "success"
            },
            data: updatedAddress
        });
    })
}

exports.deleteAddress = (req, res) => {

    const id = req.address._id;

    Address.findByIdAndRemove(id, (err, deletedData) => {
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
            data: deletedData
        });
    })
}

exports.getAllAddresses = (req, res) => {
    Address.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userDetail"
            }
        }
    ]).then(data => {
        return res.json({
            meta: {
                errorCode: 0,
                message: "success"
            },
            data: data
        })
    })
}

exports.getAllAddressByUserId = (req, res) => {
    Address.find({ user: req.profile._id })
        .exec((err, addresses) => {
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
                data: addresses
            });
        })
}