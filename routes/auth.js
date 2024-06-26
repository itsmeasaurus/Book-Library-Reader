const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', async(req,res) => {
    const {username, password} = req.body
    try {
        const existingUser = await User.findOne({username})
        if(existingUser) {
            return res.status(400).json({ message: "Username already exists"})
        }

        const newUser = new User({ username, password})
        await newUser.save()
        return res.status(200).json({ message: "A new user is created"})
    } catch (error) {
        return res.status(500).json({ message: error.message})
    }
})

router.post('/login', async(req, res) => {
    const {username, password} = req.body
    try {
        const user = await User.findOne({username})
        if(!user) {
            return res.status(400).json({ message: "Incorrect username or password"})
        }

        const isMatch = await user.comparePassword(password)
        if(!isMatch) {
            return res.status(400).json({ message: "Incorrect username or password"})
        }

        const token = jwt.sign({ id: user._id }, 'jwtsecretkey', { expiresIn: '1h' });
        res.json({ token })
    } catch (error) {
        return res.status(500).json({ message: error.message})
    }
})

router.patch('/passchange', authMiddleware, async(req, res) => {
    const {username, newPassword} = req.body

    if(!newPassword) {
        return res.status(400).json({ message: "New password is required"})
    }

    try {
        const user = await User.findOne({ username })
        if(!user) {
            return res.status(400).json({ message: "User is not found"})
        }

        user.password = newPassword
        await user.save()
        return res.status(200).json({ message: "Password Updated Successfully "})
    } catch (error) {
        return res.status(500).json({ message: error.message})

    }
})

module.exports = router;