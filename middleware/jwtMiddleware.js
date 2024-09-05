const jwt = require('jsonwebtoken');
const secretkey = process.env.MY_SECRET_KEY;

exports.userid = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Check if Authorization header is missing
    console.log(authHeader)
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
    }

    jwt.verify(token, secretkey, (err, result) => {
        if (err) {
            console.log("Error verifying token:", err);
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        } else {
            
            req.user = result; 
            next();
        }
    });
};
