import express from 'express';
const app = express()
import { createServer } from 'http';
import { Server } from 'socket.io';
require('dotenv').config();

import { socket_run } from './socket_custom';

const server = createServer(app)

app.use(express.static('views'))

const io = new Server(server,{
	cors: {
		origin: process.env.CLIENT_URL,
		methods: ['GET', 'POST']
	}
})

app.get('/', (req, res) => {
	res.send('hello')
})

const port = process.env.PORT || 3030
server.listen(port, () =>{
	console.log(`Listening on port ${port}`)
	socket_run(io);
})