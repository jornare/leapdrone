var Leap = require('leapjs').Leap;
var util = require('util');
var arDrone = require('ar-drone');
var drone = arDrone.createClient();
var stdin = process.openStdin();
require('tty').setRawMode(true);


drone.disableEmergency();
drone.takeoff();

stdin.on('keypress', function(chunk, key) {
	if(key && key.ctrl && key.name=='c') process.exit();
	drone.land();
});

Leap.loop( function(frame, done) {
	var hand = frame.hands[0];
	if(hand){
		util.print("\033[2J\033[0;0H");
		var x=hand.palmPosition[0],
			y =hand.palmPosition[1],
			z=hand.palmPosition[2];
		var pNx = hand.palmNormal[0],
			pNy = hand.palmNormal[1],
			pNz = hand.palmNormal[2];
		var pDxr = hand.direction[0],
			pDyr = hand.direction[1],
			pDzr = hand.direction[2];
		
		if(x<-50){
			if(x<-100){
				x=-100;
			}
			drone.counterClockwise(-x/100);
		}else if(x>50){
			if(x>100){
				x=100;
			}
			drone.clockwise(x/100);
		}else{
			drone.clockwise(0);
		}
		
		if(y<80){
			drone.land();
		}
		else if(y<250){
			console.log('down ' + y);
			var speed=(250-y)/200;
			drone.down(speed);
		}else if(y>320){
			console.log('up ' + y);
			var speed=(y-320)/200;
			drone.up(speed);
		}else{
			console.log('steady ' + y);
			drone.up(0);
		}
		
		if(pNx>0.3){
			console.log('left '+pNx);
			drone.left(pNx);
		}else if(pNx<-0.3){
			drone.right(-pNx);
			console.log('right '+pNx);
		}else{
			console.log('steady'+pNx);
			drone.left(0);
		}
		
		if(pNz>0.2){
			console.log('forward '+pNz);
			drone.front(pNz);
		}else if(pNz<-0.2){
			drone.back(-pNz);
			console.log('backward '+pNz);
		}else{
			console.log('steady'+pNz);
			drone.back(0);
		}		
		
		
		
		//console.log(hand);
		
		//console.log(hand.palmPosition[1]);
	}
	

	done();
});