var util = require('util');
var os = require('os');
var bleno = require('bleno');
var exec = require('child_process').exec;
var Characteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;


var SubscribeCharacteristic = function(){
	SubscribeCharacteristic.super_.call(
		this,{
				uuid: '2A19',
				properties: ['notify']
			
		}
	)
}
util.inherits(SubscribeCharacteristic, Characteristic);



SubscribeCharacteristic.prototype.onSubscribe = function(maxValueSize,updateValueCallback){
	console.log('subscribe success')
	
}

SubscribeCharacteristic.prototype.onUnsubscribe = function(){
	console.log('unsubscribe success')

}

SubscribeCharacteristic.prototype.onNotify = function(){
	console.log('subscribe success')
	
}
module.exports = SubscribeCharacteristic

