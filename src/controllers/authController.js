import db from '../models/index.js';
import {hashPassword, comparePassword, generateAccessToken, generateRefreshToken, sendResponse} from '../helpers/utils.js';
import {registerSchema, loginSchema} from '../helpers/validation.js';
import {MESSAGES} from '../helpers/constants.js';
import jwt from 'jsonwebtoken';

const {User} = db;

export const register = async (req, res) => {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            return sendResponse(res, 400, false, MESSAGES.VALIDATION_FAILED, null, parsed.error.errors);
        }
        const {username, email, password} = parsed.data;

        const existingUser = await User.findOne({where: {email}});
        if (existingUser) {
            return sendResponse(res, 400, false, MESSAGES.EMAIL_IN_USE);
        }

        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        return sendResponse(res, 201, true, MESSAGES.USER_REGISTERED, {
            user: {id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role}
        });
    } catch (error) {
        return sendResponse(res, 500, false, MESSAGES.ERR_REGISTRATION, null, error.message);
    }
};

export const login = async (req, res) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return sendResponse(res, 400, false, MESSAGES.VALIDATION_FAILED, null, parsed.error.errors);
        }
        const {email, password} = parsed.data;

        const user = await User.findOne({where: {email}});
        if (!user) {
            return sendResponse(res, 401, false, MESSAGES.INVALID_CREDENTIALS);
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return sendResponse(res, 401, false, MESSAGES.INVALID_CREDENTIALS);
        }

        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id, user.role);

        return sendResponse(res, 200, true, MESSAGES.LOGIN_SUCCESS, {
            accessToken,
            refreshToken,
            user: {id: user.id, username: user.username, role: user.role}
        });
    } catch (error) {
        return sendResponse(res, 500, false, MESSAGES.ERR_LOGIN, null, error.message);
    }
};

export const refreshToken = async (req, res) => {
    try {
        const {token} = req.body;

        if (!token) {
            return sendResponse(res, 401, false, MESSAGES.REFRESH_TOKEN_REQUIRED);
        }

        jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
            if (err) {
                return sendResponse(res, 403, false, MESSAGES.INVALID_REFRESH_TOKEN);
            }

            const newAccessToken = generateAccessToken(user.id, user.role);
            return sendResponse(res, 200, true, MESSAGES.TOKEN_REFRESHED, {accessToken: newAccessToken});
        });
    } catch (error) {
        return sendResponse(res, 500, false, MESSAGES.ERR_REFRESH_TOKEN, null, error.message);
    }
};
