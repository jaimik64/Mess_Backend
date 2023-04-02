const RazorPayDetail = require('../models/RazorPay')
const crypto = require('crypto');

exports.createDetails = (req, res) => {
    const details = new RazorPayDetail(req.body)

    details.save((err, rp) => {
        if (err) {
            return res.status(201).json({
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
            data: rp
        })
    })
}


exports.validateRpPayment = (req, res) => {

    console.log(req.body)

    const hmac = crypto.createHmac('sha256', process.env.RAZOR_PAY_KEY_SECRET);

    hmac.update(req.body.orderid + "|" + req.body.paymentid);
    let generatedSignature = hmac.digest('hex');

    let isSignatureValid = generatedSignature == req.body.signature;

    if (isSignatureValid) {
        return res.json({
            meta: {
                errorCode: 0,
                message: "payment is successfull"
            },
            data: {}
        })
    } else {
        return res.status(204).json({
            meta: {
                errorCode: 1,
                message: "Payment Verification Failed"
            },
            data: {}
        })
    }
}