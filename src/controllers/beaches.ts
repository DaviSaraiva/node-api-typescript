import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import logger from '@src/logger';
import { authMiddleware } from '@src/middlewares/auth';
import { Beach } from '@src/models/beach';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

//essa rota toda precisa de token

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachesController {
    @Post('')
    public async create(req: Request, res: Response): Promise<void> {
        try {
            const beach = new Beach({ ...req.body, ...{ user: req.decoded?.id } });//setando user quando cria uma praia
            const result = await beach.save();
            res.status(201).send(result);
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                //se for erro do mongoose
                res.status(422).send({ error: error.message });
            } else {
                res.status(500).send({ error: 'Internal Server Error' });
            }
        }
    }
}
