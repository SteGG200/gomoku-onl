import { v4 as uuidv4} from 'uuid'
import CryptoJS from 'crypto-js'

export function find_opponent(queue : string[], socket_id : string) : string | undefined{
	const len = queue.length;

	if(len < 2) return undefined;
	else{
		const cur_index = queue.indexOf(socket_id);
		const index_of_opponent = Math.floor(Math.random() * cur_index);
		return queue[index_of_opponent];
	}
}

export function make_match() : Match{
	const random_marks = Math.floor(Math.random() * 2);
	if(random_marks == 0){
		var marks = {
			first: 'X',
			second: 'O'
		}
	}else{
		var marks = {
			first: 'O',
			second: 'X'
		}
	}

	const matchId = uuidv4();
	const key = CryptoJS.AES.encrypt(matchId, process.env.MATCH_KEY_SECRET!).toString();

	const match : Match = {
		matchId: matchId,
		marks,
		unique_key: key
	};

	return match;
}

export function is_in_this_match(matchId: string | undefined, key: string | undefined): boolean{
	if(!key || !matchId) return false;
	const temp_match = CryptoJS.AES.decrypt(key, process.env.MATCH_KEY_SECRET!).toString(CryptoJS.enc.Utf8);

	return temp_match === matchId
}