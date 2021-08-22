const User = require('../models/User');

// Error Handlers
const handler = (error) => {
    console.log(error.message, error.code);
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

module.exports.signupGet = (req, res) => {
    res.render('signup');
}

module.exports.signupPost = async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.create({ email, password });
        res.status(201).json(user);
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