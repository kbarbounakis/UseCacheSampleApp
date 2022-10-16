import express from 'express';
import cors from 'cors';
import path from 'path';
import {ExpressDataApplication, serviceRouter} from '@themost/express';
import { OutputCaching } from '@themost/cache/platform-server';

const clientCacheProfile = {
    location: 'client',
    duration: 60 * 60, // 1 hour
    varyByHeader: [
        'accept',
        'accept-encoding',
        'accept-language',
        'accept-profile'
    ],
    varyByParam: [
        '*' // use any query param
    ],
    varyByCallback: async (req) => {
        if (req.headers.authorization) {
            return `context=${MD5(req.headers.authorization).toString()}`
        }
        return null;
    } 
}

const serverAndClientCacheProfile = {
    location: 'client',
    duration: 60 * 60, // 1 hour
    varyByHeader: [
        'accept',
        'accept-encoding',
        'accept-language',
        'accept-profile'
    ],
    varyByParam: [
        '*' // use any query param
    ],
    varyByCallback: async (req) => {
        if (req.headers.authorization) {
            return `context=${MD5(req.headers.authorization).toString()}`
        }
        return null;
    } 
}

function getApplication() {
    // init app
    const app = express();
    // https://github.com/expressjs/cors#usage
    app.use(cors());
    
    const dataAppication = new ExpressDataApplication(path.resolve(__dirname, 'config'));
    app.set(ExpressDataApplication.name, dataAppication);

    app.use(dataAppication.middleware());

    // https://expressjs.com/en/guide/using-template-engines.html
    app.set('view engine', 'ejs');
    app.set('views', path.resolve(__dirname, 'views'));

    app.get('/', (req, res) => {
        return res.render('index');
    });
    app.use(OutputCaching.setup());
    app.use('/api/Products', OutputCaching.cache());
    app.use('/api/ActionStatusTypes', OutputCaching.cache(clientCacheProfile));
    app.use('/api/', serviceRouter);

    // and return
    return app;
}

export {
    getApplication
}