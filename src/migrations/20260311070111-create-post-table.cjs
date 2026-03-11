'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Posts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            title: {
                type: Sequelize.STRING,
                allowNull: false
            },

            content: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            tags: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                defaultValue: []
            },

            views_count: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },

            status: {
                type: Sequelize.ENUM('draft', 'published'),
                allowNull: false,
                defaultValue: 'draft'
            },

            authorId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },

            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },

            deletedAt: {
                type: Sequelize.DATE,
                allowNull: true
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('Posts');
    }
};
