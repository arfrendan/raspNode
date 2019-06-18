var util = require('util');
var os = require('os');
var exec = require('child_process').exec;

var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var LogoutCharacteristic = function() {
  LogoutCharacteristic.super_.call(this, {
    uuid: '2A20',
    properties: ['writeWithoutResponse'],
    descriptors: [
      new Descriptor({
        uuid: '2909',
        value: 'logging into text'
      }),
    ]
  });
};

util.inherits(LogoutCharacteristic, Characteristic);

LogoutCharacteristic.prototype.onWriteRequest = function(data,offset,withoutResponse, callback) {
    console.log("write success");
    callback(this.RESULT_SUCCESS);
};

module.exports = LogoutCharacteristic
