import { CUSTOM_VALIDATION } from '@src/models/user';
import { Response } from 'express';
import mongoose from 'mongoose';

//o que vai ser importado por padrão, ele vai ser uma classe abstrata
//lembrando que uma classe abstrata não pode implementar ela diretamente, no caso da um new nela, so posso extender. 
//Serve pra proteger minha implementação
export abstract class BaseCrontroller {
    protected sendCreateUpdateErrorResponse(res: Response, error: mongoose.Error.ValidationError | Error): void {
        if (error instanceof mongoose.Error.ValidationError) {
            const clientErros = this.handleClientErrors(error);
            res.status(clientErros.code).send({ code: clientErros.code, error: clientErros.error });
        } else {
            res.status(500).send({ code: 500, error: 'Internal Server Error' });
        }
    }
    private handleClientErrors(error: mongoose.Error.ValidationError): { code: number; error: string } {
        const duplicatedKindErrors = Object.values(error.errors).filter((err) => err.kind === CUSTOM_VALIDATION.DUPLICATED);
        if (duplicatedKindErrors.length) {
            return { code: 409, error: error.message };
        }
        return { code: 422, error: error.message };
    }
}