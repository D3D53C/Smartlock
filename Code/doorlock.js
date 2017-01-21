#!/usr/bin/env node

//*** SMARTPHONE DOORLOCK ***//

// ************* PARAMETERS *************** //
// 
// Parameters: unlockedState and lockedState
// These parameters are in microseconds.
// The servo pulse determines the degree 
// at which the horn is positioned. In our
// case, we get about 100 degrees of rotation
// from 1ms-2.2ms pulse width. You will need
// to play with these settings to get it to
// work properly with your door lock
//
// Parameters: motorPin
// The GPIO pin the signal wire on your servo
// is connected to
//
// Parameters: buttonPin
// The GPIO pin the signal wire on your button
// is connected to. It is okay to have no button connected
//
// Parameters: ledPin
// The GPIO pin the signal wire on your led
// is connected to. It is okay to have no ledconnected
//
// Parameter: blynkToken
// The token which was generated for your blynk
// project
//
// **************************************** //
var unlockedState = 1000;
var lockedState = 2200;
var outState = <State>;
var inState = <State>;

var ServoPin1 = 14;
var ServoPin2 = <Pin>;
var buttonPin = 4;
var led1Pin = 17;
var led2Pin = <Pin>;

var blynkToken = 'blynk_token_here';

// *** Start code *** //

var locked = true

//Setup servo
var Gpio = require('pigpio').Gpio,
  motor1 = new Gpio(ServoPin1, {mode: Gpio.OUTPUT}),
  motor2 = new Gpio(ServoPin2, {mode: Gpio.OUTPUT}),
  button = new Gpio(buttonPin, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.FALLING_EDGE
  }),
  led1 = new Gpio(led1Pin, {mode: Gpio.OUTPUT});
  led2 = new Gpio(led2Pin, {mode: Gpio.OUTPUT});
  
//Setup blynk
var Blynk = require('blynk-library');
var blynk = new Blynk.Blynk(blynkToken);
var v0 = new blynk.VirtualPin(0);

console.log("locking door")
lockDoor()

button.on('interrupt', function (level) {
	console.log("level: " + level + " locked: " + locked)
	if (level == 0) {
		if (locked) {
			unlockDoor()
		} else {
			lockDoor()
		}
	}
});

v0.on('write', function(param) {
	console.log('V0:', param);
  	if (param[0] === '0') { //unlocked
  		unlockDoor()
  	} else if (param[0] === '1') { //locked
  		lockDoor()
  	} else {
  		blynk.notify("Door lock button was pressed with unknown parameter");
  	}
});

blynk.on('connect', function() { console.log("Blynk ready."); });
blynk.on('disconnect', function() { console.log("DISCONNECT"); });

function lockDoor() {
	boltin()
	motor1.servoWrite(lockedState);
	led1.digitalWrite(1);
	locked = true

	//notify
  	blynk.notify("Door has been locked!");
  	
  	//After 1.5 seconds, the door lock servo turns off to avoid stall current
  	setTimeout(function(){motor.servoWrite(0)}, 1500)
	boltout()
	}

function unlockDoor() {
	boltin()
	motor1.servoWrite(unlockedState);
	led1.digitalWrite(0);
	locked = false
	
	//notify
  	blynk.notify("Door has been unlocked!"); 

  	//After 1.5 seconds, the door lock servo turns off to avoid stall current
  	setTimeout(function(){motor.servoWrite(0)}, 1500)
	boltout(;
}
function boltout() {
	motor2.servoWrite(outState);
	led2.digitalWrite(0);
	
	}
	
function boltin() {
	motor2.servoWrite(inState);
	led2.digitalWrite(1)
}