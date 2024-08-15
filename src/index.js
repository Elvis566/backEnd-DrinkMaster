import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http'; // Importa http para crear el servidor
import { Server } from 'socket.io'; // Importa socket.io

import { sequelize } from './DB/conexion.js';
import { PORT } from './config/config.js'; 
import { routerUser } from './router/UserRouter.js';
import { routerAvatar } from './router/AvatarRouter.js';
import { routerPenitencia } from './router/PenitenciaRouter.js';
import { routerCard } from './router/CardRouter.js';
import { routerGame } from './router/GameRouter.js';
import { routerGameT } from './router/GameTRouter.js';
import { routerFriends } from './router/FriendRouter.js';
import { routerPlayer } from './router/PlayerRouter.js';
import { routerSugerencias } from './router/SugerenciaRouter.js';

import path from 'path';

const __dirname = path.resolve();

const app = express();
const port = PORT || 3000;

// Configura la carpeta /images como estática
app.use('/images', express.static(path.join(__dirname, 'src/images')));

// Configurar CORS para permitir solicitudes desde localhost:8100
app.use(cors({
    // origin: 'https://frontend-drinkmaster.web.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/user', routerUser);
app.use('/avatar', routerAvatar);
app.use('/penitencia', routerPenitencia);
app.use('/card', routerCard);
app.use('/game', routerGame);
app.use('/gameType', routerGameT);
app.use('/friends', routerFriends);
app.use('/player', routerPlayer);
app.use('/sugerencia', routerSugerencias);

// Crear el servidor HTTP y pasar la aplicación Express
const server = http.createServer(app);

// Configurar Socket.IO para utilizar el servidor HTTP
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('A user connected');
   // Evento para manejar mensajes de chat
   socket.on('chatMessage', async (message) => {
    console.log('Mensaje recibido:', message);

    // (Opcional) Guardar el mensaje en la base de datos
    // await saveMessageToDatabase(message);

    // Emitir el mensaje a todos los clientes conectados a la misma partida
    io.emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Conexión a la base de datos y levantamiento del servidor
const conexion = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log('Connection has been established successfully');
    server.listen(port, () => { // Cambiado de app.listen a server.listen
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

conexion();
