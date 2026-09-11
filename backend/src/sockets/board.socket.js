import { getBoardRoom } from "./socket.utils.js";

export function registerBoardSocket(socket) {
    socket.on("board:join", ({ boardId }) => {
        const room = getBoardRoom(boardId);

        socket.join(room);

        console.log(
            `Socket ${socket.id} joined ${room}`
        );
    });

    socket.on("board:leave", ({ boardId }) => {
    const room = getBoardRoom(boardId);

    socket.leave(room);

    console.log(
        `Socket ${socket.id} left ${room}`
    );
});
}