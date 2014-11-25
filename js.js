var up = 0;
var down = 0;
var right = 0;
var left = 0;

var upPressed = false;
var downPressed = false;
var rightPressed = false;
var leftPressed = false;

var mousex;
var mousey;

var v = 0; //velocity
var maxV = 7;

/*pos = position, vel = velocity, acc = acceleration and dt = delta_time*/

//var temp = acc * dt;
//var pos = pos + dt * (vel + temp / 2);
//var vel = vel + temp;

window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key == 87) {
        upPressed = true;
    }
    if (key == 83) {
        downPressed = true;
    }
    if (key == 65) {
        leftPressed = true;
    }
    if (key == 68) {
        rightPressed = true;
    }    
}

window.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key == 87) {
        upPressed = false;
    }
    if (key == 83) {
        downPressed = false;
    }
    if (key == 65) {
        leftPressed = false;
    }
    if (key == 68) {
        rightPressed = false;
    }    
}

var bulletid = 0;

var createBullet = function() {
    var closure = function(){
        var bullet = document.createElement('div');
        bullet.className = 'bullet';
        bullet.id = "bullet" + bulletid;
        bulletid += 1;
        
        var pos = getPosition(document.getElementById('p'));    
        bullet.style.top = (pos.y + 8) + 'px';
        bullet.style.left = (pos.x + 8) + 'px';
        document.getElementsByTagName('body')[0].appendChild(bullet);
        var mX = mousex;
        var mY = mousey;
        var id = setInterval(function(){ 
            var bpos = getPosition(document.getElementById(bullet.id));
            
            var centerX = bpos.x + 2;
            var centerY = bpos.y + 2;
            var angleToMouse = Math.atan2(mY - centerY, mX - centerX);
            var initialVelocity = 5;
            
            bullet.style.left = (bpos.x + Math.cos(angleToMouse) * initialVelocity) + 'px';
            bullet.style.top = (bpos.y + Math.sin(angleToMouse) * initialVelocity) + 'px';
              
            
            //cancel Interval and delete div after location            
        }, 25);
        bullet.id = bulletid;
    }();
}

window.onclick = createBullet;


var getPosition = function(element) {
    var xPosition = 0;
    var yPosition = 0;
      
    while (element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
}

window.addEventListener("mousemove", function(e){
    mousex = e.clientX;
    mousey = e.clientY;
    document.getElementById('other').style.top = (mousey - 5) + "px";
    document.getElementById('other').style.left = (mousex - 5) + "px";
});

function getPos(el) {
    for (var lx=0, ly=0;
         el != null;
         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return {x: lx,y: ly};
}

var createLine = function(){ 
    var pPos = getPos(document.getElementById('p'));
    
    var xx1 = pPos.x + 10;
    var yy1 = pPos.y + 3;
    var xx2 = mousex;
    var yy2 = mousey;
        
    var length = Math.sqrt((xx1-xx2)*(xx1-xx2) + (yy1-yy2)*(yy1-yy2));
    var angle  = Math.atan2(yy2 - yy1, xx2 - xx1) * 180 / Math.PI;
    var transform = 'rotate('+angle+'deg)';
    
    document.getElementById('line').style.position = 'absolute';
    document.getElementById('line').style.transform = transform;
    document.getElementById('line').style.width = length + 'px';
    document.getElementById('line').style.width = 20 + 'px';
    document.getElementById('line').style.top = yy1 + 'px';
    document.getElementById('line').style.left = xx1 + 'px';
   
}

var collision = function(o1, o2, adjustmentFunction){
    var rect1 = {
        x: parseInt(window.getComputedStyle(o1).left, 10),
        y: parseInt(window.getComputedStyle(o1).top, 10),
        width: parseInt(window.getComputedStyle(o1).width, 10),
        height: parseInt(window.getComputedStyle(o1).height, 10)
    }
    var rect2 = {
        x: parseInt(window.getComputedStyle(o2).left, 10),
        y: parseInt(window.getComputedStyle(o2).top, 10),
        width: parseInt(window.getComputedStyle(o2).width, 10),
        height: parseInt(window.getComputedStyle(o2).height, 10)
    }
        
    if (rect1.x < rect2.x + rect2.width &&
       rect1.x + rect1.width > rect2.x &&
       rect1.y < rect2.y + rect2.height &&
       rect1.height + rect1.y > rect2.y) {
        
        //calculate correction
        if(adjustmentFunction){
            adjustmentFunction(o1, o2, rect1, rect2)
        }
        
           return true;
    }else{
        return false;
    }
}

setInterval(function(){
    var pos = getPos(document.getElementById('p'));
    
    if(upPressed){
        up = up > -maxV ? up - 1 : up = -maxV;
    }else{
        up = up < 0 ? up + 0.5 : up = 0;
    }
    if(downPressed){
        down = down < maxV ? down + 1 : down = maxV;
    }else{
        down = down > 0 ? down - 0.5 : down = 0;
    }    
    if(leftPressed){
        left = left > -maxV ? left - 1 : left = -maxV;
    }else{
        left = left < 0 ? left + 0.5 : left = 0;
    }
    if(rightPressed){
        right = right < maxV ? right + 1 : right = maxV;
    }else{
        right = right > 0 ? right - 0.5 : right = 0;
    }
    
    document.getElementById('p').style.top = (pos.y + (up + down)) + "px";
    document.getElementById('p').style.left = (pos.x + (left + right)) + "px";
    
    if(collision(document.getElementById('p'), document.getElementById('other'))){
        document.body.style.background = 'green';
        maxV = 0;
    }else{
        document.body.style.background = 'white';
        maxV = 7;
    }
    createLine();
    
    
}, 25);
    

