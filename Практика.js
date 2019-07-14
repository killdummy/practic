window.onload = init;

//test
var ctxMap, map, mapWidth = 1400, mapHeight = 600, healthHero, manaHero, recovery, score = 0, pause = false, turn = 0;
var rightPressed = false, leftPressed = false, jumpPressed = false;
var heroImageRight = new Image();
heroImageRight.src = "images/heroRight.png";
var heroImageLeft = new Image();
heroImageLeft.src = "images/heroLeft.png";
var mapImage1 = new Image();
mapImage1.src = "images/redForest.png";
var bulletImage = new Image();
bulletImage.src = "images/bullet.png";
var imageOpponent = new Image();
imageOpponent.src = "images/opponent.png";
var bossImageRight = new Image();
bossImageRight.src = "images/bossRight.png";
var bossImageLeft = new Image();
bossImageLeft.src = "images/bossLeft.png";
var lightningImage = new Image();
lightningImage.src = "images/lightning.png";
var shieldImage = new Image();
shieldImage.src = "images/shield.png";
var waveRightImage = new Image();
waveRightImage.src = "images/waveRight.png"
var waveLeftImage = new Image();
waveLeftImage.src = "images/waveLeft.png"
var testX = 0, testY = 0;
var isPlaying;
var bullet = [], lightning = [], enemies = [], timer = 0, bullets = 0, lights = 0, i = 0, j = 0, orientation = 0, boss = false, shieldActiv = false;
var effectActiv = false, waveCount = 0, waveLeft, waveRight, mapCount = 0, mapDrawWidth1 = 0;

var requestAnimFrame =  window.requestAnimationFrame ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame ||
						window.oRequestAnimationFrame ||
						window.msRequestAnimationFrame;

function stat(){
	document.getElementById("health-row").style.width = player.health * 2 + 'px';
	document.getElementById("mana-row").style.width = player.mana * 2 + 'px';
}

function init(){
	map = document.getElementById("canvas");
	ctxMap = map.getContext('2d');

	map.width = mapWidth;
	map.height = mapHeight;

	spawnOpponent(7);

	startLoop();

	recoveryStat();

	addEventListener("keydown", function(event){
		switch(event.keyCode){
			case 68:
				rightPressed = true;
				orientation = 0;
				turn = 0;
				break;
			case 65:
				leftPressed = true;
				orientation = 1;
				turn = 1;
				break;
			case 87:
				jumpPressed = true;
				break;
			case 27:
				if (pause == false){
					pause = true;
					stopLoop();
					alert("pause");
				}else{
					pause = false;
					startLoop();
					alert("play");
				}
				break;
			case 16:
				if (player.mana > 19){
					if (shieldActiv == false){
						shieldActiv = true;
					}else{
						shieldActiv = false;
					}
				}
				break;
			case 50:
				if (player.mana > 19){ 
					effectActiv = true;
					player.mana -= 20;
					for (i = 0; i < enemies.length; i++){
						if ((enemies[i].x > player.x - 300) && (enemies[i].x < player.x + 300)){
							enemies[i].effect = true;
						}
					}
				}
				break;
			case 51:
				if (player.mana > 29) player.mana -= 30;
				break;
			
		}
	});

	addEventListener("keyup", function(event){
		switch(event.keyCode){
			case 68:
				rightPressed = false;
				break;
			case 65:
				leftPressed = false;
				break;
		}
	});

	
}

function loop(){
	if (isPlaying){
		update();
		requestAnimFrame(loop);
	}
}

function startLoop(){
	isPlaying = true;
	loop();
}

function stopLoop(){
	isPlaying = false;
}

function update(){
	draw();
}

function spawnOpponent(count){
	var ran = Math.random();
	for (i = 0; i < count; i++){
		if (ran > 0.5){
			enemies.push({
				health: 30,
				x: Math.floor(Math.random() * mapWidth) + mapWidth,
				y: 490,
				pW: 100,
				pH: 100,
				effect: false,
				distance: 100,
			});
		}else{
			enemies.push({
				health: 30,
				x: Math.floor(Math.random() * mapWidth) - mapWidth,
				y: 490,
				pW: 100,
				pH: 100,
				effect: false,
				distance: 100,
			});
		}
		ran = Math.random();
	}
}

