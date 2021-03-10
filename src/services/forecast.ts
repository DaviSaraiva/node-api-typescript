import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';

//isso tudo foi para chamar client pegar dados normalizados fazer manger deles e calcular o reight
//enum facilita a gente reusar os valores, não precisa mudar a string basta mudar o enum.  
export enum BeachPosition {
    S = 'S',
    E = 'E',
    W = 'W',
    N = 'N'
}

export interface Beach {
    name: string;
    position: BeachPosition;
    lat: number;
    lng: number;
    user: string;

}

//extender mas omitir campo user da interface
export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint { }

export class Forecast {
    constructor(protected stormGlass = new StormGlass()) { }
    public async processForecastForBeaches(beaches: Beach[]): Promise<BeachForecast[]> {
        const pointsWithCorrectSources: BeachForecast[] = [];
        //para cada uma das praias, loop para a geente conseguir pegar o forecast usando lat e lng
        for (const beach of beaches) {
            const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);

            //pegar os points e botar info sobre as praias e info sobre os with
            const enrichedBeachData = points.map((e) => ({
                //informacoes que vamos colocar da praia.
                ...{
                    lat: beach.lat,
                    lng: beach.lng,
                    name: beach.name,
                    position: beach.position,
                    rating: 1
                },
                ...e,
            }));
            //puxar isso pro array final
            //... prra botar todos no array, ficar todos no mesmo nivel
            pointsWithCorrectSources.push(...enrichedBeachData);
        }
        return pointsWithCorrectSources;
    }
}