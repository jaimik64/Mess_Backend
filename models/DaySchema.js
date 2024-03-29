const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const DaySchema = new mongoose.Schema({
    dayname: {
        type: String,
        required: true
    },
    isLunch: {
        // 0 : lunch, 1: dinner, 2: All
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: true
    },
    rate: {
        type:Number,
        required: true
    },
    meshuser: {
        type: ObjectId,
        ref: 'MeshUserSchema'
    }
},
    { timestamps: true })

module.exports = mongoose.model('Day', DaySchema);
