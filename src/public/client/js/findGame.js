document.getElementById('findGameButton').addEventListener('click', async () => {
    document.getElementById('status').innerText = 'Finding a game...';

    try {
        const response = await fetch('/matchmaking/find-game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('status').innerText = `Game found! Room: ${result.room}`;
            window.location.href = `/game/${result.room}`;  // Redirect to the game room
        } else {
            document.getElementById('status').innerText = 'Error finding a game.';
        }
    } catch (error) {
        document.getElementById('status').innerText = 'Error: Could not connect to server.';
        console.error('Error finding game:', error);
    }
});