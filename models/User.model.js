const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



const user_schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowerCase: true,
    },
    password: {
        type: String,
        required: true,
    },
    user_type: {
        type: String,
        required: true,
        enum: ['admin', 'normal']
    }
})

user_schema.pre('save', function (next) {
    const user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(+process.env.SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });

})



const User = mongoose.model('User', user_schema)
module.exports = User;