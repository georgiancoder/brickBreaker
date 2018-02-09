var canvas = document.getElementById('bb');
var ctx = canvas.getContext('2d');

var mainLoop;
var startBouncing = false;

var bricks = [];

var startGame = false;

var level = ['#','1','1','#','#','#','#','#','#','#','#','1',
			 '#','#','1','1','#','1','#','#','#','1','#','#',
			 '#','#','1','1','1','1','#','1','#','1','#','#',
			 '#','1','1','1','1','1','1','1','1','#','#','1',
			 '1','1','1','1','1','1','1','1','1','1','#','#',
			];

function Brick(opt){
	this.width = opt.width;
	this.height = opt.height;
	this.color = opt.color;
	this.x = opt.x;
	this.y = opt.y;
	this.brake = false;
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.strokeStyle = "black";
		ctx.strokeRect(this.x,this.y,this.width,this.height);
		ctx.fillRect(this.x,this.y,this.width,this.height);
		ctx.closePath();
	}
}

var Player = {
	width: 120,
	height: 20,
	color: 'yellow',
	x: (canvas.width/2) - 60,
	y: canvas.height - 20,
	draw: function(ctx){
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x,this.y,this.width,this.height);
		ctx.closePath();
	}
}

var Ball = {
	radius: 10,
	x: canvas.width/2 - 10,
	y: canvas.height - 40,
	color: 'lightgreen',
	directionX: 1,
	directionY: -1,
	speed: 4,
	draw: function(ctx){
		if(startBouncing){
			this.bounce();
		}
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x + this.radius,this.y + this.radius,this.radius,0,2*Math.PI);
		ctx.fill();
		ctx.closePath();
	},
	bounce: function(){
		// collision on walls
		if(this.x >= canvas.width - this.radius * 2){
			this.directionX = -1;
		}
		if(this.x <= 0){
			this.directionX = 1;
		}
		if(this.y <= 0){
			this.directionY = 1;
		}
		if(this.y >= canvas.height){
			clearTimeout(mainLoop);
			startBouncing = false;
			alert('Game Over');
		}

		//collision on main brick
		if(this.directionY == 1 && (this.y + this.radius * 2)  >= (canvas.height - Player.height) && (this.x + this.radius * 2) >= Player.x &&  (this.x + this.radius) <= (Player.x + Player.width)){
			this.directionY = -1;
		}

		//collision on bricks
		for(i = 0; i<bricks.length; i++){
			//left
			if(!bricks[i].brake && this.directionX == 1 && (this.x + this.radius * 2) >= bricks[i].x && (this.y + this.radius * 2) > bricks[i].y  && this.x < (bricks[i].x + bricks[i].width) && this.y < bricks[i].y ){
				this.directionX = -1;
				bricks[i].brake = true;
			}

			//right
			if(!bricks[i].brake && this.directionX == -1 && this.x < (bricks[i].x + bricks[i].width) && this.x > bricks[i].x  && (this.y + this.radius * 2) > bricks[i].y && this.y < bricks[i].y ){
				this.directionX = 1;
				bricks[i].brake = true;
			}

			//bottom
			if(!bricks[i].brake && this.directionY == -1 && this.y < (bricks[i].y + bricks[i].height) && this.y >= bricks[i].y && (this.x + this.radius * 2) > bricks[i].x && this.x < bricks[i].x + bricks[i].width){
				this.directionY = 1;
				bricks[i].brake = true;
			}

			//top
			if(!bricks[i].brake && this.directionY == 1 && (this.y + this.radius * 2) > bricks[i].y && this.y < bricks[i].y + bricks[i].height && (this.x + this.radius * 2) > bricks[i].x && this.x < bricks[i].x + bricks[i].width){
				this.directionY = -1;
				bricks[i].brake = true;
			}
			
		}

		this.x += this.directionX * this.speed;
		this.y += this.directionY * this.speed;
	}
}

function InitBrick(){
	for(i=0; i<5; i++){
		for(j=0; j<12; j++){
			//12 * i + j = index
			var index = 12 * i + j;
			if(level[index] == 1){
				var startPointX = (canvas.width / 2) - ((12/2) * 60);
			
				var brick = new Brick({
					width: 50,
					height: 20,
					color: 'red',
					x: startPointX + 5 + (j * 60),
					y: (i * 30)
				});
				bricks.push(brick);
			}
			
		}
	}
}

function drawBg(){
	for(i = 0; i<bricks.length; i++){
		if(!bricks[i].brake){
			bricks[i].draw(ctx);
		}
	}
}

function clear(ctx){
	ctx.clearRect(0,0,canvas.width,canvas.height);
}

function start(){
	InitBrick();
	drawBg();
	Player.draw(ctx);
	Ball.draw(ctx);
	canvas.addEventListener('mousemove',function(event){
		if(startBouncing){
			Player.x = event.offsetX - Player.width/2;
			if(!startBouncing){
				Ball.x = event.offsetX - Ball.radius;
			}
		}
	},false);
	document.addEventListener('keyup',function(event){
		if(event.keyCode == 32){
			startBouncing = true;
		}
	},false);

	mainLoop = setInterval(update,10);
}

function update(){
		clear(ctx);
		drawBg();
		Player.draw(ctx);
		Ball.draw(ctx);
}

start();