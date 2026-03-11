'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
    async up(queryInterface) {
        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        await queryInterface.bulkInsert('Users', [
            {
                username: 'admin',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('Users', {
            email: 'admin@example.com'
        });
    }
};
