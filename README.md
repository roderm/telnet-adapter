# Telnet-Adapter for [Mozilla-Gateway](https://github.com/mozilla-iot/gateway)

## Install
you need a running mozilla-iot gateway

### Over UI
- *TODO*

### Manual
- clone this repo to $HOME/.mozilla-iot/addons/
- install with ```npm install```
- restart your gateway

### Config Devices
- Create a JSON-File like [pioneer_vsx-930.json](https://github.com/roderm/telnet-adapter-commandsets/blob/master/pioneer_vsx-930.json)
- Upload your json to [Paste](https://pastebin.com/) or [GitHub](https://github.com/)
- create link for raw file (e.g: https://pastebin.com/raw/bGgp8Fis or https://raw.githubusercontent.com/roderm/telnet-adapter-commandsets/master/pioneer_vsx-930.json)
- On your Gateway UI go to >Settings>Addons>Telnet Configure
    - Host: IP of your device
    - Port: port of your device
    - commandset: link to your json-file
- Go to start page and add your device

## TODO
- Improve stability of telnet socket connection 
- Find a way to update JSON-Files with remove off old files
- Mozilla-Iot file-upload support for simpler setup and easier update
- More Datatypes
- RegexMatching to Config
