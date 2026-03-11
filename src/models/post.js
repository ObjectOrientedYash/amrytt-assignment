import {Model, DataTypes} from 'sequelize';

export default sequelize => {
    class Post extends Model {}

    Post.init(
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            tags: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                defaultValue: []
            },
            views_count: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            authorId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM('draft', 'published'),
                allowNull: false,
                defaultValue: 'draft'
            }
        },
        {
            sequelize,
            modelName: 'Post',
            paranoid: true // soft delete
        }
    );
    return Post;
};
