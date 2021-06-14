import { SetupServer } from './server';
import config from 'config';
import logger from './logger';

enum ExitStatus {
    Failure = 1,
    Success = 0,
}

(async (): Promise<void> => {
    try {
        const server = new SetupServer(config.get('App.port'));
        await server.init();
        server.start();
    } catch (error) {
        logger.error(`App exited with error: ${error}`); //se tiver algum problema na inicializaçao da aplicação vou desligar a app
        process.exit(ExitStatus.Failure);
    }

})();