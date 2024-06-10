const express = require('express')
const router = express.Router()
const Book = require('../models/Book')
const Category = require('../models/Category')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', authMiddleware, async(req, res) => {
    try {
        const books = await Book.find().populate('category');
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.get('/:id', authMiddleware, getBook, (req, res) => {
    res.json(res.book)
})

router.post('/', authMiddleware, async(req, res) => {
    const { title, author, published_date, pages, language, categoryName } = req.body

    try {
        let category = await Category.findOne({ name: categoryName })
        if(!category) {
            category = new Category({ name: categoryName })
            await category.save()
        }

        const book = new Book({ title, author, published_date, pages, language, category: category.id })
        const newBook = await book.save()

        res.status(200).json({ message: "A new book is created", book: newBook})
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

router.patch('/:id', authMiddleware, getBook, async(req, res) => {
    const { categoryName, ...bookUpdates } = req.body

    try{
        if(categoryName) {
            let category = await Category.findOne({ name: categoryName})
            if(!category) {
                category = new Category({ name: categoryName})
                await category.save()
            }
            bookUpdates.category = category.id
        }


        Object.assign(res.book, bookUpdates)
        const updateBook = await res.book.save()
        res.json(updateBook)      
    }catch (error) {
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
        book = await Book.findById(req.params.id).populate('category')
        if(!book) {
            return res.status(400).json({ message: "Cannot find the book"})
        }
    } catch (error) {
        return res.status(500).json({ message: error.message})
    }

    res.book = book
    next()
}

module.exports = router