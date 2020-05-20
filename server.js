const express = require('express')
const port = process.env.PORT || 3000
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

/*
 *	Serve /dist/ folder
 */
app.use(express.static(__dirname + '/dist'))
app.get(/.*/, (req, res) => {
	res.sendFile(__dirname + '/dist/index.html')
})

io.on('connection', (socket) => {
	/*
	 *	When a client joins, it emits the join_room event.
	 *	Assign a client to the corresponding room (which is the boardID, see Board.vue)
	 *	@Param: BoardID, <String>
	 */
	socket.on('join_room', (room) => {
		// 1. Assign new client to room
		socket.join(room)
		console.log(socket.id + ' joined room: ' + room)
		// 2. Emit assigned socketId to client.
		io.to(socket.id).emit('init_client', socket.id)
		// 3. Request the board state from all other connected clients.
		socket.to(room).emit('request_board_state', socket.id)
		socket.to(room).emit('request_roles_state', socket.id)
	})

	/*
	 *	Get the requested state and emit them back to the client that requested it.
	 */
	socket.on('send_board_state', (obj) => {
		socket.to(obj.room).emit('receive_board_state', obj.board)
	})
	socket.on('send_roles_state', (obj) => {
		socket.to(obj.room).emit('receive_roles_state', obj.roles)
	})
	/*
	 *	Update event emitted from client upon role change.
	 *	@Param: Object containing roomId and roles object.
	 *			{room: <string>, roles: {}}
	 */
	socket.on('update_roles', (obj) => {
		socket.to(obj.room).emit('receive_updated_roles', obj.roles)
	})

	socket.on('reveal_card', (obj) => {
		socket.to(obj.room).emit('receive_reveal', obj.index)
	})
	/*
	 *	If a client disconnects or refreshes the page, remove it from the roles object
	 *	and emit change to all connected clients.
	 */
	socket.on('disconnecting', () => {
		//Get room the disconnecting client was in. This assumes there is only one room!
		let room = Object.keys(socket.rooms)[1]
		socket.to(room).emit('drop_role', socket.id)
	})
})

http.listen(port, () => {
	console.log('Listening on *:3000')
})
