/**
 * Created with JetBrains WebStorm.
 * User: JBECKE15
 * Date: 9/19/13
 * Time: 5:41 PM
 * To change this template use File | Settings | File Templates.
 */

var c = document.getElementById("canvas");
var ctx=c.getContext("2d");

var stage = new createjs.Stage(c);
//ctx.fillStyle="#FF0000";
//ctx.fillRect(0,0,150,75);

/////////////
//Variables//
/////////////////////////////////////////////////////////////////////

//Fractal Background & Reveal
var backgroundImg = new Image();
var pixelArray = createArray(720,480);
var bgAnimationFrame = 0;
backgroundImg.src = "Fractal Animation/Fractal_SpriteSheet.png";

//createjs stuff, incase we decide to do this.. personally I could not get it working
/*var bgAnimation = new createjs.SpriteSheet({images: ["Fractal Animation/Fractal_SpriteSheet.png"], frames: [[0,0,720,481,0,360,239.55],[720,0,720,481,0,360,239.55],[1440,0,720,481,0,360,239.55],[2160,0,720,481,0,360,239.55],[2880,0,720,481,0,360,239.55],[0,481,720,481,0,360,239.55],[720,481,720,481,0,360,239.55],[1440,481,720,481,0,360,239.55],[2160,481,720,481,0,360,239.55],[2880,481,720,481,0,360,239.55],[0,962,720,481,0,360,239.55],[720,962,720,481,0,360,239.55],[1440,962,720,481,0,360,239.55],[2160,962,720,481,0,360,239.55],[2880,962,720,481,0,360,239.55],[0,1443,720,481,0,360,239.55],[720,1443,720,481,0,360,239.55],[1440,1443,720,481,0,360,239.55],[2160,1443,720,481,0,360,239.55],[2880,1443,720,481,0,360,239.55],[0,1924,720,481,0,360,239.55],[720,1924,720,481,0,360,239.55],[1440,1924,720,481,0,360,239.55],[2160,1924,720,481,0,360,239.55],[2880,1924,720,481,0,360,239.55],[0,2405,720,481,0,360,239.55],[720,2405,720,481,0,360,239.55],[1440,2405,720,481,0,360,239.55],[2160,2405,720,481,0,360,239.55],[2880,2405,720,481,0,360,239.55],[0,2886,720,481,0,360,239.55]]});
var bgSprite = new createjs.Sprite(bgAnimation,1);
*/

//Timer/Phase Ending
var endManic = false;
var startTime = 60;
var cTime = startTime;
//var lastTime;

//Player
var playerImg = new Image();
playerImg.src = "Manic_Fly/ManicFly_SpriteSheet.png";
var playerImgFrame = 0;
//398-329 = width
//335-94 = height
var playerWidth = 69 * (144/720);//(329*(144/720));
var playerHeight = 241 * (96/480);//(94*(96/480));

var playerwidth = 69;// playerImg.clientWidth;
var playerheight = 241;//playerImg.clientHeight;
var posX = 360-32;
var posY = 240;
var rightKeyDown = false;
var leftKeyDown = false;
var upKeyDown = false;
var playerSpeed = 0;
var maxPlayerSpeed = 6;
var upSpeed = 0;
var gravity = 5;
var velocity = 0;
var tempVel = 0;
var tempPos = 0;
var standstill = false;
var acceleration = gravity/27;
var jumpStrength = 8.5;
var friction = 1;
var gameOver = false;

//Platforms
var platformGravity = 0;
var platformImg = new Image();
platformImg.src = "platform.png";
var plX = 720 - 64;
var plY = 360;
var platwidth = 96;
var platheight = 32;
var offset = 80;
var gravcheck = 0;

//Person
var personImg = new Image();
personImg.src = "person.png";
var personCounter = 6;
function brokenPlatform(x,y)
{
    this.bpx = x;
    this.bpy = y;
    this.frame = 1;
    this.used = false;
    this.vel = 0;
    this.resetVals = function()
    {
        this.frame = 1;

        this.vel = 0;
    }
    this.updateFall = function()
    {
        //fall if in place
        if(this.used == true)
        {

            this.vel ++;
            this.bpy += this.vel + platformGravity;
        }

        if(this.bpy > 480)
        {
            this.used = false;
            this.bpx = -100;
            this.bpy = -100;

        }
    }
}

