const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next()
    try {
        this.password = await this.encryptPassword(this.password)
        next()
    } catch (error) {
        next(error)
    }
})

UserSchema.methods.encryptPassword = async function(password) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt) 
}

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)