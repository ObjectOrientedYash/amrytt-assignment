import { sendResponse } from '../helpers/utils.js';
import { MESSAGES } from '../helpers/constants.js';

export const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return sendResponse(res, 403, false, MESSAGES.ADMIN_ROLE_REQUIRED);
    }
};
