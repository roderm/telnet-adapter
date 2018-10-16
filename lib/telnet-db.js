'use-strict'

const { Database } = require('gateway-addon');

class TelnetDatabase extends Database {

    /**
     * Return CommandSetup-Json from Database
     * @param {string} path - url path from config
     * @returns {Promise(object, error)} 
     */
    getCommandSetup(path) {
        return new Promise((resolve, reject) => {
            this.open().then(() => {
                if (!this.conn) {
                    reject('Database not open');
                    return;
                }
                const key = `addons.${this.packageName}.commandset.${path}`;
                this.conn.get(
                    'SELECT value FROM settings WHERE key = ?',
                    [key],
                    (error, row) => {
                        if (error) {
                            reject(error);
                        } else if (!row) {
                            reject('Key not found');
                        } else {
                            const data = JSON.parse(row.value);
                            resolve(data);
                        }
                    }
                );
            }).catch(reject)
        });
    }

    /**
     * Return CommandSetup-Json from Database
     * @param {string} path - url path from config
     * @param {object} CommandSetup - Object of Commandsetup
     * @returns {Promise(undefined, error)} 
     */
    setCommandSetup(path, cmdSet) {
        return new Promise((resolve, reject) => {
            this.open().then(() => {
                if (!this.conn) {
                    reject('Database not open');
                    return;
                }

                const key = `addons.${this.packageName}.commandset.${path}`;
                this.conn.run(
                    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
                    [key, JSON.stringify(cmdSet)],
                    (error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    }
                );
            }).catch(reject)
        });
    }
    
    /**
     * Clear all commandset-files
     */
    clear() {
        return new Promise((resolve, reject) => {
            this.open().then(() => {
                if (!this.conn) {
                    reject('Database not open');
                    return;
                }
                const key = `addons.${this.packageName}.commandset.%`;
                this.conn.run('DELETE FROM settings WHERE key like ?',
                    [key],
                    (error) => {
                        if (error) {
                            reject(error)
                        } else {
                            resolve()
                        }
                    });
            })
        })
    }
}
module.exports = TelnetDatabase