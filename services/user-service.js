const jwt = require('jsonwebtoken');

exports.isvalid = (string) => {
    if (string.length === 0 || string === null) {
        return true;
    } else {
        return false;
    }
}

exports.generatewebtoken = (username,id) => {
    return jwt.sign({username,id}, process.env.JWT_SECRET_KEY);
}