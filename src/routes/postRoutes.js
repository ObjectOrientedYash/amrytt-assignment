import express from 'express';
import {getPosts, getPost, createPost, updatePost, deletePost} from '../controllers/postController.js';
import {authenticateUser} from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: List Posts
 *     description: Public API to fetch posts with optional filters
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *           example: nodejs
 *         required: false
 *         description: Filter posts by tag
 *
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published]
 *           example: published
 *         required: false
 *         description: Filter posts by status
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         required: false
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         required: false
 *         description: Number of posts per page
 *
 *     responses:
 *       200:
 *         description: List of posts fetched successfully
 */
router.get('/', getPosts);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post details
 */
router.get('/:id', getPost);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     description: Authenticated users can create blog posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Building Real-Time Apps with WebSockets
 *               content:
 *                 type: string
 *                 example: WebSockets enable full duplex communication...
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["nodejs", "websocket"]
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *                 example: published
 *     responses:
 *       201:
 *         description: Post created successfully
 */
router.post('/', authenticateUser, createPost);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *                 example: published
 *     responses:
 *       200:
 *         description: Post updated
 */
router.put('/:id', authenticateUser, updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post deleted
 */
router.delete('/:id', authenticateUser, deletePost);

export default router;
