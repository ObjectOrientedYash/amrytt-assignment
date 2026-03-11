import db from '../models/index.js';
import {sendResponse} from '../helpers/utils.js';
import {addCommentSchema} from '../helpers/validation.js';
import {MESSAGES} from '../helpers/constants.js';
import {io, userSockets} from '../helpers/socket.js';

const {Comment, Post, User} = db;

export const addComment = async (req, res) => {
    try {
        const parsed = addCommentSchema.safeParse(req.body);
        if (!parsed.success) {
            return sendResponse(res, 400, false, MESSAGES.VALIDATION_FAILED, null, parsed.error.errors);
        }

        const {content, parentId} = parsed.data;
        const postId = req.params.postId;
        const authorId = req.user.id;

        const post = await Post.findByPk(postId);
        if (!post) {
            return sendResponse(res, 404, false, MESSAGES.POST_NOT_FOUND);
        }

        const comment = await Comment.create({content, postId, authorId, parentId});

        const postAuthorSocket = userSockets.get(post.authorId);

        if (io && post.authorId !== authorId && postAuthorSocket) {
            io.to(postAuthorSocket).emit('new_comment', {
                message: MESSAGES.NEW_COMMENT_NOTIFICATION,
                postId,
                postAuthorId: post.authorId,
                commentId: comment.id
            });
        }

        return sendResponse(res, 201, true, MESSAGES.COMMENT_ADDED, {comment});
    } catch (error) {
        return sendResponse(res, 500, false, MESSAGES.ERR_ADDING_COMMENT, null, error.message);
    }
};

export const getComments = async (req, res) => {
    try {
        const postId = req.params.postId;
        let {page, limit} = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 20;
        const offset = (page - 1) * limit;

        const {count, rows} = await Comment.findAndCountAll({
            where: {postId, parentId: null},
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [
                {model: User, as: 'author', attributes: ['id', 'username']},
                {
                    model: Comment,
                    as: 'replies',
                    include: [{model: User, as: 'author', attributes: ['id', 'username']}]
                }
            ]
        });

        return sendResponse(res, 200, true, MESSAGES.COMMENTS_FETCHED, {
            totalItems: count,
            comments: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        return sendResponse(res, 500, false, MESSAGES.ERR_FETCHING_COMMENTS, null, error.message);
    }
};

export const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            return sendResponse(res, 404, false, MESSAGES.COMMENT_NOT_FOUND);
        }

        if (comment.authorId !== userId && userRole !== 'admin') {
            return sendResponse(res, 403, false, MESSAGES.NO_PERMISSION_DELETE_COMMENT);
        }

        await comment.destroy();

        return sendResponse(res, 200, true, MESSAGES.COMMENT_DELETED);
    } catch (error) {
        return sendResponse(res, 500, false, MESSAGES.ERR_DELETING_COMMENT, null, error.message);
    }
};
