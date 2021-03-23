import { User } from "@src/models/user";

describe('Users functional tests', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('When create a new user', () => {
        it('Should successfully create a new user', async () => {
            const newUser = {
                name: 'Jhon Doe',
                email: 'jhon@mail.com',
                password: '1234',
            };
            const response = await global.testRequest.post('/users').send(newUser);
            expect(response.status).toBe(201);//codigo http de create, siginifica que uma entidade foi criada no banco de dados
            expect(response.body).toEqual(expect.objectContaining(newUser));
        });
    });
});