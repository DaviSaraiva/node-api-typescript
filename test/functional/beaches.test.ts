import { Beach } from "@src/models/beach";
import { User } from "@src/models/user";
import AuthService from "@src/services/auth";

describe('Beaches funcitional tests', () => {
    const defaultUser = {
        name: 'John Doe',
        email: 'john2@mail.com',
        password: '1234',
    }

    //deletar todas as praias e usuarios que tiver no banco, e criar um usuario com o defalutuser gerando um token
    // legal que com o cod modular a gente pode importa meus serviçoes em qualquer lugar e qualquer um e usar individualmente 
    let token: string;
    beforeEach(async () => {
        await Beach.deleteMany({});
        await User.deleteMany({});
        const user = await new User(defaultUser).save();
        token = AuthService.generateToken(user.toJSON());
    });
    describe('When create beach', () => {     //criar praia vai ser uma operacao e vai ter um grupo especifico
        it('should create a beach with success', async () => {
            const newBeach = {
                lat: -33.792726,
                lng: 151.289824,
                name: 'Manly',
                position: 'E',
            };
            //metodo post pra criar uma praia nova
            const response = await global.testRequest.post('/beaches')
                .set({ 'x-access-token': token })
                .send(newBeach);
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
            const response = await global.testRequest.post('/beaches').set({ 'x-access-token': token }).send(newBeach);

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