import {Server} from 'socket.io';

let io;
const userSockets = new Map();

export const connectSocket = server => {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE']
        }
    });

    io.on('connection', socket => {
        console.log('Client connected:', socket.id);

        socket.on('register_user', userId => {
            userSockets.set(userId, socket.id);
        });

        socket.on('join_post', data => {
            const postId = data.postId;
            socket.join(`post_${postId}`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            for (const [userId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    userSockets.delete(userId);
                    break;
                }
            }
        });
    });
};

export {io, userSockets};
