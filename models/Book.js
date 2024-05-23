const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    author: {
        type: String,
        required: true
    },
    published_date: {
        type: Date,
        default: Date.now
    },
    pages: {
        type: Number,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
})

module.exports = mongoose.model('Book', bookSchema);
