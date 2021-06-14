import { SetupServer } from './server';
import config from 'config';
import logger from './logger';

enum ExitStatus {
    Failure = 1,
    Success = 0,
}
process.on('unhandledRejection', (reason, promise) => {
    logger.error(
        `App saiu da promisse : ${promise} and reason : ${reason}`
    );
    throw reason;
});

process.on('uncaughtException', (error) => {
    logger.error(`App saiu execao : ${error}`);
    process.exit(ExitStatus.Failure);
});

(async (): Promise<void> => {
    try {
        const server = new SetupServer(config.get('App.port'));
        await server.init();
        server.start();

        //vamos escutar quando alguem der um desses comando na aplicação
        const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
        exitSignals.map((sig) => process.on(sig, async () => {
            try {
                await server.close();
                logger.info('App fechada com sucesso');
                process.exit(ExitStatus.Success);
            } catch (error) {
                logger.error(`App com error: ${error}`);
                process.exit(ExitStatus.Failure)
            }
        }))
    } catch (error) {
        logger.error(`App exited with error: ${error}`); //se tiver algum problema na inicializaçao da aplicação vou desligar a app
        process.exit(ExitStatus.Failure);
    }

})();