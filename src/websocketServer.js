const WebSocket = require('ws');

function startWebSocketServer(httpServer) {
  const wss = new WebSocket.Server({ server: httpServer });
  console.log('WebSocket server is running');

  wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        console.log('Received message:', data);

        // just log the message or respond with basic info for now
        if (data.type === 'status') {
          ws.send(JSON.stringify({ type: 'status', message: 'Connected to WebSocket' }));
        }

        if (data.type === 'move') {
          // need to handle sending/ brodcasting the move to the other player here
        }

      } catch (error) {
        console.error('Invalid message received:', message.toString());
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      // maybe handle by notifying other player later on
    });
  });
}

module.exports = { startWebSocketServer };