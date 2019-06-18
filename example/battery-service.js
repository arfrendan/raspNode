var util = require('util');

var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var BatteryLevelCharacteristic = require('./battery-level-characteristic');
var LogoutCharacteristic = require('./logout-characteristic');
var SubscribeCharacteristic = require('./subscribe-characteristic');
var MerchandiseListCharacteristic = require('./merchandise-list-characteristic')
var MerchandiseWriteCharacteristic = require('./merchandise-write-characteristic')
function BatteryService() {
  BatteryService.super_.call(this, {
      uuid: '180F',
      characteristics: [
         // new BatteryLevelCharacteristic(),
          //new SubscribeCharacteristic(),
          new MerchandiseListCharacteristic(),
         // new MerchandiseWriteCharacteristic()
      ]
  });
}

util.inherits(BatteryService, BlenoPrimaryService);

module.exports = BatteryService;
