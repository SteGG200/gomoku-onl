import { Server, Socket } from 'socket.io';
import { find_opponent, is_in_this_match, make_match } from './match_making';

const events = {
	connection: 'connection',
	match_making:{
		get_match_requests : 'get_match',
		send_info_match : 'info-match'
	},
	match_handle: {
		start_match : 'start_match',
		movement: 'movement',
		op_move: 'op_move'
	},
	warning: 'warning',
	disconnect: 'disconnect'
};

let queue: string[] = [];

function remove_from_queue(socket_id : string){
	const index = queue.indexOf(socket_id);
	if(index > -1){
		queue.splice(index, 1);
		return;
	}
	// console.log(`Can't find user ${socket_id} in queue`)
}

export function socket_run(io : Server){
	io.on(events.connection, (socket : Socket) => {
		socket.on(events.match_making.get_match_requests, () => {
			console.log(`Connected to user ${socket.id}`);
			socket.join(`server-to-${socket.id}`);
			queue.push(socket.id);

			socket.on(events.disconnect, (reason : string) => {
				console.log(`User ${socket.id} has been disconnected: ${reason}`)
				remove_from_queue(socket.id)
			})
			
			const socket_id_opponent = find_opponent(queue, socket.id);

			if(socket_id_opponent){
				console.log('Gen match')
				const match = make_match();
				remove_from_queue(socket_id_opponent);
				remove_from_queue(socket.id);
				// console.log(match)
				io.to(`server-to-${socket_id_opponent}`).emit(events.match_making.send_info_match,{
					matchId: match.matchId,
					mark: match.marks.first,
					key: match.unique_key
				});
				socket.emit(events.match_making.send_info_match,{
					matchId: match.matchId,
					mark: match.marks.second,
					key: match.unique_key
				})
			}
		})
		
		socket.on(events.match_handle.start_match, (match : {matchId: string, key: string}) => {
			if(!is_in_this_match(match.matchId, match.key)){
				console.log(`Client ${socket.id} isn't allowed to join this match`)
				socket.emit(events.warning, {status : 401})
				socket.disconnect();
			}else{
				console.log(`Client ${socket.id} asked to start the match!`)
				socket.join(match.matchId)
				socket.on(events.disconnect, (reason : string) => {
					console.log(`Client ${socket.id} has been disconnected from match ${match.matchId}: ${reason}`)
					socket.to(match.matchId).emit(events.warning, {
						status: 102,
						message: 'Your opponent has been disconnected!'
					})
				})
			}
		})

		socket.on(events.match_handle.movement, (movement: {i : number, j : number, mark : string, matchId: string}) => {
			io.to(movement.matchId).emit(events.match_handle.op_move, {
				i: movement.i,
				j: movement.j,
				mark: movement.mark
			})
		})
	})
}