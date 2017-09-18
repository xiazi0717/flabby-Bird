//获取元素：
var bg = document.querySelector(".bg");
var bird = document.querySelector(".bird");
var container = document.querySelector(".container");
var score = document.querySelector(".score");
var start = document.querySelector(".start");
var score_record = document.querySelector(".score_record");
var best_record = document.querySelector(".best_record");
var restart = document.querySelector(".restart");
var ani = document.querySelector(".ani");
var btns = document.querySelector(".btns");
var gameover = document.querySelector(".gameover");

//声明循环定时器名称：
var timer_bg,timer_bird_down,timer_creatpipe;

//全局变量：
var num = 0;//用来记录分数；
var cookie = getCookie("best")||0;

//音频：
var obj = {
	bg:"010pic/bg.mp3",
	game:"010pic/game1.mp3",
	jump:"010pic/jump.mp3",
	pass:"010pic/pass.mp3",
	dead:"010pic/dead.mp3",
	gameover:"010pic/gameOver.mp3"
}
var gameMusic = new Object();//用来存储音频；
for(var i in obj){
	var au = document.createElement("audio");
	au.src = obj[i];
	gameMusic[i] = au;
}

//页面加载后，播放背景音乐，循环播放：
gameMusic.bg.play();
gameMusic.bg.loop = true;




//背景图片的轮播：
var bg_speed = 1;
var bg_left = 0;
timer_bg = setInterval(function(){
	bg.style.left = bg_left + "px";
	bg_left -= bg_speed;
	if(bg_left <= -400){
		bg_left = 0;
	}
},10)


//start点击开始：
start.onclick = function(e){
	var e = e || window.event;
	e.cancelBubble = true;
	btns.remove();
	ani.remove();
	score.style.display = "block";
	bird.style.display = "block";
	birdDown()
	//游戏开始后，游戏音乐播放：(背景音乐停止)
	gameMusic.bg.pause();
	gameMusic.game.play();
	gameMusic.game.loop = true;
	
	pipe();
	timer_creatpipe = setInterval(function(){
		pipe();
	},3000)
}

//点击运动
container.onclick = function(){
	if(!isDead){
		a_down = 0;
		a_up = 5;
		gameMusic.jump.play();
	}
}

//重新开始：
restart.onclick = function(){
	location.reload();
}




//小鸟脚本：
var birdDown_speed = 2;
var a_down = 0;
var a_up = 0;
var bird_top = 0;
var isDead = false;

function birdDown(){
	timer_bird_down = setInterval(function(){
		bird.style.top = bird_top + "px";
		bird_top += birdDown_speed + a_down - a_up;
		a_down += 0.1;
		if(bird_top >510){
			clearInterval(timer_bird_down);
			isDead = true;
			bird.className = "bird bird_dead";
		}
		if(!isDead){
			if(birdDown_speed + a_down - a_up < 0){
				bird.className = "bird bird_up";
			}else{
				bird.className = "bird bird_down";
			}
		}
		else{
			bird.className = "bird bird_dead";
		}
	},17)
}



//创建pipe部分：
function pipe(){
	var rd_space = rand(90,120);
	var rd_pipe_up_height = rand(30,380);
	//上管道：
	var div_pipe = document.createElement("div");
	div_pipe.className = "pipe";
	var div_pipe_up = document.createElement("div");
	div_pipe_up.style.height = rd_pipe_up_height + 'px';
	div_pipe_up.className = "pipe_up";
	var div_pipe_up_head = document.createElement("div");
	div_pipe_up_head.className = "pipe_up_head";
	//下管道：
	var div_pipe_down = document.createElement("div");
	div_pipe_down.style.height = 530 - rd_space - rd_pipe_up_height + "px";
	div_pipe_down.className = "pipe_down";
	var div_pipe_down_head = document.createElement("div");
	div_pipe_down_head.className = "pipe_down_head";
	
	//插入元素：
	div_pipe_down.appendChild(div_pipe_down_head);
	div_pipe_up.appendChild(div_pipe_up_head);
	div_pipe.appendChild(div_pipe_up);
	div_pipe.appendChild(div_pipe_down);
	container.appendChild(div_pipe);
	
	//pipe 移动：
	var pipe_speed =1;
	var pipe_left = 400;
	var timer_pipeMove = setInterval(function(){
		div_pipe.style.left = pipe_left + "px";
		pipe_left -= pipe_speed;
		//pipe出边界，清楚定时器；
		if(pipe_left == -80){
			clearInterval(timer_pipeMove);
			div_pipe.remove();
		}
		if(pipe_left>0&&pipe_left<120){
			if(bird.offsetTop<rd_pipe_up_height || bird.offsetTop>rd_pipe_up_height +rd_space - 30){
				isDead = true;
				clearInterval(timer_pipeMove);
			}
		}
		if(pipe_left == 0){
			score.innerHTML = "";
			num++;
			gameMusic.pass.play();
			var str = String(num)
			for(var i = 0;i<str.length;i++){
				var im = new Image();
				im.src = "010pic/"+str.charAt(i)+".jpg";
				score.appendChild(im);
			}
		}
		if(isDead){
			clearInterval(timer_pipeMove);
			clearInterval(timer_creatpipe);
			gameMusic.dead.play();
			gameMusic.game.pause();
			setTimeout(function(){
				gameover.style.display = "block";
				gameMusic.gameover.play();
				gameMusic.dead.pause();
				score_record.innerText = num;
				if(num>cookie){
					setCookie("best",num,1);
					cookie = num;
				}
				best_record.innerText = cookie;
			},2500)
		}
	},10)	
}



	//获取随机数：
	function rand(min,max){
		return Math.floor(Math.random()*(max-min+1)+min);
	}
	
	
	//cookie保存最高分：
	function setCookie(name,value,time){
				var now = new Date();
				var dat = now.getDate();
				now.setDate(dat + time);//过期时间
				window.document.cookie = name+" = "+value+";expires="+now.toUTCString();
		}
	
	
	function getCookie(name){
				var str = window.document.cookie;
				var arr = str.split("; ");
				var arr2 = [];
				for(var i = 0;i<arr.length;i++){
					arr2.push(arr[i].split("="));
				}
				for(var i = 0;i<arr2.length;i++){
					if(arr2[i][0] == name){
						return arr2[i][1];
					}
				}
			}