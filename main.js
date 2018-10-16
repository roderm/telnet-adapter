'use strict';

const TelnetAdapter = require('./lib/telnet-adapter');

module.exports = function(adapterManager, manifest, errorCallback) {
  new TelnetAdapter(adapterManager, manifest, errorCallback);
};