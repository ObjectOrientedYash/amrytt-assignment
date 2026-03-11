import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Comment extends Model { }

  Comment.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Comment',
    paranoid: true, // soft delete
  });
  return Comment;
};