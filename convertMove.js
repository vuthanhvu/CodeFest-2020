const convertMove = (moves) => {
    let direction= '';
    if(moves.length == 1){
        return direction = 'x';
    }
    for(let x=0; x < moves.length - 1; x++) {
        if( moves[x].row - moves[x+1].row == 0){
            if(moves[x].col - moves[x+1].col > 0) {
                direction = direction + '1';
            }else {
                direction = direction + '2';
            }
        }else{
            if(moves[x].row - moves[x+1].row > 0){
                direction = direction + '3';
            }else {
                direction = direction + '4';
            }
        }
    }
    return direction;
}

//Node class, used by searches as nodes in a tree.
function Node(parent,point,children){
    this.parent = parent;
    this.point = point;
    this.children = children;
}

function Point(pos_x,pos_y){
    this.row = pos_x;
    this.col = pos_y;
}