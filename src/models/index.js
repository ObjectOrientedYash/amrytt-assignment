import {sequelize} from '../helpers/db.js';
import defineUser from './user.js';
import definePost from './post.js';
import defineComment from './comment.js';

const User = defineUser(sequelize);
const Post = definePost(sequelize);
const Comment = defineComment(sequelize);

const db = {
    User,
    Post,
    Comment,
    sequelize
};

// Associations
db.User.hasMany(db.Post, {foreignKey: 'authorId', as: 'posts'});
db.Post.belongsTo(db.User, {foreignKey: 'authorId', as: 'author'});

db.User.hasMany(db.Comment, {foreignKey: 'authorId', as: 'comments'});
db.Comment.belongsTo(db.User, {foreignKey: 'authorId', as: 'author'});

db.Post.hasMany(db.Comment, {foreignKey: 'postId', as: 'comments'});
db.Comment.belongsTo(db.Post, {foreignKey: 'postId', as: 'post'});

db.Comment.hasMany(db.Comment, {foreignKey: 'parentId', as: 'replies'});
db.Comment.belongsTo(db.Comment, {foreignKey: 'parentId', as: 'parent'});

export {User, Post, Comment, sequelize};
export default db;
