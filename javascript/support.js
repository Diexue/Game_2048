/**
 * Created by Choson on 2017/1/13.
 */
documentWidth=window.screen.availWidth;//当前设备屏幕可用的宽度
boxContainerWidth=0.92*documentWidth;//游戏方块的宽度
cellSideLength=0.18*documentWidth;//每个小方块的宽度
cellScape=0.04*documentWidth;//每个小方块之间的间距
function getPosTop(i) {
    return cellScape + i * (cellScape+cellSideLength);
}
function getPosLeft(j) {
    return cellScape + j * (cellScape+cellSideLength);
}
function getNumberBackgroundColor(num) {

    switch (num) {
        case 2:
            return "#eee4da";
            break;
        case 4:
            return "#ede0c8";
            break;
        case 8:
            return "#f2b179";
            break;
        case 16:
            return "#f59563";
            break;
        case 32:
            return "#f67c5f";
            break;
        case 64:
            return "#f65e3d";
            break;
        case 128:
            return "#edcf72";
            break;
        case 256:
            return "#edcc61";
            break;
        case 512:
            return "#9c0";
            break;
        case 1024:
            return "#33b515";
            break;
        case 2048:
            return "#09c";
            break;
        case 4096:
            return "#a6c";
            break;
        case 8192:
            return "#93c";
            break;
    }
    return "black";
}
function getNumberColor(num) {

    if (num <= 4) {
        return '#776e65'
    }
    return 'white';
}
function noSpace(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}
function canMoveLeft(board) {
    for (var i = 0; i < 4; i++)
        for (var j = 1; j < 4; j++)
            if (board[i][j] != 0)//如果存在数字
                if (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j])
                    return true;
    return false;
}
function canMoveRight() {
    for (var i = 0; i < 4; i++)
        for (var j = 2; j >= 0; j--)
            if (board[i][j] != 0)
                if (board[i][j + 1] == 0 || board[i][j] == board[i][j + 1])
                    return true;
    return false;
}
function canMoveUp() {
    for (var j = 0; j < 4; j++)
        for (var i = 1; i < 4; i++)
            if (board[i][j] != 0)
                if (board[i - 1][j] == 0 || board[i][j] == board[i - 1][j])
                    return true;
    return false;
}
function canMoveDown() {
    for (var j = 0; j < 4; j++)
        for (var i = 2; i >= 0; i--)
            if (board[i + 1][j] == 0 || board[i + 1][j] == board[i][j])
                return true;
    return false;
}
//row行，从col1列到col2列的元素
function noBlockHorizontal(row, col1, col2, board) {
    for (var i = col1 + 1; i < col2; i++)
        if (board[row][i] != 0)
            return false;
    return true;
}
function noBlockVertical(col, row1, row2, board) {
    for (var i = row1 + 1; i < row2; i++)
        if (board[i][col] != 0)
            return false
    return true;
}
function noMove(board) {
    if(canMoveUp(board)||canMoveDown(board)||canMoveLeft(board)||canMoveRight(board))
        return false;
    return true;
}