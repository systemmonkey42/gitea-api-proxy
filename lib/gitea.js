const http = require('http');
const { stringify: queryToString } = require('querystring');

class Gitea {
    constructor() {
        this.prefix = 'http://10.0.0.4:3000/api/v1';
    }

    /** @param {string} token */
    setToken(token) {
        this.token = token;
    }

    /**
     * @param {string} method
     * @param {string} api
     * @param {any} params
     */
    request(method, api, params) {
        return new Promise((ok, _fail) => {
            switch (method.toUpperCase()) {
                case 'GET':
                    let qs = queryToString(params);
                    http.get(
                        this.prefix + api + '?' + qs,
                        {
                            headers : {
                                authorization : 'token ' + this.token,
                            },
                        },
                        res => {
                            /** @type {string[]} */
                            let body = [];
                            res.on('data', data => body.push(data.toString()));
                            res.on('end', () => {
                                /** @type {any} */
                                let records;
                                try {
                                    records = JSON.parse(body.join(''));
                                    ok(records);
                                } catch (e) {
                                    fail(e);
                                }
                            });
                        }
                    );
                    break;
                default:
                    console.trace('Unsupported API method.');
                    break;
            }
        });
    }

    /**
     * @param {any} [params]
     * @returns {Promise<any>}
     */
    getUser(params) {
        return this.request('GET', '/user', params ?? {});
    }

    /**
     * @param {any} params
     * @returns {Promise<any>}
     */
    listRepos(params) {
        return this.request('GET', '/user/repos', params);
    }
}

module.exports = Gitea;
