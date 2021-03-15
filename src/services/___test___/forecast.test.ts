import { StormGlass } from '@src/clients/stormGlass';
import { Beach, BeachPosition } from '@src/models/beach';
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';
import { Forecast, ForecastProcessingInternalError } from '../forecast';

jest.mock('@src/clients/stormGlass');

describe('Forecast Service', () => {
    const mockedStormGlassService = new StormGlass as jest.Mocked<StormGlass>;
    it('deve retornar a previsão para uma lista de praias', async () => {
        mockedStormGlassService.fetchPoints.mockResolvedValue(stormGlassNormalizedResponseFixture);
        //criar aq uma praia pra teste
        const beaches: Beach[] = [
            {
                lat: -33.792726,
                lng: 151.289824,
                name: 'Manly',
                position: BeachPosition.E,
            },
        ];

        //cobinacao dos dados da praia com dados adicionais 
        const expectedResponse = [
            {
                time: '2020-04-26T00:00:00+00:00',
                forecast: [
                    {
                        lat: -33.792726,
                        lng: 151.289824,
                        name: 'Manly',
                        position: 'E',
                        rating: 1,
                        swellDirection: 64.26,
                        swellHeight: 0.15,
                        swellPeriod: 3.89,
                        time: '2020-04-26T00:00:00+00:00',
                        waveDirection: 231.38,
                        waveHeight: 0.47,
                        windDirection: 299.45,
                        windSpeed: 100,
                    },
                ],
            },
            {
                time: '2020-04-26T01:00:00+00:00',
                forecast: [
                    {
                        lat: -33.792726,
                        lng: 151.289824,
                        name: 'Manly',
                        position: 'E',
                        rating: 1,
                        swellDirection: 123.41,
                        swellHeight: 0.21,
                        swellPeriod: 3.67,
                        time: '2020-04-26T01:00:00+00:00',
                        waveDirection: 232.12,
                        waveHeight: 0.46,
                        windDirection: 310.48,
                        windSpeed: 100,
                    },
                ],
            },
            {
                time: '2020-04-26T02:00:00+00:00',
                forecast: [
                    {
                        lat: -33.792726,
                        lng: 151.289824,
                        name: 'Manly',
                        position: 'E',
                        rating: 1,
                        swellDirection: 182.56,
                        swellHeight: 0.28,
                        swellPeriod: 3.44,
                        time: '2020-04-26T02:00:00+00:00',
                        waveDirection: 232.86,
                        waveHeight: 0.46,
                        windDirection: 321.5,
                        windSpeed: 100,
                    },
                ],
            },
        ];

        //vai receber uma instancia do forecast
        const forecast = new Forecast(mockedStormGlassService);
        //vai recebr de volta a lista de praias
        const beachesWithRating = await forecast.processForecastForBeaches(beaches);
        expect(beachesWithRating).toEqual(expectedResponse);
    });
    //se o usuario não tem nehuma praia cadastrada ele deveria retornar uma lista vazia 
    it('deve retornar uma lista vazia quando a matriz de praias estiver vazia', async () => {
        const forecast = new Forecast();
        const response = await forecast.processForecastForBeaches([]);
        expect(response).toEqual([]);
    });
    it('deve lançar um erro de processamento interno quando algo der errado durante o processo de classificação', async () => {
        const beaches: Beach[] = [
            {
                lat: -33.792726,
                lng: 151.289824,
                name: 'Manly',
                position: BeachPosition.E
            },
        ];
        mockedStormGlassService.fetchPoints.mockRejectedValue('Erro fetching data');
        const forecast = new Forecast(mockedStormGlassService);
        await expect(forecast.processForecastForBeaches(beaches)).rejects.toThrow(ForecastProcessingInternalError);
    });
});