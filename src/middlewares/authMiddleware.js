import jwt from 'jsonwebtoken';
import {sendResponse} from '../helpers/utils.js';
import {MESSAGES} from '../helpers/constants.js';

export const authenticateUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return sendResponse(res, 401, false, MESSAGES.NO_TOKEN);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return sendResponse(res, 403, false, MESSAGES.INVALID_TOKEN);
    }
};
