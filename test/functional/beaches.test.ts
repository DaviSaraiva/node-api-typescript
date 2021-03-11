describe('Beaches funcitional tests', () => {
    //criar prai vai ser uma operacao e vai ter um grupo especifico
    describe('When create beach', () => {
        it('Should create a beach with sucess', async () => {
            const newBeach = {
                lat: -33.792726,
                lng: 151.289824,
                name: 'Manly',
                position: 'E',
            };
            //metodo post pra criar uma praia nova
            const response = await global.testRequest.post('/beaches').send(newBeach);
            expect(response.status).toBe(201);
            expect(response.body).toEqual(expect.objectContaining(newBeach));
        });
    });
});