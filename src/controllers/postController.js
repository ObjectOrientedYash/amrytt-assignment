import db from '../models/index.js';
import {sendResponse} from '../helpers/utils.js';
import {createPostSchema, updatePostSchema} from '../helpers/validation.js';
import {MESSAGES} from '../helpers/constants.js';
import {io} from '../helpers/socket.js';
import {Op} from 'sequelize';

const {Post, User} = db;

export const createPost = async (req, res) => {
    try {
        const parsed = createPostSchema.safeParse(req.body);

        if (!parsed.success) {
            return sendResponse(res, 400, false, MESSAGES.VALIDATION_FAILED, null, parsed.error.errors);
        }

        const {title, content, tags, status} = parsed.data;
        const authorId = req.user.id;

        const post = await Post.create({
            title,
            content,
            tags,
            status,
            authorId
        });

        if (io && status === 'published') {
            io.emit('new_post', {
                message: MESSAGES.NEW_POST_PUBLISHED,
                postId: post.id
            });
        }

        return sendResponse(res, 201, true, MESSAGES.POST_CREATED, {post});
    } catch (error) {
        return sendResponse(res, 500, false, MESSAGES.ERR_CREATING_POST, null, error.message);
    }
};

export const getPosts = async (req, res) => {
    try {
        let {page, limit, tag, status} = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;

        const offset = (page - 1) * limit;

        const where = {};

        if (tag) {
            where.tags = {[Op.contains]: [tag]};
        }

        if (status) {
            where.status = status;
        }

        const {count, rows} = await Post.findAndCountAll({
            where,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username']
                }
            ]
        });

        return sendResponse(res, 200, true, MESSAGES.POSTS_FETCHED, {
            totalItems: count,
            posts: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        return sendResponse(res, 500, false, MESSAGES.ERR_FETCHING_POSTS, null, error.message);
    }
};

export const getPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findByPk(postId, {
            include: [{model: User, as: 'author', attributes: ['id', 'username']}]
        });

        if (!post) {
            return sendResponse(res, 404, false, MESSAGES.POST_NOT_FOUND);
        }

        post.views_count += 1;
        await post.save();
        if (io) {
            io.to(`post_${postId}`).emit('post_viewed', {postId, views: post.views_count});
        }

        return sendResponse(res, 200, true, MESSAGES.POST_FETCHED, {post});
    } catch (error) {
        return sendResponse(res, 500, false, MESSAGES.ERR_FETCHING_POST, null, error.message);
    }
};

export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const parsed = updatePostSchema.safeParse(req.body);
        if (!parsed.success) {
            return sendResponse(res, 400, false, MESSAGES.VALIDATION_FAILED, null, parsed.error.errors);
        }
        const {title, content, tags, status} = parsed.data;
        const userId = req.user.id;

        const post = await Post.findByPk(postId);

        if (!post) {
            return sendResponse(res, 404, false, MESSAGES.POST_NOT_FOUND);
        }

        if (post.authorId !== userId) {
            return sendResponse(res, 403, false, MESSAGES.NO_PERMISSION_UPDATE_POST);
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.tags = tags || post.tags;
        post.status = status || post.status;
        await post.save();

        return sendResponse(res, 200, true, MESSAGES.POST_UPDATED, {post});
    } catch (error) {
        return sendResponse(res, 500, false, MESSAGES.ERR_UPDATING_POST, null, error.message);
    }
};

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        const post = await Post.findByPk(postId);

        if (!post) {
            return sendResponse(res, 404, false, MESSAGES.POST_NOT_FOUND);
        }

        if (post.authorId !== userId && userRole !== 'admin') {
            return sendResponse(res, 403, false, MESSAGES.NO_PERMISSION_DELETE_POST);
        }

        await post.destroy();

        return sendResponse(res, 200, true, MESSAGES.POST_DELETED);
    } catch (error) {
        return sendResponse(res, 500, false, MESSAGES.ERR_DELETING_POST, null, error.message);
    }
};
