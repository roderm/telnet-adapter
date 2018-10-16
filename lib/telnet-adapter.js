'use strict';

const {Adapter, Database} = require('gateway-addon');
const TelnetDevice = require('./telnet-device')

class TelnetAdapter extends Adapter {
    /**
   * Initialize the object.
   *
   * @param {Object} addonManager - AddonManagerProxy object
   * @param {Object} manifest - Package manifest
   * @param {function(string, string)} errorCallback - returns an error 
   }}
   */
  constructor(addonManager, manifest, errorCallback) {
    super(addonManager, manifest.name, manifest.name);
    addonManager.addAdapter(this);
    this.logErr = errorCallback;
    this.initDevices(manifest.moziot.config.HostSetup)
  }

  initDevices(arrConfs){
    for(const conf of arrConfs){
        let device = new TelnetDevice(this, conf);
        device.connect().then(() => {
          this.handleDeviceAdded(device);
        }).catch((e) => {
          this.logErr(e)
        })
      }
  }
}

module.exports = TelnetAdapter;