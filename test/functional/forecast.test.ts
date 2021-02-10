import supertest from 'supertest';

//bloco de teste
describe('Beach forecast functional test',()=>{
    it('should return a forecast with just a few times', async()=>{
        const { body, status } = await supertest(app).get('/forecast');
        expect(status).toBe(200);
        expect(body).toBe(expect)
    })
});