
var util = require('util')
var bleno = require('bleno');
var BarcodeScannerService = require('./barcode-scanner-service')

var primaryService = new BarcodeScannerService();

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('rasp pi', [primaryService.uuid]);
    console.log(primaryService.uuid)
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('accept', function(clientAddress) {
  console.log('on -> accept, client: ' + clientAddress)
  bleno.updateRssi()
})

bleno.on('disconnect', function(clientAddress) {
  //bleno.stopAdvertising( );
  console.log('advertising stop')
  /*
  var BarcodeScannerService = require('./barcode-scanner-service')
  var newService = new BarcodeScannerService();
  bleno.setServices([newService], function(error){
      console.log('setServices: '  + (error ? 'error ' + error : 'success'));
    });
  bleno.startAdvertising('rasp pi', [newService.uuid]);
  console.log(newService.uuid)
  */ 
  console.log('on -> disconnect, client: ' + clientAddress)
})

/*
bleno.on('rssiUpdate', function(rssi) {
  console.log('on -> rssiUpdate: ' + rssi)
})

bleno.on('mtuChange', function(mtu) {
  console.log('on -> mtuChange: ' + mtu)
})
*/

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([primaryService], function(error){
      console.log('setServices: '  + (error ? 'error ' + error : 'success'));
    });
  }
})


bleno.on('advertisingStop', function() {
  console.log('on -> advertisingStop')
})
/*
bleno.on('servicesSet', function(error) {
  console.log('on -> servicesSet: ' + (error ? 'error ' + error : 'success'))
});
*/
