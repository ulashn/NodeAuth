const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter email!'],
        unique: true,
        lowercase: true,
        validate: [ isEmail, 'Please enter valid email address!']
    },
    password: {
        type: String,
        required: [true, 'Please enter password!'],
        minlength: [6, 'Minimum 6 characters needed!']
    }
});


// This function is triggered just after the new User is saved to the MongoDB
// post Mongoose HOOK
/*
userSchema.post('save', function (doc, next) {
    console.log('New user was created and saved!', doc);
    next();
});
*/


// This function is triggered just before the new user is Saved to the MongoDB
// pre Mongoose HOOK
// I am using this hook for hashing password and save it with its hashed version.
userSchema.pre('save', async function (next){
    const hasher = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, hasher);
    next();
});

// Static method for login user.

userSchema.statics.login = async function (email, password){
    const user = await this.findOne({ email });
    if(user){
        const compared = await bcrypt.compare(password, user.password);
        if(compared){
            return user;
        }
        throw Error('pwerr');
    }
    throw Error('emerr');
}

const User = mongoose.model('user', userSchema);

module.exports = User;