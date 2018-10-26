'use-strict'


const net = require('net')
const events = require('events')
const { Observer, Subject, fromEvent } = require('rxjs');
const { filter, map } = require('rxjs/operators');

const LFCR = '\r\n';

class Queue {
    constructor(_timeout) {
        this.timeout = _timeout;
        this.queue = new Array();
    }
    _sleep(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
    next() {
        return new Promise((resolve, reject) => {
            let wait_next = async () => {
                let next
                do {
                    await (this._sleep(this.timeout))
                    next = this.queue.pop()
                } while (!next)
                resolve(next)
            }
            wait_next();
        })
    }
    push(val) {
        this.queue.push(val)
    }
}

class TelnetClient extends events.EventEmitter {
    constructor(params) {
        super()
        this.setMaxListeners(0)
        this.socket = null;
        this.DataStream = new Subject()
        this.params = params;
        this.params.timeout = parseInt(this.params.timeout) ? parseInt(this.params.timeout) : 1000 * 60
        this.reconnectTry = null;
        this.CmdQueue = new Queue(500);
        this._solveWrite();
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
                this.socket
                    .setNoDelay(true)
                    .setKeepAlive(true, 1000 * 2)

                this.emit('connect')
                this.reconnectTry = null;
                resolve();
            })
            fromEvent(this.socket, 'data')
                .pipe(map((chunk) => chunk.toString().trim()))
                .pipe(filter((cmd) => typeof cmd != 'undefined'))
                .pipe(filter((cmd) => cmd.length > 0))
                .subscribe((val) => this.DataStream.next(val))


            this.socket.on('error', error => {
                this.emit('error', error)
                this._tryReconnect()
            })

            this.socket.on('end', () => {
                this.emit('end')
                this._tryReconnect()
            })

            this.socket.on('close', () => {
                this.emit('close')
                this._tryReconnect()
            })
        })
    }

    write(command) {
        this.CmdQueue.push((_continue) => {
            let write_fn = async () => {
                while (this.reconnectTry != null) {
                    await new Promise(resolve => setTimeout(resolve, this.params.timeout));
                }
                this.socket.write(command + LFCR);
                _continue();

            }
            write_fn()
        })
    }
    _solveWrite(){
        this.CmdQueue.next()
            .then((fn) => (fn(this._solveWrite.bind(this))))
    }
    close() {
        this.socket.close();
        setTimeout(() => {
            clearTimeout(this.reconnectTry)
        }, 10)
    }
    _tryReconnect() {
        clearTimeout(this.reconnectTry)
        this.reconnectTry = setTimeout(() => {
            console.log("Try reconnecting...")
            this.connect()
                .then(
                    this.emit('reconnected')
                )
                .catch(
                    () => {
                        this._tryReconnect()
                    }
                )
        }
            , this.params.timeout);
    }
}

class TelnetService {
    constructor(params) {
        this.conn = new TelnetClient(params);
        this.receiver = new Subject()
    }
    connect() {
        return new Promise((resolve, reject) => {
            this.conn.connect().then(() => {
                let bla = new Subject
                this.conn.DataStream
                    /**
                     * Map to object: {command, value, placeholder}
                     */
                    .pipe(map((cmd) => {
                        try {
                            // TODO: Move to a config
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
                        // Remove values which failed in regex 
                        // TODO: Log into file
                        if (update.error) {
                            return false
                        } else {
                            return true;
                        }
                    })).subscribe(this.receiver)

                this.conn.on('reconnected', () => {
                    console.log('reconnected')
                })
                this.conn.on('error', err => {
                    console.log('error:', err)
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
        // TODO: move to a config
        let r = /(#{1,})/g
        let res = r.exec(command)
        let i = res[1].length - value.toString().length
        if (i < 0) {
            console.log("Set value overload", command, value)
            i = 0
        }
        let exec = command.replace(r, '0'.repeat(i) + value.toString())
        this.sendRaw(exec)
    }
    Observe(command) {
        return this.receiver.pipe(filter(cmd => cmd.placeholder == command))
    }
    unload() {
        this.conn.unload()
    }
}

module.exports = TelnetService;