const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Error Handlers
const handler = (error) => {
    //console.log(error.message, error.code);
    let err = { email: '', password: '' };

    // MongoDB Erros
    if(error.code === 11000){
        err.email = 'Email has already taken, please choose another one!';
        return err;
    }

    // Validation Errors
    if(error.message.includes('user validation failed')){
        Object.values(error.errors).forEach(({properties}) => {
            err[properties.path] = properties.message;
        });
    }
    return err;
};

const tokenLife = 3 * 24 * 60 * 60; // 3 days

const createToken = (id) => {
    return jwt.sign({ id }, 'DummySecret', {
        expiresIn: tokenLife
    });
}

module.exports.signupGet = (req, res) => {
    res.render('signup');
}

module.exports.signupPost = async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.create({ email, password });
        // Id comes from the mongoDB for created user.
        const newToken = createToken(user._id);
        // We will save it on the cookies
        // It can not be reachable from the frontend (httpOnly property)
        res.cookie('jwt', newToken, { httpOnly: true, maxAge: tokenLife*1000 })
        res.status(201).json({ user: user._id });
    }catch(error){
        const errors = handler(error);
        res.status(400).send({ errors });
    }
}

module.exports.loginGet = (req, res) => {
    res.render('login');
}

module.exports.loginPost = async (req, res) => {
    res.send('User logged in!');
}