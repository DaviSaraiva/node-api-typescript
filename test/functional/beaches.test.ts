import { Beach } from "@src/models/beach";

describe('Beaches funcitional tests', () => {
    //deletar todas as praias que tiver no banco, que o estado do teste estiver limpo quando a gente rodar
    beforeAll(async () => await Beach.deleteMany({}));

    //criar prai vai ser uma operacao e vai ter um grupo especifico
    describe('When create beach', () => {
        it('should create a beach with success', async () => {
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
        // a entidade não pode ser processada,erro de validacao
        it('should return 422 when there is a validation error', async () => {
            const newBeach = {
                lat: 'invalid_string',
                lng: 151.289824,
                name: 'Manly',
                position: 'E',
            };
            const response = await global.testRequest.post('/beaches').send(newBeach);

            expect(response.status).toBe(422);
            expect(response.body).toEqual({
                error:
                    'Beach validation failed: lat: Cast to Number failed for value "invalid_string" at path "lat"',
            });
        });
        it.skip('should return 500 when there is any error other than validation error', async () => {
            //TODO think in a way to throw a 500
        });
    });
});