function spawnBoss(){
	boss = true;
	if (player.x > mapWidth / 2){
		enemies.push({
			health: 150,
			x: 0,
			y: 340,
			pW: 300,
			pH: 300,
			move: 1,
		});
	}else{
		enemies.push({
			health: 150,
			x: mapWidth - 300,
			y: 340,
			pW: 300,
			pH: 300,
			move: -1,
		});
	}
}

var drawEnemies = {
	drawRight: function(){
		ctxMap.drawImage(imageOpponent, 0, 160, 70, 70, enemies[i].x, enemies[i].y, 100, 100);
	},
	drawLeft: function(){
		ctxMap.drawImage(imageOpponent, 0, 80, 70, 70, enemies[i].x, enemies[i].y, 100, 100);
	},
	drawBossRight: function(){
		ctxMap.drawImage(bossImageRight, 0, 0, 600, 500, enemies[i].x, enemies[i].y, 300, 300);
	},
	drawBossLeft: function(){
		ctxMap.drawImage(bossImageLeft, 0, 0, 600, 500, enemies[i].x, enemies[i].y, 300, 300);
	}
}

var drawMap = {
	draw1: function(){
		ctxMap.drawImage(mapImage1, 0, 90, 2500, 1500, mapDrawWidth1-300, 0, mapWidth+500, mapHeight+500);
	}
}

var drawBullet = {
	draw: function(){
		ctxMap.drawImage(bulletImage, 0, 0, 60, 58, bullet[i].x, bullet[i].y, 50, 50);
	},
	drawLight: function(){
		ctxMap.drawImage(lightningImage, 0, 0, 497, 556, lightning[i].x, lightning[i].y, 70, 250);
	},
	drawShield: function(){
		ctxMap.drawImage(shieldImage, 0, 350, 200, 200, player.x-47, player.y-25, 250, 200);
	},
	drawWaveRight: function(){
		ctxMap.drawImage(waveRightImage, 0, 0, 165, 250, waveRight, player.y, 100, 150);
	},
	drawWaveLeft: function(){
		ctxMap.drawImage(waveLeftImage, 0, 0, 165, 250, waveLeft, player.y, 100, 150);
	}
}

var player = {
	health: 100,
	mana: 100,
	x: 400,
	y: 450,
	pW: 150,
	pH: 150,
	velX: 0,
	keys: [],
	speed: 8,
	jumpCount: 0,
	jumpLength: 50,
	drawRight: function(){
		ctxMap.drawImage(heroImageRight, 0, 0, 180, 180, this.x, this.y, this.pW, this.pH);
	},
	drawLeft: function(){
		ctxMap.drawImage(heroImageLeft, 0, 0, 180, 180, this.x, this.y, this.pW, this.pH);
	}
}

