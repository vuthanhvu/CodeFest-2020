function removeBomb(direction, pill){
    let bombLength = ((direction.length >= pill) ? pill : (direction.length));
    let item = 0;
    let i = 1;
    while(i < bombLength){
      let x1 = direction.substr(-i,1);
      let x2 = direction.substr(-i-1,1);
      if(x1==x2){
        item++;
        i++;
      }else{
        break;
      }
    };
    return item;
}

function findBfs(graph){
    const { map, size, players, bombs, viruses, human} = graph;
    let direction = '';
    let idPlayer = players.findIndex((item) => {
        return item.id == playerId
    });

    let idPlayerBoss = players.findIndex((item) => {
        return item.id != playerId;
    });

    let start = players[idPlayer].currentPosition;
    let powerMe = players[idPlayer].power;
    let pillMe =  players[idPlayer].pill;

    let posBoss = players[idPlayerBoss].currentPosition;
    let powerBoss = players[idPlayerBoss].power;

    var moves = new Array();
    var openList = new Array();
    var closedList = new Array(size.rows);
    for(let i=0;i < size.rows; i++){
        closedList[i] = new Array(size.cols);
    };

    //init closedList values to 0;
    for(let i=0;i < size.rows; i++){
        for(let j=0; j < size.cols; j++){
            closedList[i][j] = 0;
        }
    }
    //add position Boss
    closedList[posBoss.row][posBoss.col] = 8;

    //add viruses
    if(pillMe < 2 && viruses.length != 0){
        for(let item of viruses){
            closedList[item.position.row][item.position.col] = 8;

            switch (item.direction) {
                case 1:
                    closedList[item.position.row][item.position.col-1] = 8;
                    break;
                case 2:
                    closedList[item.position.row][item.position.col+1] = 8;
                    break;
                case 3:
                    closedList[item.position.row-1][item.position.col] = 8;
                    break;
                case 4:
                    closedList[item.position.row+1][item.position.col] = 8;
                    break;
            
                default:
                    break;
            }
        
        }
    }

    //add human infected
    if(pillMe < 2 && human.length != 0){
        for(let item of human){
            if(item.infected){
                closedList[item.position.row][item.position.col] = 8;
                switch (item.direction) {
                    case 1:
                        closedList[item.position.row][item.position.col-1] = 8;
                        break;
                    case 2:
                        closedList[item.position.row][item.position.col+1] = 8;
                        break;
                    case 3:
                        closedList[item.position.row-1][item.position.col] = 8;
                        break;
                    case 4:
                        closedList[item.position.row+1][item.position.col] = 8;
                        break;
                
                    default:
                        break;
                }
            }
            
        }
    }

    //add bomb
    if(bombs.length != 0){
        for (let item of bombs){
            closedList[item.row][item.col] = 8;

            if(item.remainTime < 1000){
                if(item.playerId == playerId){
                    for( let i=1; i < powerMe+1; i++){
                        if(item.col-i > 0){
                            closedList[item.row][item.col-i] = 8;
                        }
                        if(item.col+i < 25){
                            closedList[item.row][item.col+i] = 8;
                        }
                        if(item.row-i > 0){
                            closedList[item.row-i][item.col] = 8;
                        }
                        if(item.row+i < 13){
                            closedList[item.row+i][item.col] = 8;
                        }
                    }
                }else{
                    for( let i=1; i < powerBoss+1; i++){
                        if(item.col-i > 0){
                            closedList[item.row][item.col-i] = 8;
                        }
                        if(item.col+i < 25){
                            closedList[item.row][item.col+i] = 8;
                        }
                        if(item.row-i > 0){
                            closedList[item.row-i][item.col] = 8;
                        }
                        if(item.row+i < 13){
                            closedList[item.row+i][item.col] = 8;
                        }
                    }
                }
            }        
        }
    }

    // adding our starting point to Open list
    let nodeOpen = new Node(null, start, new Array());
    openList.push(nodeOpen);

    //Loop while openList contains some data.
    while(openList.length != 0 ){
        let n = openList.shift();

        if(closedList[n.point.row][n.point.col] == 1) {
            continue;
        }
        //Check if node is food
        if(map[n.point.row][n.point.col] == 2){

            while(n.parent != null){
                moves.unshift(n.point);
                n = n.parent;
            };
            break;
        } 
        // Add current node to closedList
        closedList[n.point.row][n.point.col] = 1;
        //Add adjacent nodes to openList to be processed.
        if(n.point.col-1 > 0){
            if((closedList[n.point.row][n.point.col-1] == 0) &&  (map[n.point.row][n.point.col-1] == 0 || map[n.point.row][n.point.col-1] == 2)){
                n.children.unshift(new Node(n,new Point(n.point.row,n.point.col-1),new Array()));
            }
        }
        if(n.point.row+1 < 13){
            if((closedList[n.point.row+1][n.point.col] == 0) &&  (map[n.point.row+1][n.point.col] == 0 || map[n.point.row+1][n.point.col] == 2)){
                n.children.unshift(new Node(n,new Point(n.point.row+1,n.point.col),new Array()));
            }
        }
        if(n.point.col+1 < 25){
            if((closedList[n.point.row][n.point.col+1] == 0) && (map[n.point.row][n.point.col+1] == 0 || map[n.point.row][n.point.col+1] == 2)){
                n.children.unshift(new Node(n,new Point(n.point.row,n.point.col+1),new Array()));
            }
        }
        if(n.point.row-1 > 0){
            if((closedList[n.point.row-1][n.point.col] == 0) && (map[n.point.row-1][n.point.col] == 0 || map[n.point.row][n.point.col-1] == 2)){
                n.children.unshift(new Node(n,new Point(n.point.row - 1,n.point.col),new Array()));
            }
        }
        for(let i = 0;i<n.children.length;i++){
            openList.push(n.children[i]);
        }
    }

    //add start position
    moves.unshift(start);
    let findRoad = convertMove(moves);
    let end;
    if(findRoad == 'x'){
        direction = 'x';
    }else{
        if(pillMe > 1){
            let item = removeBomb(findRoad, pillMe);
            end = moves[moves.length - 2 - item];
            direction = findRoad.substring(0, findRoad.length - item).slice(0, -1) + 'b';
        }else {
            end = moves[moves.length - 2];
            direction = findRoad.slice(0, -1) + 'b';
        }
    }
 
    return {end, direction};
}