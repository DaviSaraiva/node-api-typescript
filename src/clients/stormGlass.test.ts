import { StormGlass } from '@src/clients/stormGlass';
describe('StormGlass client', () => {
  it('teste se retorna tudo normal do StormGlass do servico', async () => {
    const lat = -33.792726;
    const lon = 151.289824;

    const stormGlass = new StormGlass();
    const response = await stormGlass.fetchPoints(lat, lon);
    expect(response).toEqual({});
  });
});
