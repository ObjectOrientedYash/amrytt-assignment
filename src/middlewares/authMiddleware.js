import jwt from 'jsonwebtoken';
import {sendResponse} from '../helpers/utils.js';
import {MESSAGES} from '../helpers/constants.js';

export const authenticateUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return sendResponse(res, 401, false, MESSAGES.NO_TOKEN);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return sendResponse(res, 403, false, MESSAGES.INVALID_TOKEN);
        }
        req.user = user;
        next();
    });
};
