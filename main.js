//require socket io 

const gameId = 'a2e81265-e4f4-4b98-8ffb-f53b866a0540';
const playerId = 'player1-xxx';

// const playerIdGame = "8967ed73-136a-432f-ad01-2ababe144899";
// const playerId = "8967ed73-136a"

//connect to API app server
//const apiServer = 'http://172.27.48.67:5000';
const apiServer = 'https://codefest.techover.io/';
const socket = io.connect(apiServer, { reconnect: true, transports: ['websocket']});

//Join game
socket.on('connect', () => {
    document.getElementById('connect').innerHTML = 'ON';
    document.getElementById('socket').innerHTML = 'Connected';
    console.log('Connect server successfully!!!');

    socket.emit('join game', { game_id: gameId, player_id: playerId});
});

socket.on('disconnect', () => {
    console.warn('[Socket] disconnected');
    document.getElementById('socket').innerHTML = 'Disconnected'; 
});

socket.on('connect_failed', () => {
    console.warn('[Socket] connect failed');
    document.getElementById('socket').innerHTML = 'Connect Failed';
});

socket.on('error', (err) => {
    console.error('[Socket] error', err);
    document.getElementById('socket').innerHTML = "Error !!!";
});

//Socket event

socket.on('join game', (res) => {
    console.log('[Socket] join-game responded:', res);
    document.getElementById('joingame').innerHTML = 'ON';
});

socket.on('ticktack player', (res) => {
    document.getElementById('ticktack').innerHTML ='ON';
    
    // console.log("start1");
    let direction = '';
    let eatRoad = '';
    let findRoadOb = '';
    let findRoad = '';
    let bombRoad = '';

    if(res.player_id != playerId && res.player_id != undefined && res.tag != "bomb:setup"){
        // console.log("Boss")
    }else{
        if(res.tag == 'start-game'){  
            findRoadOb = findBfs(res.map_info);
            findRoad = findRoadOb.direction;
            if(findRoad != 'x'){
                bombRoad = leakBombsFind(res.map_info, findRoadOb.end);
                if(bombRoad != 'x'){
                    direction = findRoad + bombRoad;
                }else{
                    direction = leakBombs(res.map_info);
                }
            }
            // console.log("startGame: ", direction);
        }else {
           eatRoad = eatFood(res.map_info);
           findRoadOb = findBfs(res.map_info);
           findRoad = findRoadOb.direction;
   
           if(eatRoad == 'x' && findRoad == 'x'){
                direction = leakBombs(res.map_info);
                console.log('leakBomb2', direction); 
           }else if (findRoad == 'x') {
                direction = eatRoad;
           }else{
                bombRoad = leakBombsFind(res.map_info, findRoadOb.end);
                direction = findRoad + bombRoad;
                if(bombRoad != 'x'){
                    direction = findRoad + bombRoad;
                    console.log('find', direction); 
                }else{
                    direction = leakBombs(res.map_info);
                    console.log('leakBomb111', direction); 
                }
            }
        }
    }
    console.log('final:', direction);
    socket.emit('drive player', {"direction": direction});
    
});

socket.on('drive player', (res) => {
    // console.log('[Socket] driver-player responded:', res);
})

