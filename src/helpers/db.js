import {Sequelize} from 'sequelize';
import configMap from '../config/config.js';

const env = process.env.NODE_ENV || 'development';
const config = configMap[env];

export const sequelize = new Sequelize(config.database, config.username, config.password, config);

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};
