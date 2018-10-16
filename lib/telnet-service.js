'use-strict'


const net = require('net')
const events = require('events')
const { Observer, fromEvent } = require('rxjs');
const { filter, map } = require('rxjs/operators');

const LFCR = '\r\n';

class TelnetClient extends events.EventEmitter {
    constructor(params) {
        super()
        this.socket = null;
        this.DataStream
        this.params = params;
    }
    connect() {
        return new Promise((resolve, reject) => {
            const { host, port } = this.params;
            if (!host) reject("Host is not defined")
            if (!port) reject("Port is not defined")

            this.socket = net.createConnection({
                port,
                host
            }, () => {
                this.emit('connect')
                resolve();
            })
            this.DataStream = fromEvent(this.socket, 'data')
                .pipe(map((chunk) => chunk.toString().trim()))

            this.socket.on('error', error => {
                this.emit('error', error)
            })

            this.socket.on('end', () => {
                this.emit('end')
            })

            this.socket.on('close', () => {
                this.emit('close')
            })
        })
    }
    subscribe() {

    }
    write(command) {
        this.socket.write(command + LFCR);
    }
}

class TelnetService {
    constructor(params) {
        this.conn = new TelnetClient(params);
    }
    connect() {
        return new Promise((resolve, reject) => {
            this.conn.connect().then(() => {
                let filtred = this.conn.DataStream.pipe(
                    filter((val) => val.toString().trim().length > 0))
                this.receiver = filtred
                    .pipe(map((cmd) => {
                        try {
                            let rex = /(^[A-Z]+[\d]??[A-Z]+)([\d]{1,})/g
                            let res = rex.exec(cmd);
                            let retVal = {
                                name: res[1],
                                value: res[2],
                                placeholder: ""
                            };
                            retVal.placeholder = retVal["name"] + '#'.repeat(retVal.value.length)
                            return retVal;
                        } catch (e) {
                            return {
                                name: "",
                                value: "",
                                placeholder: "",
                                command: cmd,
                                error: e
                            }
                        }
                    }))
                    .pipe(filter((update) => {
                        if(update.error){
                            console.log("Removing received value:", update)
                            return false
                        }else{
                            return true;
                        }
                    }))

                this.conn.on('error', err => {
                    console.log(err)
                })
                this.conn.on('end', err => {
                    console.log("socket ended")
                })
                this.conn.on('close', err => {
                    console.log("socket closed")
                })
                resolve();
            }).catch(reject)
        })
    }
    sendRaw(command) {
        this.conn.write(command);
    }
    send(command, value) {
        let r = /(#{1,})/g
        let res = r.exec(command)
        let i = res[1].length - value.toString().length
        if (i < 0) {
            console.log("Set value overload", command, value)
            i = 0
        }
        let exec = command.replace(r, '0'.repeat(i) + value.toString())
        console.log("Sending command: ", exec)
        this.sendRaw(exec)
    }
    Observe(command) {
        return this.receiver.pipe(filter(cmd => cmd.placeholder == command))
    }
    _tryReconnect() {
        let that = this;
        setTimeout(() => {
            this.connect()
                .catch(
                    () => {
                        that.tryReconnect()
                    }
                )
        }
            , this.params.timeout);
    }
}

module.exports = TelnetService;