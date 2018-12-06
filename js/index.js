/* 
* @Author: Ricardo
* @Date:   2018-08-22 13:58:58
* @Last Modified by:   Ricardo
* @Last Modified time: 2018-08-22 17:11:08
*/

var chessBoard=[];//棋子数组
var me=true;//黑子
var over=false;//表示其还没有结束


var wins=[];//赢法数组
var myWin=[];//人赢法数组
var computerWin=[];//计算机赢法数组

//初始化一个15*15的二维棋盘数组
for (var i = 0; i < 15; i++) {
    chessBoard[i]=[];
    for (var j = 0; j < 15; j++) {
        chessBoard[i][j]=0;
    }
}

//第三维赢法
for(var i=0;i<15;i++){
    wins[i]=[];
    for(var j=0;j<15;j++){
        wins[i][j]=[];
    }
}

var count = 0;//赢法数量
//横线赢法的种类
for (var i=0; i<15;i++){
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[i][j+k][count]=true;
        }
        count++;
    }
}
//竖线赢法
for (var i=0; i<15;i++){
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[j+k][i][count]=true;
        }
        count++;
    }
}
//斜线赢法
for (var i=0; i<11;i++){
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[i+k][j+k][count]=true;
        }
        count++;
    }
}
//反斜线赢法
for (var i=0; i<11;i++){
    for(var j=14;j>3;j--){
        for(var k=0;k<5;k++){
            wins[i+k][j-k][count]=true;
        }
        count++;
    }
}

for (var i = 0; i < count; i++) {
    myWin[i]=0;
    computerWin[i]=0;
}

var chess=document.getElementById("chess");
var context= chess.getContext('2d');

window.onload=function(){
    drawChessBoard();

}


context.strokeStyle="#bfbfbf";
//棋盘
var drawChessBoard = function(){
    for (var i = 0; i < 15; i++) {
        context.moveTo(15+i*30, 15);//开始划线
        context.lineTo(15+i*30, 435);//直线到哪里的终点
        context.stroke();//画笔实现
        context.moveTo(15,15+i*30);
        context.lineTo(435,15+i*30);
        context.stroke();
    }
}

//画棋子
//i 横向第几格棋盘
//j 纵向第几格棋盘
//me true为黑子，false为白子
var oneStep = function(i,j,me){
    context.beginPath();
    context.arc(15+i*30, 15+j*30,13,0,2*Math.PI);//内圈圆
    context.closePath();
    var gradient = context.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,0); //外圈圆，实现颜色过度
    //true为黑子，false为白子
    if(me){
        gradient.addColorStop(0, "#0a0a0a");
        gradient.addColorStop(1,"#636766");
    }else{
        gradient.addColorStop(0, "#d1d1d1");
        gradient.addColorStop(1,"#f9f9f9");
    }
    context.fillStyle=gradient;
    context.fill();
}

//点击落子
chess.onclick = function(e){
    if (over) {
        return;
    }
    if(!me){
        return;
    }
    //落点的x，y坐标
    var x=e.offsetX;
    var y=e.offsetY;
    //i j 的落点
    var i= Math.floor(x/30);
    var j=Math.floor(y/30);
    //点击画棋子实现
    if (chessBoard[i][j]==0) {
        oneStep(i,j,me);
        chessBoard[i][j]=1;
        for(var k=0;k<count;k++){//遍历我方赢法
            if (wins[i][j][k]) {
                myWin[k]++;
                computerWin[k]=6;//当人赢了电脑就不能赢，所以设为异常值
                if (myWin[k]==5) {
                    window.alert("你赢了");
                    over=true;
                }
            }
        }
        if(!over){
            me=!me;
            computerAI();
        }
    }
}

//电脑AI下棋
var computerAI =function(){
    var myScore=[];//我的得分
    var computerScore=[];//电脑得分
    var max=0;//最高分数
    var u=0,v=0;//最高分所在的坐标
    //初始化得分数组
    for(var i=0;i<15;i++){
        myScore[i]=[];
        computerScore[i]=[];
        for(var j=0;j<15;j++){
            myScore[i][j]=0;
            computerScore[i][j]=0;
        }
    }
    //遍历棋盘
    for(var i=0;i<15;i++){
        for(var j=0;j<15;j++){
            if(chessBoard[i][j]==0){
                for(var k=0;k<count;k++){
                    if (wins[i][j][k]) {
                        //电脑落子为堵截的算法
                        if (myWin[k]==1) {
                            myScore[i][j]+=200;
                        }else if(myWin[k]==2){
                            myScore[i][j]+=400;
                        }else if(myWin[k]==3){
                            myScore[i][j]+=2000;
                        }else if(myWin[k]==4){
                            myScore[i][j]+=10000;
                        }
                        //电脑为赢的算法
                        if (computerWin[k]==1) {
                            computerScore[i][j]+=220;
                        }else if(computerWin[k]==2){
                            computerScore[i][j]+=420;
                        }else if(computerWin[k]==3){
                            computerScore[i][j]+=2200;
                        }else if(computerWin[k]==4){
                            computerScore[i][j]+=220000;
                        }
                    }
                }
                if (myScore[i][j]>max) {
                    max=myScore[i][j];
                    u=i;
                    v=j;
                }else if (myScore[i][j]==max) {
                    if (computerScore[i][j]>computerScore[u][v]) {
                        u=i;
                        v=j;
                    }
                }
                if (computerScore[i][j]>max) {
                    max=computerScore[i][j];
                    u=i;
                    v=j;
                }else if (computerScore[i][j]==max) {
                    if (myScore[i][j]>myScore[u][v]) {
                        u=i;
                        v=j;
                    }
                }
            }
        }
    }
    oneStep(u,v,false);
    chessBoard[u][v]=2;
    for(var k=0;k<count;k++){
        if (wins[u][v][k]) {
            computerWin[k]++;
            myWin[k]=6;
            if (computerWin[k]==5) {
                window.alert("计算机赢了");
                over=true;
            }
        }
    }
    if(!over){
        me=!me;
    }
}