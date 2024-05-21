const express = require('express')
const router = express.Router()
const Book = require('../models/Book')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', authMiddleware, async(req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.get('/:id', authMiddleware, getBook, (req, res) => {
    res.json(res.book)
})

router.post('/', authMiddleware, async(req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        published_date: req.body.published_date,
        pages: req.body.pages,
        language: req.body.language
    })

    try {
        const newBook = await book.save()
        res.status(200).json({ message: "A new book is created"})
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

router.patch('/:id', authMiddleware, getBook, async(req, res) => {
    if(req.body.title != null) {
        res.body.title = req.body.title
    }
    if (req.body.author != null) {
        res.book.author = req.body.author;
    }
    if (req.body.published_date != null) {
        res.book.published_date = req.body.published_date;
    }
    if (req.body.pages != null) {
        res.book.pages = req.body.pages;
    }
    if (req.body.language != null) {
        res.book.language = req.body.language;
    }

    try {
        const updateBook = await res.book.save()
        res.json(updateBook)        
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

router.delete('/:id', authMiddleware, getBook, async(req, res) => {
    try {
        await res.book.remove()
        res.json({ message: "The book is removed"})
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

async function getBook(req, res, next)
{
    let book;

    try {
        book = await Book.findById(req.params.id)
        if(book == null) {
            return res.status(400).json({ message: "Cannot find the book"})
        }
    } catch (error) {
        return res.status(500).json({ message: error.message})
    }

    res.book = book
    next()
}

module.exports = router