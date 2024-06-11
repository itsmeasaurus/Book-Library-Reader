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
    const user = this
    if(!user.isModified('password')) return next()
    user.password = this.encryptPassword(user.password)
    next()
})

UserSchema.methods = {
    encryptPassword: async function(password) {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt) 
    },
    comparePassword: async function(password) {
        return await bcrypt.compare(password, this.password)
    },
}

UserSchema.methods.

module.exports = mongoose.model('User', UserSchema)