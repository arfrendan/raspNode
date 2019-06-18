var util =require('util');
var os =require('os');
var exec = require('child_process').exec;
var readline = require('readline');
var fs = require('fs');
var UUID = require('./UUID')
var bleno = require('bleno');
var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

let uuid = guid4();
var rl = readline.createInterface(
{   input : process.stdin,
    output : process.stdout
});


var BluetoothSubscribeCharacteristic = function(){
	BluetoothSubscribeCharacteristic.super_.call(this,{
		uuid: uuid ,
		properties:['notify','write'],
		descriptors:[
			new Descriptor({
				uuid: '2901',
				value: 'subscribe on device'
			})
		]			
	});
} ;

util.inherits(BluetoothSubscribeCharacteristic,Characteristic);

BluetoothSubscribeCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback){
	console.log("Device subscribed");
    updateValueCallback(new Buffer("ready for barcode scanning!"));
    
    
	rl.on('line',function(line){
         let code = line
         console.log("the barcode is: " + code)
         updateValueCallback(new Buffer("code: " + (code? code : "")+'\n'));
                                
         fs.appendFile("input.txt",line+';',function(err){
			if(err){ return console.error(err)}
         })
	 
         fs.readFile("input.txt",function(err,data){
			if(err){ return console.error(err)}
			console.log("infile: " +data.toString())
         })
	 exec('python3 /home/pi/printerTest.py  --command '+code,function(err,stdout,stderr){
                        if(stdout.length>1){console.log(stdout)}
                        if(err){console.info(stderr)}
          })
         if(line.trim() == 'close'){ 
			rl.close(); 
         }
         if(line.trim() == 'clear'){ 
			fs.unlink('input.txt',function(err){
				if(err){
					console.err(err)
				}
			})
			fs.writeFile('input.txt','',function(err){
				if(err){
					console.err(err)
				}
			})
         }                       
     })	
      
      
}

BluetoothSubscribeCharacteristic.prototype.onUnsubscribe = function() {
          console.log("Device unsubscribed");
          clearInterval(this.intervalId);
}
/*
BluetoothSubscribeCharacteristic.prototype.onNotify = function(){
		console.log("Device on notify");
}
*/
function guid4(){
		return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g,function(c){
			let r = Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8)
			return v.toString(16);
			})
}

module.exports = BluetoothSubscribeCharacteristic;
