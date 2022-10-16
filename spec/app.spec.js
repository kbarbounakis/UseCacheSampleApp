import { getApplication } from '../src/index';
import request from 'supertest';
import { DataCacheStrategy } from '@themost/cache';
describe('app', () => {
    /**
     * @type {import('express').Application}
     */
    let app;
    beforeAll(async () => {
        app = getApplication();
    });
    afterAll(async () => {
        const cacheStrategy = app.get(DataCacheStrategy);
        if (cacheStrategy) {
            await cacheStrategy.finalize();
        }
    });
    it('should get index', async () => {
        const response = await request(app).get('/');
        expect(response.status).toEqual(200);
    });
    
});