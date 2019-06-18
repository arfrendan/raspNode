var util = require('util');
var bleno = require('bleno');
var UUID = require('./UUID')

var BlenoPrimaryService = bleno.PrimaryService;
var uuid = guid4();
//var BatteryLevelCharacteristic = require('./battery-level-characteristic');
//var LogoutCharacteristic = require('./logout-characteristic');

//var SubscribeCharacteristic = require('./subscribe-characteristic');
var MerchandiseListCharacteristic = require('./merchandise-list-characteristic')
var MerchandiseWriteCharacteristic = require('./merchandise-write-characteristic')
var BluetoothSubscribeCharacteristic = require('./bluetooth-subscribe-characteristic')
var PrinterCharacteristic = require('./printer-characteristic')
var TTSCharacteristic  = require('./text-to-speech-characteristic')

var uuidr = guid4()
function BarcodeScannerService() {
  BarcodeScannerService.super_.call(this, {
      uuid: guid4(),
      characteristics: [
          
          new BluetoothSubscribeCharacteristic(),
          new MerchandiseListCharacteristic(),
          new MerchandiseWriteCharacteristic(),
          new PrinterCharacteristic(),
          new TTSCharacteristic()
      ]
  });
}

util.inherits(BarcodeScannerService, BlenoPrimaryService);

function guid4(){
		return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g,function(c){
			let r = Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8)
			return v.toString(16);
			})
}
module.exports = BarcodeScannerService;

