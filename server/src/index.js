require('dotenv').config();
const http = require('http');
const app = require('./app');
const { sequelize } = require('./models');
const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

// Optional: Socket.IO for real-time seat availability
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  // join event-room to receive seat updates for a specific event
  socket.on('join-event', (eventId) => {
    socket.join(`event_${eventId}`);
  });

  socket.on('leave-event', (eventId) => {
    socket.leave(`event_${eventId}`);
  });

  socket.on('disconnect', () => {
    // cleanup if needed
  });
});

// make io available to controllers via app.locals
app.locals.io = io;

// test DB and start
(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    // sync models (for development); consider migrations in production
    await sequelize.sync({ alter: false }); // change to true carefully
    server.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (err) {
    console.error('Failed to connect DB', err);
    process.exit(1);
  }
})();
