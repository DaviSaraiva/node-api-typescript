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

export interface TimeForcast {
    time: string;
    forecast: BeachForecast[];
}

//extender mas omitir campo user da interface
export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint { }

export class Forecast {
    constructor(protected stormGlass = new StormGlass()) { }
    public async processForecastForBeaches(beaches: Beach[]): Promise<TimeForcast[]> {
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
        return this.mapForecastByTime(pointsWithCorrectSources);
    }
    private mapForecastByTime(forecast: BeachForecast[]): TimeForcast[] {
        //Função: O mapForecastByTime vai agrupar os itens da lista pela data/hora (timePoint). Imagine que recebemos da API um array com vários itens fora de ordem e muitos deles com a mesma data/hora. Neste método nós vamos juntar todos com a mesma data e hora.
        //Expplicação:  Na primeira iteração do loop o find não vai encontrar nada pois o array ainda está no seu estado inicial (vazio), o teste de conteúdo do timePoint será falso (if (timePoint)) e, sendo assim, vai criar uma nova entrada para aquela data/hora
        //Explicção: Nas demais iterações o teste to timePoint tem chance de ser verdadeiro ou falso. Sendo verdadeiro o ponto será apenas adicionado à entrada com a mesma data/hora.
        const forecastByTime: TimeForcast[] = [];
        for (const point of forecast) {
            const timePoint = forecastByTime.find((f) => f.time === point.time);
            if (timePoint) {
                //se ja existe uma naquela hora so puxa pra lista 
                timePoint.forecast.push(point);
            } else {
                //se não cria uma lista nova
                forecastByTime.push({
                    time: point.time,
                    forecast: [point]
                })
            }
        }
        return forecastByTime;
    }
}