function platform(x, y, num)
{
    this.plx = x;
    this.ply = y;
    this.personCheck = false;
    this.numba =   num;
    this.nullify = false;

    this.setpos = function(a, b)
    {
        this.plx = a;
        this.ply = b;
    }
    this.sety = function(l)
    {
        this.ply = l;
    }
    this.smash = function(byPlayer)
    {
        if(bp1.used == false)
        {
            bp1.bpx = this.plx;
            bp1.bpy = this.ply;
            bp1.used = true;
            bp1.resetVals();
        }
        else if(bp2.used == false)
        {
            bp2.bpx = this.plx;
            bp2.bpy = this.ply;
            bp2.used = true;
            bp2.resetVals();
        }


		if(byPlayer)
		{
			bgAnimationFrame++;
			if(bgAnimationFrame > 30)
			{
				bgAnimationFrame = 30;
			}
		}
		
        if(this.nullify == false)
        {
			if(this.plx > 360)
			{
				this.setpos((360 * Math.random()), -offset);
			}
			else if(this.plx < 360)
			{
	
				this.setpos(((360 * (1 + Math.random())) -96), -offset);          //96= width
			}
			offset += 80;
			personCounter--;
        }
        else
        {
            this.setpos(-96, -32);
        }
        if(person1.broken == 1)
        {

            if(this.personCheck == true)
            {
                this.personCheck = false;
                person1.broken = 0;
                //alert("HIT");
            }
        }
        if(personCounter <= 0)
        {

             if(person1.broken == 2)
            {
                person1.persx = this.plx;
                person1.persy = this.ply;
                this.personCheck = true;
                person1.broken = 1;
                personCounter = 6;
            }
        }

    }
    this.collision = function()
    {
        //check for collision between player and platform


        if(((posX < (this.plx +96)) && (posX > this.plx)) || (((posX+32) < (this.plx +96)) && ((posX +32) > this.plx)))
        {

            if(((posY+32) < (this.ply + 32)) && ((posY+32) > (this.ply)))
            {
                if(velocity >= 0)
                {
                    if(standstill == false)
                    {

                        upSpeed+= jumpStrength * 1.1;
                        velocity = -upSpeed;
                        this.smash(true);
                    }
                }
            }
        }

    }
}
//Establishes the person "class"
function person(x,y,num)
{
    this.persx = x;
    this.persy = y;
    this.speed = 3;
    this.broken = num;
    this.fall = function()
    {
        //this.broken = 0;

        if(this.persy <=480)
        {
            this.speed ++;
            this.persy += this.speed;
        }
        else
        {
            this.broken = 2;
            this.speed = 3;

        }

    }
}
//Create all the platforms
var p1 = new platform(400, 270, 1);
var p2 = new platform(100, 100, 2);
var p3 = new platform(600, 410, 3);
var p4 = new platform(3, 350, 4);
var p5 = new platform(500, 50, 5);

var bp1 = new brokenPlatform(-100, -100) ;
var bp2 = new brokenPlatform(-100, -100);

//Create the person
var person1 = new person(-200, 500, 2);

//Debug
ctx.font = "32px Verdana";

//Setup
var Game = {};
Game.fps = 60;

document.onkeydown = keyDownListener;
document.onkeyup = keyUpListener;

//End Variables
////////////////////////////////////////////////////////////////

//Runs once per second.
Game.timerTick = function()
{
    cTime--;

    if(cTime < 0)
    {
        //Transition to depression phase.

        gameOver = true;
        //When transition is done set the following variables below.
        //cTime = startTime;

    }
}

//Runs once per frame
Game.run = function()
{
    Game.update();
    Game.draw();
}

Game.draw = function()
{
    if(endManic)
    {
        setTimeout( ctx.clearRect(0,0,720,480), 1000);
    }
    else
    {
        ctx.clearRect(0,0,720,480);
		//This is cheating
        ctx.drawImage(backgroundImg,(bgAnimationFrame%5)*-720,Math.floor(bgAnimationFrame/5)*-481);
		
        ctx.drawImage(platformImg, p1.plx, p1.ply); // draw platform 1
        ctx.drawImage(platformImg, p2.plx, p2.ply); // draw platform 2
        ctx.drawImage(platformImg, p3.plx, p3.ply); // draw platform 3
        ctx.drawImage(platformImg, p4.plx, p4.ply); // draw platform 4
        ctx.drawImage(platformImg, p5.plx, p5.ply); // draw platform 5

        ctx.drawImage(platformImg, bp1.bpx, bp1.bpy);
        ctx.drawImage(platformImg, bp2.bpx, bp2.bpy);

        ctx.drawImage(personImg, person1.persx, person1.persy); // draw person1
	//	ctx.drawImage(playerImg,0,0,720,480,posX-(329*(144/720)),posY-(94*(96/480)),144,96);
		ctx.drawImage(playerImg,(playerImgFrame%5) * 720,Math.floor(playerImgFrame/5)*480,720,480,posX-(329*(144/720)),posY-(94*(96/480)),144,96);
     //   ctx.drawImage(playerImg,posX,posY);
	 
//329,94
        ctx.fillText((cTime).toString(),360 - 15,50);
    }
}

