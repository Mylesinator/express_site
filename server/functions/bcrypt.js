const bcrypt = require("bcrypt");

function hashPassword(password) {
    // turns a newly created password into a hash to be stored on the server
    return bcrypt.genSalt(10).then(salt => {
        return bcrypt.hash(password, salt);
    }).then(hash => {
        return hash;
    }).catch(err => console.error(err.message));
}

function validatePassword(password, user) {
    // compare entered password to an existing hashed password from any user
    return bcrypt.compare(password, user.password).then(res => {
        return res;
    }).catch(err => console.error(err.message));
}

module.exports = { hashPassword, validatePassword };