function draw(){
	ctxMap.clearRect(0, 0, mapWidth, mapHeight);
	drawMap.draw1();
	stat();
	
	document.form.score.value = score;

	if (shieldActiv) drawBullet.drawShield();
	if (player.mana < 5) shieldActiv = false;

	if (turn == 0) {
		player.drawRight();
	}else{
		player.drawLeft();
	}

	if (lightning.length != 0){
		for (i = 0; i < lightning.length; i++){
			drawBullet.drawLight();
			lightning[i].lifeTime++;
			if (lightning[i].lifeTime > 50) lightning.splice(i, 1);
		}
	}
	
	if (rightPressed && player.x < mapWidth - 150) {
		mapDrawWidth1--;
		player.x += player.speed;
	}
    if (leftPressed && player.x > 0) {
    	mapDrawWidth1++;
    	player.x -= player.speed;
    }

    if (jumpPressed) {
        player.jumpCount++;
        player.y = -(3 * player.jumpLength * Math.sin(Math.PI * player.jumpCount / player.jumpLength)) + 450;
    } 

    if(player.jumpCount > player.jumpLength){
    	player.jumpCount = 0;
    	jumpPressed = false;
    	player.y = 450;
	}

	for (i = 0; i < bullet.length; i++){
        bullet[i].x += bullet[i].move;
		drawBullet.draw();
		if ((bullet[i].x > mapWidth) || (bullet[i].x < 0)) bullet.splice(i, 1);
	}

	timer++;

	if (timer % 12 == 0){
		bullets = 0;
		lights = 0;
	}

	for (i = 0; i < enemies.length; i++){
		if (!boss){
			if (!enemies[i].effect){
				if (enemies[i].x <= player.x){
					enemies[i].x += 2;
					drawEnemies.drawRight();
				}else{
					enemies[i].x -= 2;
					drawEnemies.drawLeft();
				}
			}else{
				if (enemies[i].distance > 0){
					if (enemies[i].x > player.x){
						enemies[i].distance--;
						enemies[i].x += 3.3;
						drawEnemies.drawLeft();
					}else{
						enemies[i].distance--;
						enemies[i].x -= 3.3;
						drawEnemies.drawRight();
					}
				}else{
					enemies[i].distance = 100;
					enemies[i].effect = false;
				}
			}
		}else{
			if (enemies[i].move > 0){
				drawEnemies.drawBossRight();
				enemies[i].x += 1;
			}else{
				drawEnemies.drawBossLeft();
				enemies[i].x -= 1;
			}
		}
		if (!boss){
			if ((enemies[i].x > player.x) && (enemies[i].x < player.x + player.pW) && (player.y > 340) && (!shieldActiv)) player.health -= 1;
		}else{
			if (((enemies[i].x - 30) < player.x) && ((enemies[i].x + enemies[i].pW) > player.x)) player.health -= 10;
		}

		for (j = 0; j < lightning.length; j++){
			if ((lightning[j].x > enemies[i].x) && (lightning[j].x < enemies[i].x + enemies[i].pW)){
				if (!boss) enemies[i].health -= 30;
			}
		}

		for (j = 0; j < bullet.length; j++){
			if ((bullet[j].x > enemies[i].x) && (bullet[j].x < enemies[i].x + enemies[i].pW)){
				bullet.splice(j, 1);
				enemies[i].health -= 10;
			}
		}
		if (enemies[i].health <= 0) {
			if (!boss) {
				enemies.splice(i, 1);
				spawnOpponent(1);
			}else{
				enemies.splice(0, 1);
				i = 0;
				boss = false;
				spawnOpponent(7);
			}
			score++;
			if (score % 10 == 0) {
				enemies.splice(0, enemies.length);
				spawnBoss();
				i = 0;
				alert("DANGER!!!!")
			}
			console.log("enemies :" + enemies.length);
		}
	}

	if (player.health <= 0){
		alert("You died");
		shieldActiv = false;
		bullet.splice(0, 100);
		enemies.splice(0, 100);
		player.health = 100;
		player.mana = 100;
		spawnOpponent(7);
		score = 0;
		boss = false;
	}

	if (effectActiv){
		waveRight = player.x + 100;
		waveLeft = player.x - 60;
		waveCount += 5;
		waveRight += waveCount;
		waveLeft -= waveCount;
		drawBullet.drawWaveRight();
		drawBullet.drawWaveLeft();
		if (waveCount > 100) {
			effectActiv = false;
			waveCount = 0;
		}
	}

	addEventListener("keydown", function(event){
		switch(event.keyCode){
			case 74:
				if (bullets <= 0){
                    if (orientation == 0){
                        bullet.push({
                            x: player.x + player.pW/2,
                            y: player.y + player.pH/2,
                            vx: 10,
                            vy: 0,
                            move: 10
                        });
                    }else {
                        bullet.push({
                            x: player.x + player.pW/2,
                            y: player.y + player.pH/2,
                            vx: 10,
                            vy: 0,
                            move: -10
                        });
                    }					
				bullets++;
				}
				break;
			case 51:
				if (player.mana > 29){
					var moveLight = turn;
					var countLight = 0;
					var lightsX = player.x;
					if (lights <= 0){
						var storm = setInterval(function(){
								if (countLight < 12){
									if (moveLight == 0){
										lightning.push({
											x: Math.random() * 200 + lightsX + player.pW,
											y: 350,
											pW: 30,
											pH: 250,
											lifeTime: 0,
											move: 1,
										});
									}else{
										lightning.push({
											x: Math.random() * 200 + lightsX - player.pW * 2,
											y: 350,
											pW: 30,
											pH: 250,
											lifeTime: 0,
											move: 1,
										});
									}
								countLight++;
								}
						}, 300)
					lights++;
					}	
				}
		}
	});
}

function recoveryStat(){
	recovery = setInterval(function(){
		if (player.mana < 100) player.mana += 5;
		if (player.health < 100) player.health += 2;
		if (shieldActiv) player.mana -= 20;
	}, 1000)
}