Game.update = function()
{
    //Fractal Background Image Reveal
 //   var backgroundImageData = backgroundImg.getImageData(0, 0, backgroundImg.width, backgroundImg.height);
  //  for(var i = 0, n = backgroundImageData.length; i < n; i += 4)
  //  {
  //      backgroundImageData[i + 3] = 255;//Alpha
  //  }
 //   backgroundImg.putImageData(backgroundImageData,0,0,backgroundImg.width, backgroundImg.height);

    //Player movement stuff
//	posX += playerSpeed * friction;
	//398-329 = width
	//335-94 = height
	//420 = end of player..
	//720-420
    bp1.updateFall();
    bp2.updateFall();
    if(posX + playerSpeed * friction < 720 - playerWidth)
    {
        if(posX + playerSpeed * friction > 0)
        {
            posX += playerSpeed * friction;
        }
        else
        {
            posX = 0;
        }
    }
    else
    {
        posX = 720 - playerWidth;
    }
	
    if(posY >= 480)
    {
        if(gameOver == false)
        {
            upSpeed += jumpStrength * 1.25;
            velocity = -upSpeed;
            //platformGravity = 4;
            gravcheck = 30;
        }
        else
        {
            endManic = true;
        }
    }

    if(posY <= 120)
    {
        //gravity = 6;

            if(standstill == false)
            {
                tempVel = velocity;
                tempPos = posY;
                standstill = true;
            }
            velocity = 0;
            posY = 120;
            tempVel = tempVel + acceleration;
            tempPos = tempPos + tempVel - upSpeed;
        upSpeed --;
            if(tempVel > 0)
            {
                velocity = tempVel;
                //posY = tempPos;
                posY += velocity - upSpeed;
                standstill = false;
            }
        if(standstill == true)
        {

                platformGravity = -tempVel * 2;


        }
    }
    else
    {
        velocity = velocity + acceleration;
        posY += velocity - upSpeed;
        upSpeed--;
        //gravity = 2
             if(gravcheck > 0)
             {
            platformGravity = - velocity;
             }
        else
             {
                 platformGravity = 0;
             }
        gravcheck --;

    }
    //Remove platforms as time ticks on
    if(cTime < 40)
    {
        if(p1.numba > 0)
        {
            /*if(p1.personCheck == true)
            {
                person1.broken = 0;
            }*/

            p1.numba = 0;
        }
        else
        {
            p1.nullify = true;
            //p1.setpos(-96, -32);
        }
        if(cTime < 20)
        {
            if(p2.numba > 0)
            {
               /* if(p2.personCheck == true)
                {
                    person1.broken = 0;
                } */

                p2.numba = 0;
            }
            else
            {
                //p2.setpos(-96, -32);
                p2.nullify = true;
            }

            if(cTime < 7)
            {
                if(p3.numba > 0)
                {
                    /*if(p3.personCheck == true)
                    {
                        person1.broken = 0;
                    } */

                    p3.numba = 0;
                }
                else
                {
                    //p3.setpos(-96, -32);
                    p3.nullify = true;
                }
                if(cTime < 2)
                {
                    if(p4.numba > 0)
                    {
                        /*if(p4.personCheck == true)
                        {
                            person1.broken = 0;
                        } */

                        p4.numba = 0;
                    }
                    else
                    {
                        //p4.setpos(-96, -32);
                        p4.nullify = true;
                    }
                }
            }
        }
    }
                      //Collision code for platforms, as well as code that removes them should they move offscreen

    if(upSpeed < 0)
    {
        upSpeed = 0;
    }
    p1.collision(posX, posY);
    p2.collision(posX, posY);
    p3.collision(posX, posY);
    p4.collision(posX, posY);
    p5.collision(posX, posY);
    if(p1.ply > 480)
    {
        p1.smash(false);
    }
    if(p2.ply > 480)
    {
        p2.smash(false);
    }
    if(p3.ply > 480)
    {
        p3.smash(false);
    }
    if(p4.ply > 480)
    {
        p4.smash(false);
    }
    if(p5.ply > 480)
    {
        p5.smash(false);
    }
    //Gravity adjusters for platforms, as well as offset adjusters
    if(platformGravity > 0)
    {
        p1.sety(p1.ply + platformGravity);
        p2.sety(p2.ply + platformGravity);
        p3.sety(p3.ply + platformGravity);
        p4.sety(p4.ply + platformGravity);
        p5.sety(p5.ply + platformGravity);
        if(person1.broken == 1)
        {
            person1.persy += platformGravity;

        }

        if( offset > 80)
        {
            offset -= platformGravity;
        }
    }

    if(person1.broken == 0)
    {
        person1.fall();
    }

    if(endManic)
    {
        //ends game loop so that depressive phase can take over.
        //Be sure to play transition before doing this.
        setTimeout( clearInterval(Game._intervalId), 1000);
    }

}




