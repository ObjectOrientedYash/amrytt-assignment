import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const hashPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const generateAccessToken = (userId, role) => {
    return jwt.sign({id: userId, role}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_SECRET_EXPIRES_IN || '15m'
    });
};

export const generateRefreshToken = (userId, role) => {
    return jwt.sign({id: userId, role}, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRES_IN || '7d'
    });
};

export const sendResponse = (res, statusCode, success, message, data = null, error = null) => {
    console.log('26===>', message);
    return res.status(statusCode).json({
        success,
        message,
        data,
        error
    });
};
