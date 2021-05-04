const express = require('express');
const Gitea = require('./lib/gitea');

let gitea = new Gitea();

let app = express();

/**
 * @param {express.Request} req
 * @param {express.Response} _res
 * @param {express.NextFunction} next
 */
function getAuth(req, _res, next) {
    let token = req.headers?.authorization?.split(' ').pop();
    if (token) {
        gitea.setToken(token);
    }
    next();
}

app.use(express.json());

let api = express.Router();
app.use(getAuth);
app.use('/api/v3', api);

api.get('/user', async (_req, res, next) => {
    let data = await gitea.getUser();
    res.end(JSON.stringify(data));
    next();
});

api.get('/user/repos', async (req, res, next) => {
    //console.log('user repos. ',req.query);
    /** @type {any[]} */
    let data = await gitea.listRepos(req.query);

    // Patch repos
    data.forEach(x => {
        x.node_id = Buffer.from('010:Repository' + x.id.toString()).toString('base64');
        x.disabled = false;
    });
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
    next();
});

app.listen(9980, () => {});