function keyDownListener(e)
{
    //w and up
    if(e.keyCode == 87 || e.keyCode == 38)
    {
        //this is solely for testing jumping since we lack platforms currently.
        upSpeed += jumpStrength;
        velocity = -upSpeed;
        upKeyDown = true;
    }
    //d and right
    if((e.keyCode == 68 || e.keyCode == 39))
    {
        rightKeyDown = true;
        if(playerSpeed < 0)
        {
           // playerSpeed = maxPlayerSpeed
          //  playerSpeed ++;
			if(cTime > 40)
			{
            	playerSpeed = 0;
			}
			else if(cTime > 30)
			{
				playerSpeed += 2;
			}
			else if(cTime > 10)
			{
				playerSpeed++;
			}
			else
			{
				playerSpeed = maxPlayerSpeed;
			}
        }
        else
        {
		//	if(cTime >= 50)
		//	{
		//		playerSpeed = 1;
		//	}
		//	else if(cTime >= 40)
		//	{
		//		playerSpeed = 2;
		//	}
			if(cTime >= 30)
			{
				if(playerSpeed >= 3)
				{
					playerSpeed++;
				}
				else
				{
					playerSpeed = 3;
				}
			}
			else if(cTime >= 20)
			{
				if(playerSpeed >= 4)
				{
					playerSpeed++;
				}
				else
				{
					playerSpeed = 4;
				}
			}
			else if(cTime >= 10)
			{
				if(playerSpeed >= 5)
				{
					playerSpeed++;
				}
				else
				{
					playerSpeed = 5;
				}
			}
			else
			{
            	playerSpeed = maxPlayerSpeed;
			}
        }
        if(playerSpeed > maxPlayerSpeed)
        {
            playerSpeed = maxPlayerSpeed;
        }
    }
    //a and left
    else if((e.keyCode == 65 || e.keyCode == 37))
    {
        leftKeyDown = true;
        if(playerSpeed > 0)
        {
            //playerSpeed = -maxPlayerSpeed;
			if(cTime > 40)
			{
            	playerSpeed = 0;
			}
			else if(cTime > 30)
			{
				playerSpeed -= 2;
			}
			else if(cTime > 10)
			{
				playerSpeed --;
			}
			else
			{
				playerSpeed = -maxPlayerSpeed;
			}
        }
        else
        {
		//	if(cTime >= 50)
		//	{
		//		playerSpeed = -1;
		//	}
		//	else if(cTime >= 40)
		//	{
		//		playerSpeed = -2;
		//	}
			if(cTime >= 30)
			{
				if(playerSpeed <= 3)
				{
					playerSpeed--;
				}
				else
				{
					playerSpeed = -3;
				}
			}
			else if(cTime >= 20)
			{
				if(playerSpeed <= 4)
				{
					playerSpeed--;
				}
				else
				{
					playerSpeed = -4;
				}
			}
			else if(cTime >= 10)
			{
				if(playerSpeed <= 5)
				{
					playerSpeed--;
				}
				else
				{
					playerSpeed = -5;
				}
			}
			else
			{
            	playerSpeed = -maxPlayerSpeed;
			}
        }
        if(playerSpeed < -maxPlayerSpeed)
        {
            playerSpeed = -maxPlayerSpeed;
        }
    }
}

function keyUpListener(e)
{
    //w and up
    if(e.keyCode == 87 || 38)
    {
        upKeyDown = false;
    }
    //d and right
    if((e.keyCode == 68 || e.keyCode == 39))
    {
       rightKeyDown = false;
    }
    //a and left
    else if((e.keyCode == 65 || e.keyCode == 37))
    {
       leftKeyDown = false;
    }
}

//easy multidimensional array creation for pixelArray
function createArray(length)
{
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1)
    {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function frame()
{
    bp1.frame ++;
    bp2.frame ++;
    playerImgFrame ++;
    if(playerImgFrame >= 14)
    {
        playerImgFrame = 1;
    }
}

Game._intervalId = setInterval(Game.run,1000/Game.fps);
Game._timerIntervalId = setInterval(Game.timerTick, 1000);
Game._aniFrame = setInterval(Game.run,1000/24);

