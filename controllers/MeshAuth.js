const MeshUser = require('../models/MeshUser');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
var { expressjwt: ejwt } = require('express-jwt');
const Day = require('../models/DaySchema');
const { signUpMail } = require('../mail/userSignUp');

exports.getUserById = (req, res, next, id) => {
    MeshUser.findById(id).exec((err, meshuser) => {
        if (err || !meshuser) {
            return res.status(400).json({
                err
            })
        }
        req.profile = meshuser;
        next();
    })
}

exports.getMeshId = (req, res, next, id) => {

    MeshUser.findById(id).exec((err, meshuser) => {

        if (err || !meshuser) {
            return res.status(400).json({
                err
            })
        }
        req.mesh = meshuser;
        next();
    })
}

exports.getItemById = (req, res, next, id) => {

    Day.findById(id)
        .exec((err, item) => {
            if (err) {
                return res.status(400).json({
                    err
                })
            }

            console.log(item);

            req.item = item;
            next();
        })
}

exports.signUp = (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(200).json({
            meta: {
                errorCode: 1,
                message: errors.array()[0].msg
            },
            data: {}
        })
    }

    const meshUser = new MeshUser(req.body);

    meshUser.save((err, meshuser) => {
        if (err) {
            return res.status(400).json({
                meta: {
                    errorCode: 1,
                    message: "Not able to signup, Please check details"
                },
                data: {}
            })
        }

        signUpMail(meshuser.email, meshuser.name);

        res.json({
            meta: {
                errorCode: 0,
                message: "success"
            },
            data: {
                name: meshuser.name,
                email: meshuser.email,
                id: meshuser._id
            }
        })
    })
}

exports.signIn = (req, res) => {
    const { email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            meta: {
                errorCode: 1,
                message: errors.array()[0].msg
            },
            data: {}
        })
    }

    MeshUser.findOne({ email: email }, (err, user) => {

        if (err || !user) {
            return res.status(401).json({
                meta: {
                    errorCode: 1,
                    message: 'User Not Found'
                },
                data: {}
            })
        }

        if (!user.authenticate(password)) {
            return res.status(402).json({
                meta: {
                    errorCode: 1,
                    message: "Email-Id and Password Do not match"
                },
                data: {}
            })
        }

        const token = jwt.sign({ _id: user._id }, process.env.SECRET);
        const { _id, name, email, mobile } = user;

        return res.json({
            meta: {
                errorCode: 0,
                message: "success"
            },
            data: {
                token,
                user: { _id, name, email, mobile }
            }
        })
    })
}

exports.signOut = (req, res) => {
    res.clearCookie('token');

    res.json({
        meta: {
            errorCode: 0,
            message: 'User Signed Out Successfully'
        },
        data: {}
    })
}

exports.updateProfile = (req, res) => {

    MeshUser.findByIdAndUpdate(
        { _id: req.profile._id },
        { $set: req.body }
    ).exec((err, updatedDetails) => {
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
            data: updatedDetails
        });
    })
}

exports.getAllMeshDetails = (req, res) => {
    MeshUser.find().exec((err, meshes) => {
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
                meshes
            }
        });
    })
}

exports.removeMeshUser = (req, res) => {

    MeshUser.findByIdAndRemove({ _id: req.mesh._id }).exec((err, mesh) => {
        if (err || !mesh) {
            return res.status(400).json({
                meta: {
                    errorCode: 1,
                    message: "User Not Found",
                    err: err
                },
                data: {}
            })
        }

        return res.json({
            meta: {
                errorCode: 0,
                message: "Mesh has been removed"
            },
            data: {
                mesh: mesh
            }

        });
    })
}

exports.getMeshDetailsById = (req, res) => {
    MeshUser.findById(req.profile.id)
        .exec((err, mesh) => {
            if (err || !mesh) {
                return res.status(400).json({
                    meta: {
                        errorCode: 1,
                        message: 'User Not Found',
                        err
                    },
                    data: {}
                })
            }

            return res.json({
                meta: {
                    errorCode: 0,
                    message: "success"
                },
                data: {
                    mesh
                }
            })
        })
}

exports.getMeshDetail = (req, res) => {
    MeshUser.findById(req.mesh.id)
        .exec((err, mesh) => {
            if (err || !mesh) {
                return res.status(400).json({
                    meta: {
                        errorCode: 1,
                        message: "User not found",
                        err
                    },
                    data: {}
                })
            }
            return res.json({
                meta: {
                    errorCode: 0,
                    message: "success"
                },
                data: { mesh }
            })
        })
}


exports.getMeshes = (req, res) => {

    MeshUser.find()
        .exec((err, mesh) => {
            if (err || !mesh) {
                return res.status(400).json({
                    meta: {
                        errorCode: 1,
                        message: "Mess Not Found",
                        err
                    },
                    data: {}
                })
            }

            return res.json({
                meta: {
                    errorCode: 0,
                    message: "success"
                },
                data: mesh
            })
        })
}

