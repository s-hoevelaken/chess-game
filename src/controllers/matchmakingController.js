let rooms = {};
let waitingPlayer = null;

exports.findGame = (req, res) => {
    if (waitingPlayer === null) {
        const roomId = `room-${Date.now()}`;
        waitingPlayer = { id: req.session.user.id, room: roomId };

        rooms[roomId] = { players: [waitingPlayer] };
        res.status(200).json({ message: 'Waiting for an opponent...', room: roomId });
    } else {
        const roomId = waitingPlayer.room;
        const currentPlayer = { id: req.session.user.id, room: roomId };

        rooms[roomId].players.push(currentPlayer);
        waitingPlayer = null;

        res.status(200).json({ message: 'Game found!', room: roomId });
    }
};