import { getApplication } from '../src/index';
import request from 'supertest';
import { DataCacheStrategy } from '@themost/cache';
import { ExpressDataApplication } from '@themost/express';
describe('app', () => {
    /**
     * @type {import('express').Application}
     */
    let app;
    beforeAll(async () => {
        app = getApplication();
    });
    afterAll(async () => {
        /**
         * @type {ExpressDataApplication}
         */
        const dataApplication = app.get(ExpressDataApplication);
        if (dataApplication) {
            await dataApplication.getConfiguration().getStrategy(DataCacheStrategy).finalize();
        }
    });
    it('should get index', async () => {
        const response = await request(app).get('/');
        expect(response.status).toEqual(200);
    });
    
});