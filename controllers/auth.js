const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
var { expressjwt: ejwt } = require('express-jwt');
const { signUpMail } = require('../mail/userSignUp');
const { orderMail } = require('../mail/orderMail');


exports.signup = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            meta: {
                errorCode: 1,
                message: errors.array()[0].msg
            },
            data: {}
        })
    }

    const user = new User(req.body);

    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                meta: {
                    errorCode: 1,
                    message: "Not able to signup, Please check details"
                },
                data: {}
            })
        }

        signUpMail(user.email, user.name);

        res.json({
            meta: {
                errorCode: 0,
                message: "success"
            },
            data: {
                name: user.name,
                email: user.email,
                id: user._id
            }
        })
    })
}

exports.signin = (req, res) => {

    const { email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            meta: {
                errorCode: 1,
                message: errors.array()[0].msg
            },
            data: {}
        })
    }

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                meta: {
                    errorCode: 1,
                    message: 'User Not Found'
                },
                data: {}
            })
        }

        if (!user.authenticate(password)) {
            return res.status(400).json({
                meta: {
                    errorCode: 1,
                    message: 'EmailId and Password do not match'
                },
                data: {}
            })
        }

        const token = jwt.sign({ _id: user._id }, process.env.SECRET);

        const { _id, name, email, role } = user;

        return res.json({
            meta: {
                errorCode: 0,
                message: "success"
            },
            data: {
                token,
                user: { _id, name, email, role }
            }
        })
    })
}

exports.signout = (req, res) => {
    res.clearCookie('token');

    res.json({
        meta: {
            errorCode: 0,
            message: 'User Sign out Successfully'
        },
        data: {}
    })
}

exports.forgetPassword = (req, res) => {
    const { email } = req.body;

    User.findOne({ email })
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    meta: {
                        errorCode: 1,
                        message: "User with this email does not exists."
                    },
                    data: {}
                })
            }
            let salt = user.salt;
            let givenPassObj = sha256(user.encry_password, salt)

            return res.json({
                meta: {
                    errorCode: 0,
                    message: 'success'
                },
                data: {
                    user
                }
            })
        })
}

// Middle wares
exports.isSignedIn = ejwt({
    secret: process.env.SECRET || 'mesheats',
    userProperty: "auth",
    algorithms: ["HS256"]
})

exports.isAuthenticated = (req, res, next) => {
    let check = req.profile && req.auth && req.profile._id.toString() === req.auth._id;

    if (!check) {
        return res.status(403).json({
            meta: {
                errorCode: 1,
                message: "Access Denied"
            },
            data: {}
        })
    }

    next();
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            meta: {
                errorCode: 1,
                message: "Access Denied"
            },
            data: {}
        })
    }
    next();
}

exports.test = (req, res) => {
    orderMail("jaimikchauhan10@gmail.com", "Jaimik Chauhan", "K Canteen", "jaimikc@gmail.com", 1000, "98327137")
}