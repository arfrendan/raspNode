var util = require('util');
var os = require('os');
var exec = require('child_process').exec;
var zbar = require('zbar')
var bleno = require('bleno');
const execSync = require('child_process').execSync

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;
zbar = new zbar('/dev/video0')

	let command = execSync('ls |grep dbr')
	let commandString = command.toString()




var BatteryLevelCharacteristic = function() {
  BatteryLevelCharacteristic.super_.call(this, {
    uuid: '2A19',
    properties: ['read'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: 'read your info'
      }),
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x04, 0x01, 0x27, 0xAD, 0x01, 0x00, 0x00 ]) // maybe 12 0xC unsigned 8 bit
      }),
      new Descriptor({
        uuid: '2204',
        value: 'aasds'
      })
    ]
  });
};

util.inherits(BatteryLevelCharacteristic, Characteristic);

BatteryLevelCharacteristic.prototype.onReadRequest = function(offset, callback) {
   exec('',function(err,stdout,stderr){
     var data = "123";
     //console.log(data)
     callback(this.RESULT_SUCCESS,new Buffer([data]));
     
     })
  
};

module.exports = BatteryLevelCharacteristic
