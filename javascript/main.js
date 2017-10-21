/**
 * Created by Choson on 2017/1/13.
 */
var board = new Array();
var score = 0;
var hasConflicted = new Array();//记录碰撞的集合
var startX=0;
var startY=0;
var endY=0;
var endX=0;

$(function () {
    prepareForMobile();//移动端准备工作
    newGame();
});
function prepareForMobile() {
    if(documentWidth>500){
        boxContainerWidth=500;
        cellScape=20;
        cellSideLength=100
    }
    $('#box-container').css('width',boxContainerWidth-2*cellScape);
    $('#box-container').css('height',boxContainerWidth-2*cellScape);
    $('#box-container').css('padding',cellScape);
    $('#box-container').css('border-radius',0.02*boxContainerWidth);

    $('.box-cell').css('width',cellSideLength);
    $('.box-cell').css('height',cellSideLength);
    $('.box-cell').css('border-radius',0.02*cellSideLength);
}
function newGame() {
    init();//初始化
    //随机两个数字
    getOneNumber();
    getOneNumber();
}
function getOneNumber() {
    //判断是否有空余地方生成数字
    if (noSpace(board)) {
        return false;
    }
    //随机一个位置
    var randX = parseInt(Math.floor(Math.random() * 4));
    var randY = parseInt(Math.floor(Math.random() * 4));

    var times=0;
    while (times<50) {
        if (board[randX][randY] == 0) {
            // console.log('kk')
            break;
        }
        randX = parseInt(Math.floor(Math.random() * 4));
        randY = parseInt(Math.floor(Math.random() * 4));
        times++;
    }
    if(times==50){
        for(var i=0;i<4;i++)
            for(var j=0;j<4;j++)
                if(board[i][j]==0)
                    randX=i;
                    randY=j;
    }
    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;
    //随机位置显示随机数字
    board[randX][randY] = randNumber;
    // console.log(randX,randY,randNumber);
    showNumberWithAnimation(randX, randY, randNumber);
    return true;
}
function init() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var boxCell = $("#box-cell-" + i + "-" + j);
            boxCell.css('top', getPosTop(i));
            boxCell.css('left', getPosLeft(j));
        }
    }
    //二维数组
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }
    updateBoardView();
    score = 0;
}
function updateBoardView() {
    $('.number-cell').remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $('#box-container').append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            var theNumberCell = $('#number-cell-' + i + '-' + j);
            if (board[i][j] == 0) {
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i) + cellSideLength/2);
                theNumberCell.css('left', getPosLeft(j) + cellSideLength/2);
            } else {
                theNumberCell.css('width', cellSideLength);
                theNumberCell.css('height', cellSideLength);
                theNumberCell.css('top', getPosTop(i));
                theNumberCell.css('left', getPosLeft(j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j]=false;
        }
    }
    $('.number-cell').css('line-height',cellSideLength+'px');
    $('.number-cell').css('font-size',0.6*cellSideLength+'px')
}
$(document).keydown(function (event) {
    switch (event.keyCode) {
        case 37: //left
            event.preventDefault();
            if (moveLeft()) {
                setTimeout('getOneNumber()', 210)
                isgameOver();
            }
            break;
        case 38://up
            event.preventDefault();
            if (moveUp()) {
                setTimeout("getOneNumber()", 210);
                setTimeout("isgameOver()", 300);
            }
            break;
        case 39://right
            event.preventDefault();
            if (moveRight()) {
                setTimeout("getOneNumber()", 210);
                setTimeout("isgameOver()", 300);
            }
            break;
        case 40://down
            event.preventDefault();
            if (moveDown()) {
                setTimeout('getOneNumber()', 210);
                setTimeout("isgameOver()", 300);
            }
            break;
        default://default
            break;

    }
});
document.addEventListener('touchstart',function (event) {
    startX=event.touches[0].pageX;
    startY=event.touches[0].pageY;
});
document.addEventListener('touchmove',function (e) {
    e.preventDefault();
})
document.addEventListener('touchend',function (event) {
    endX=event.changedTouches[0].pageX;
    endY=event.changedTouches[0].pageY;
    var deltax=endX-startX;
    var deltay=endY-startY;
    if(Math.abs(deltax)<0.2*documentWidth&&Math.abs(deltay)<0.2*documentWidth)
        return;
    if(Math.abs(deltax)>Math.abs(deltay)) {
        if (deltax > 0) {
            if (moveRight()) {
                setTimeout('getOneNumber()', 210);
                setTimeout("isgameOver()", 300);
            }
        }
        else {
             if (moveLeft()) {
                 setTimeout('getOneNumber()', 210)
                 setTimeout("isgameOver()", 300);
             }
        }
    }
    else {
            if (deltay > 0) {
                if (moveDown()) {
                    setTimeout('getOneNumber()', 210);
                    setTimeout("isgameOver()", 300);
                }
            }
            else
                 if (moveUp()) {
                    setTimeout("getOneNumber()", 210);
                    setTimeout("isgameOver()", 300);
                }
        }
});
function isgameOver() {
    if (noSpace(board) && noMove(board)) {
        gameOver();
    }
}
function gameOver() {
    alert('game over')
}
function moveLeft() {
    if (!canMoveLeft(board))
        return false;
    //moveLeft
    //对后三列进行遍历
    for (var i = 0; i < 4; i++)
        for (var j = 1; j < 4; j++)
            if (board[i][j] != 0)
            //对ij左侧的元素进行考察
                for (var k = 0; k < j; k++)
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);//从ij移到ik位置
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board)&&!hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);//
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][k]=true;
                        continue;
                    }
    setTimeout("updateBoardView()", 200);
    return true;
}
function moveRight() {
    if (!canMoveRight(board))
        return false;
    for (var i = 0; i < 4; i++)
        for (var j = 2; j >= 0; j--)
            if (board[i][j] != 0)
                for (var k = 3; k > j; k--)
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        showMoveAnimation(i, j, i, k);//从ij移到ik位置
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][j] == board[i][k] && noBlockHorizontal(i, j, k, board)&&!hasConflicted[i][k]) {
                        showMoveAnimation(i, j, i, k);//从ij移到ik位置
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][k]=true;
                        continue;
                    }
    setTimeout("updateBoardView()", 200);
    return true;
}
function moveUp() {
    if (!canMoveUp(board))
        return false;
    //对后三行进行遍历
    for (var j = 0; j < 4; j++)
        for (var i = 1; i < 4; i++)
            if (board[i][j] != 0)
            //对ij下侧的元素进行考察
                for (var k = 0; k < i; k++)
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        showMoveAnimation(i, j, k, j);//从ij移到kj位置
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board)&&!hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j]=true;
                        continue;
                    }
    setTimeout("updateBoardView()", 200);
    return true;
}
function moveDown() {
    if (!canMoveDown(board))
        return false;
    //moveDown
    //对前三行进行遍历
    for (var j = 0; j < 4; j++)
        for (var i = 2; i >= 0; i--)
            if (board[i][j] != 0)
            //对ij下侧的元素进行考察
                for (var k = 3; k > i; k--)
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        showMoveAnimation(i, j, k, j);//从ij移到kj位置
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board)&&!hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j]=true;
                        continue;
                    }
    setTimeout("updateBoardView()", 200);
    return true;
}
function updateScore(score) {
    $('#score').text(score)
}