const ctx = require('express-http-context');
const Sql = require('./sql');

class Context {

    static get sql() {
        return ctx.get('sql');
    }

    static middleware(app, sqlConfig) {
        this.sqlConfig = sqlConfig;
        let _this = this;

        app.use(ctx.middleware);
        app.use((req, res, next) => {
            ctx.set('sql', new Sql(_this.sqlConfig));
            next();
        });
    }
}

module.exports = Context;