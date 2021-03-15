import { StormGlass, ForecastPoint } from '@src/clients/stormGlass';
import { Beach } from '@src/models/beach';
import { InternalError } from '@src/util/errors/internal-error';


//extender mas omitir campo user da interface
export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint { }

export interface TimeForecast {
    time: string;
    forecast: BeachForecast[];
}

export class ForecastProcessingInternalError extends InternalError {
    constructor(message: string) {
        super(`Erro inesperado durante o processamento da previsão: ${message}`);
    }
}

export class Forecast {
    constructor(protected stormGlass = new StormGlass()) { }

    public async processForecastForBeaches(
        beaches: Beach[]
    ): Promise<TimeForecast[]> {
        const pointsWithCorrectSources: BeachForecast[] = [];
        try {
            //para cada uma das praias, loop para a geente conseguir pegar o forecast usando lat e lng
            for (const beach of beaches) {
                const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
                const enrichedBeachData = this.enrichBeachData(points, beach);
                pointsWithCorrectSources.push(...enrichedBeachData);
            }
            return this.mapForecastByTime(pointsWithCorrectSources);
        } catch (error) {
            throw new ForecastProcessingInternalError(error.message);
        }
    }

    private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
        //Função: O mapForecastByTime vai agrupar os itens da lista pela data/hora (timePoint). Imagine que recebemos da API um array com vários itens fora de ordem e muitos deles com a mesma data/hora. Neste método nós vamos juntar todos com a mesma data e hora.
        //Expplicação:  Na primeira iteração do loop o find não vai encontrar nada pois o array ainda está no seu estado inicial (vazio), o teste de conteúdo do timePoint será falso (if (timePoint)) e, sendo assim, vai criar uma nova entrada para aquela data/hora
        //Explicção: Nas demais iterações o teste to timePoint tem chance de ser verdadeiro ou falso. Sendo verdadeiro o ponto será apenas adicionado à entrada com a mesma data/hora.
        const forecastByTime: TimeForecast[] = [];
        for (const point of forecast) {
            const timePoint = forecastByTime.find((f) => f.time === point.time);
            if (timePoint) {
                //se ja existe uma naquela hora so puxa pra lista 
                timePoint.forecast.push(point);
            } else {
                //se não cria uma lista nova
                forecastByTime.push({
                    time: point.time,
                    forecast: [point],
                });
            }
        }
        return forecastByTime;
    }

    private enrichBeachData(
        points: ForecastPoint[],
        beach: Beach
    ): BeachForecast[] {
        return points.map((e) => ({
            ...{},
            ...{
                lat: beach.lat,
                lng: beach.lng,
                name: beach.name,
                position: beach.position,
                rating: 1,
            },
            ...e,
        }));
    }
}