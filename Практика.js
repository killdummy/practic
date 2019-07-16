window.onload = init;

//test
var ctxMap, map, mapWidth = 1400, mapHeight = 600, healthHero, manaHero, recovery, score = 0, coins = 0, pause = false, turn = 0;
var rightPressed = false, leftPressed = false, jumpPressed = false;
var heroImageRight = new Image();
heroImageRight.src = "images/heroAnim.png";
///
var blood = new Image();
blood.src = "images/blood.png";
///
var heroImageLeft = new Image();
heroImageLeft.src = "images/animLeft.png";
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
waveRightImage.src = "images/waveRight.png";
var waveLeftImage = new Image();
waveLeftImage.src = "images/waveLeft.png";
var skillImage = new Image();
skillImage.src = "images/use3skill.png";
var potionImageHeal = new Image();
potionImageHeal.src = "images/potionHeal.png";
var potionImageMana = new Image();
potionImageMana.src = "images/potionMana.png";
var testX = 0, testY = 0;
var isPlaying;
var bullet = [], lightning = [], enemies = [], potions = [], timer = 0, bullets = 0, lights = 0, i = 0, j = 0, orientation = 0, boss = false, shieldActiv = false;
var effectActiv = false, waveCount = 0, waveLeft, waveRight, mapCount = 0, mapDrawWidth1 = 0, tickCount = 0, tickCountSkill = 0, xCadrSkill = 0;
var yCadrSkill = 0, stormActive = false, heal = false, mana = false, damageUp = false, healthUp = false, manaUp = false, startGame = true;

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

	if (startGame = true){
		stopLoop();
		ctxMap.fillStyle = "white";
    	ctxMap.font = "bold 30px sans-serif";
    	ctxMap.fillText("Управление: D - вправо, A - влево, W - прыжок, space - стрельба", 50, 50);
    	ctxMap.fillText("2 - отбрасывание, 3 - шторм, shift - щит, Esc - пауза", 50, 100);
    	ctxMap.fillText("Зарабатывайте деньги, чтобы купить улучшение, каждое улучшение стоит 50 монет", 50, 150);
    	ctxMap.fillText("Продержитесь как можно дольше, удачи!!!", 50, 200);
    	ctxMap.fillText("Нажмите ENTER чтобы начать", 50, 250);
	}

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
					stopLoop();///no alert
					ctxMap.fillStyle = "white";
    				ctxMap.font = "bold 30px sans-serif";
    				ctxMap.fillText("Pause", 50, 50);
				}else{
					pause = false;
					startLoop();
				}
				break;
			case 13:
				if (startGame = true){
					startGame = false;
					startLoop();
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
				y: 450,
				pW: 100,
				pH: 100,
				effect: false,
				distance: 100,
				///
				timer: 50,
				atack: function(){
					if (this.timer == 50){
						player.health -= 10;
						this.timer = 0;
					}
				},
				///
				xCadrChange: 0,
				yCadrChange: 80,
				tickCount: 0,
			});
		}else{
			enemies.push({
				health: 30,
				x: Math.floor(Math.random() * mapWidth) - mapWidth,
				y: 450,
				pW: 100,
				pH: 100,
				effect: false,
				distance: 100,
				///
				timer: 50,
				atack: function(){
					if (this.timer == 50){
						player.health -= 10;
						this.timer = 0;
					}
				},
				///
				xCadrChange: 0,
				yCadrChange: 160,
				tickCount: 0,
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
		ctxMap.drawImage(imageOpponent, enemies[i].xCadrChange, enemies[i].yCadrChange, 70, 70, enemies[i].x, enemies[i].y, 100, 100);
	},
	drawLeft: function(){
		ctxMap.drawImage(imageOpponent, enemies[i].xCadrChange, enemies[i].yCadrChange, 70, 70, enemies[i].x, enemies[i].y, 100, 100);
	},
	drawBossRight: function(){
		ctxMap.drawImage(bossImageRight, 0, 0, 600, 500, enemies[i].x, enemies[i].y-35, 300, 300);
	},
	drawBossLeft: function(){
		ctxMap.drawImage(bossImageLeft, 0, 0, 600, 500, enemies[i].x, enemies[i].y-35, 300, 300);
	}
}

var drawMap = {
	draw1: function(){
		ctxMap.drawImage(mapImage1, 0, 90, 2500, 1500, mapDrawWidth1-450, 0, mapWidth+800, mapHeight+500);
	}
}

var drawBullet = {
	draw: function(){
		ctxMap.drawImage(bulletImage, 0, 0, 60, 58, bullet[i].x, bullet[i].y, 40, 40);
	},
	drawLight: function(){
		ctxMap.drawImage(lightningImage, 0, 0, 497, 556, lightning[i].x, lightning[i].y, 70, 215);
	},
	drawShield: function(){
		ctxMap.drawImage(shieldImage, 0, 350, 200, 200, player.x-62, player.y-45, 200, 150);
	},
	drawWaveRight: function(){
		ctxMap.drawImage(waveRightImage, 0, 0, 165, 250, waveRight-30, player.y, 80, 85);
	},
	drawWaveLeft: function(){
		ctxMap.drawImage(waveLeftImage, 0, 0, 165, 250, waveLeft-30, player.y, 80, 85);
	},
	drawSkill: function(){
		ctxMap.drawImage(skillImage, xCadrSkill, yCadrSkill, 192, 192, player.x-35, player.y-35, player.pW+60, player.pH+60);
	}
}

var potionHeal = {
	health: 30, 
	x: Math.floor(Math.random() * mapWidth),
	y: 500,
	pW: 50,
	pH: 50,
	timer: 0,
	drawPotion: function(){
		ctxMap.drawImage(potionImageHeal, 0, 0, 568, 661, this.x, this.y, this.pW, this.pH);
	}
}

var potionMana = {
	mana: 30, 
	x: Math.floor(Math.random() * mapWidth),
	y: 510,
	pW: 33,
	pH: 33,
	timer: 0,
	drawPotion: function(){
		ctxMap.drawImage(potionImageMana, 0, 0, 100, 100, this.x, this.y, this.pW, this.pH);
	}
}

function damageLevelUp(){
	if (coins >= 50 && !damageUp){
		damageUp = true;
		coins -= 50;
		document.getElementById("btnLevelUpDamage").style.textDecoration = "line-through";
	} 
}

function healthLevelUp(){
	if (coins >= 50 && !healthUp){
		healthUp = true;
		coins -= 50;
		document.getElementById("health").style.width = '300px';
		document.getElementById("health-row").style.width = '300px';
		document.getElementById("btnLevelUpHealth").style.textDecoration = "line-through";
	} 
}

function manaLevelUp(){
	if (coins >= 50 && !manaUp){
		manaUp = true;
		coins -= 50;
	} 
	document.getElementById("mana").style.width = '300px';
	document.getElementById("mana-row").style.width = '300px';
	document.getElementById("btnLevelUpMana").style.textDecoration = "line-through";
}

var player = {
	health: 100,
	mana: 100,
	x: mapWidth / 2,
	y: 470,
	pW: 80,
	pH: 80,
	velX: 0,
	keys: [],
	speed: 4,
	jumpCount: 0,
	jumpLength: 50,
	xCadrChangeRight: 490,
	xCadrChangeLeft: 490,
	yCadrChangeRight: 576,
	yCadrChangeLeft: 480,
	drawRight: function(){
		ctxMap.drawImage(heroImageRight, this.xCadrChangeRight, this.yCadrChangeRight, 90, 95, this.x, this.y, this.pW, this.pH);
	},
	drawLeft: function(){
		ctxMap.drawImage(heroImageRight, this.xCadrChangeLeft, this.yCadrChangeLeft, 90, 95, this.x, this.y, this.pW, this.pH);
	},
	///
	damaged: function(){
		ctxMap.drawImage(blood, 0, 0, 700, 700, this.x, this.y + 20, this.pW - 20, this.pH - 20);
	}
	///
}

function draw(){
	ctxMap.clearRect(0, 0, mapWidth, mapHeight);
	drawMap.draw1();
	stat();

	//potion
	if (player.health < 50 && potionHeal.timer == 400) heal = true;

	if (heal) potionHeal.drawPotion();

	if (player.y == 470 && player.x > potionHeal.x && player.x < potionHeal.x + 10 && heal && player.health < 100){
		player.health = (player.health > 70 ? 100 : player.health + potionHeal.health);
		heal = false; 
		potionHeal.x = Math.floor(Math.random() * mapWidth);
		potionHeal.timer = 0;
	}

	if (player.mana < 50 && potionMana.timer == 400) mana = true;

	if (mana) potionMana.drawPotion();

	if (player.y == 470 && player.x > potionMana.x && player.x < potionMana.x + 10 && mana && player.mana < 100){
		player.mana = (player.mana > 70 ? 100 : player.mana + potionMana.mana);
		mana = false; 
		potionMana.x = Math.floor(Math.random() * mapWidth);
		potionMana.timer = 0;
	}
	//

	if (turn == 0) {
		player.drawRight();
	}else{
		player.drawLeft();
	}

	if (stormActive) {
		if (tickCountSkill > 2){
			tickCountSkill = 0;
			if (xCadrSkill >= 768){
				xCadrSkill = 0;
				yCadrSkill += 192;
			}else{
				xCadrSkill += 192;
			}
			if (xCadrSkill >= 768 && yCadrSkill >= 576) {
				stormActive = false;
				xCadrSkill = 0;
				yCadrSkill = 0;
			}
		}
		drawBullet.drawSkill();
	}
	tickCountSkill++;

	if (tickCount > 7){
		tickCount = 0;
		if (rightPressed) {
			player.xCadrChangeRight = (player.xCadrChangeRight < 291 ? 490 : player.xCadrChangeRight - 100);
		}else{
			player.xCadrChangeRight = 490;
		}
		if (leftPressed) {
			player.xCadrChangeLeft = (player.xCadrChangeLeft < 291 ? 490 : player.xCadrChangeLeft - 100);
		}else{
			player.xCadrChangeLeft = 490;
		}
	}

	timer++;
	if (timer > 1000) timer = 0;
	tickCount++;
	if (potionHeal.timer < 400) potionHeal.timer++;
	if (potionMana.timer < 400) potionMana.timer++;
	
	
	document.form.score.value = score;
	document.form1.money.value = coins;

	if (shieldActiv) drawBullet.drawShield();
	if (player.mana < 5) shieldActiv = false;

	if (lightning.length != 0){
		for (i = 0; i < lightning.length; i++){
			drawBullet.drawLight();
			lightning[i].lifeTime++;
			if (lightning[i].lifeTime > 50) lightning.splice(i, 1);
		}
	}
	
	if (rightPressed && player.x < mapWidth - 80) {
		mapDrawWidth1 -= player.speed / 2;
		potionHeal.x -= player.speed;
		potionMana.x -= player.speed;
		player.x += player.speed;
	}
    if (leftPressed && player.x > 0) {
    	mapDrawWidth1 += player.speed / 2;
    	potionHeal.x += player.speed;
    	potionMana.x += player.speed;
    	player.x -= player.speed;
    }

    if (jumpPressed) {
        player.jumpCount++;
        player.y = -(3 * player.jumpLength * Math.sin(Math.PI * player.jumpCount / player.jumpLength)) + 470;
    } 

    if(player.jumpCount > player.jumpLength){
    	player.jumpCount = 0;
    	jumpPressed = false;
    	player.y = 470;
	}

	for (i = 0; i < bullet.length; i++){
        bullet[i].x += bullet[i].move;
		drawBullet.draw();
		if ((bullet[i].x > mapWidth) || (bullet[i].x < 0)) bullet.splice(i, 1);
	}

	if (timer % 12 == 0){
		bullets = 0;
		lights = 0;
	}

	for (i = 0; i < enemies.length; i++){
		if (!boss) enemies[i].tickCount++;
		if (!boss){
			if (enemies[i].timer != 50) enemies[i].timer++;
			if (!enemies[i].effect){
				if (enemies[i].x <= player.x){
					if (leftPressed){
						enemies[i].x += 4;
					}else{
						enemies[i].x += 2;
					}
					if (enemies[i].tickCount > 15){
						enemies[i].tickCount = 0;
						enemies[i].yCadrChange = 160;
						enemies[i].xCadrChange = (enemies[i].xCadrChange > 239 ? 0 : enemies[i].xCadrChange + 80);
					}
					drawEnemies.drawRight();
				}else{
					if (rightPressed){
						enemies[i].x -= 4;
					}else{
						enemies[i].x -= 2;
					}
					if (enemies[i].tickCount > 15){
						enemies[i].tickCount = 0;
						enemies[i].yCadrChange = 80;
						enemies[i].xCadrChange = (enemies[i].xCadrChange > 239 ? 0 : enemies[i].xCadrChange + 80);
					}
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
				if (leftPressed){
					enemies[i].x += 3.5;
				}else{
					enemies[i].x += 1.5;
				}
			}else{
				drawEnemies.drawBossLeft();
				if (rightPressed){
					enemies[i].x -= 3.5;
				}else{
					enemies[i].x -= 1.5;
				}
			}
		}
		if (!boss){
			if ((enemies[i].x > player.x - 75) && (enemies[i].x < (player.x + player.pW - 50)) && (player.y > 440) && (!shieldActiv)){
				enemies[i].atack();
				player.damaged();
			}
		}else{
			if (((enemies[i].x - 30) < player.x) && ((enemies[i].x + enemies[i].pW) > player.x)) player.health -= 10;
		}

		for (j = 0; j < lightning.length; j++){
			if ((lightning[j].x > enemies[i].x) && (lightning[j].x < enemies[i].x + enemies[i].pW)){
				if (!boss) enemies[i].health -= 30;
			}
		}

		for (j = 0; j < bullet.length; j++){
			if ((bullet[j].x > enemies[i].x) && (bullet[j].x < enemies[i].x + enemies[i].pW) && (bullet[j].y > enemies[i].y)){
				bullet.splice(j, 1);
				if (!damageUp){
					enemies[i].health -= 10;
				}else{
					enemies[i].health -= 15;
				}
			}
		}
		if (enemies[i].health <= 0) {
			if (!boss) {
				enemies.splice(i, 1);
				spawnOpponent(1);
				coins += 5;
			}else{
				enemies.splice(0, 1);
				i = 0;
				boss = false;
				spawnOpponent(7);
				coins += 20;
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
		shieldActiv = false;
		bullet.splice(0, 100);
		enemies.splice(0, 100);
		lightning.splice(0, 100);
		spawnOpponent(7);
		mapDrawWidth1 = 0;
		boss = false;
		///
		stopLoop();
		ctxMap.fillStyle = "red";
    		ctxMap.font = "bold 45px sans-serif";
    		ctxMap.textAlign = "center";
    		ctxMap.fillText("Game Over", mapWidth / 2, 80);
    		showButtons();
		///
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
			case 32:
				if (bullets <= 0){
                    if (orientation == 0){
                        bullet.push({
                            x: player.x + player.pW/2 - 10,
                            y: player.y + player.pH/2 - 10,
                            vx: 10,
                            vy: 0,
                            move: 10
                        });
                    }else {
                        bullet.push({
                            x: player.x + player.pW/2 - 10,
                            y: player.y + player.pH/2 - 10,
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
					stormActive = true;
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
											x: Math.random() * 200 + lightsX - player.pW * 4,
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
	recovery = setInterval(function(){///&&(!pause)!
		if ((shieldActiv) && (!pause)) player.mana -= 20;
		if (!healthUp){
			if ((player.health < 100) && (!pause)) player.health += 2;
		}else{
			if ((player.health < 150) && (!pause)) player.health += 2;
		}
		if (!manaUp){
			if ((player.mana < 100) && (!pause)) player.mana += 5;
		}else{
			if ((player.mana < 150) && (!pause)) player.mana += 10;
		}
	}, 1000)
}

///
function showButtons(){
	document.getElementById("afterdeath").style.display = "grid";
}

function newgame(){
	document.getElementById("afterdeath").style.display = "none";
	player.x = mapWidth / 2;
	player.y = 470;
	pause = false;
	score = 0;
	coins = 0;
	potionHeal.timer = 0;
	potionMana.timer = 0;
	mana = false;
	heal = false;
	healthUp = false;
	damageUp = false;
	manaUp = false;
	player.health = 100;
	player.mana = 100;
	document.getElementById("health").style.width = '200px';
	document.getElementById("health-row").style.width = '200px';
	document.getElementById("mana").style.width = '200px';
	document.getElementById("mana-row").style.width = '200px';
	document.getElementById("btnLevelUpDamage").style.textDecoration = "none";
	document.getElementById("btnLevelUpHealth").style.textDecoration = "none";
	document.getElementById("btnLevelUpMana").style.textDecoration = "none";
	startLoop();
}

function save(){
	var username = document.form2.username.value;
	
	var User = function(name, score){
	this.name = name;
	this.score = score;
	this.time = new Date();
	}

	var newuser = new User(username, score);
	var data = [];
	if (JSON.parse(localStorage.getItem("users")) != null){
		data = JSON.parse(localStorage.getItem("users"));
	}
	data.push(newuser);
	localStorage.setItem("users", JSON.stringify(data));
}
