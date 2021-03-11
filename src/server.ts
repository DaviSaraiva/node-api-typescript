import './util/module-alias';
import { Server } from '@overnightjs/core';
import { Application } from 'express';
import bodyParser from 'body-parser';
import { ForecastController } from './controllers/forecast';
import * as database from '@src/database';
import { BeachesController } from './controllers/beaches';

export class SetupServer extends Server {

  constructor(private port = 3000) {
    super();
  }


  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
    //iniciara aplicacao ja liga o banco
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.setupControllers();
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    this.addControllers([forecastController, beachesController]);
  }
  public getApp(): Application {
    return this.app;
  }
  private async databaseSetup(): Promise<void> {
    await database.connect();
  }
  public async close(): Promise<void> {
    await database.close();
  }


}
