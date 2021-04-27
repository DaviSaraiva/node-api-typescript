import mongoose, { Document, Model, Schema } from "mongoose";

export enum BeachPosition {
    S = 'S',
    E = 'E',
    W = 'W',
    N = 'N',
}

export interface Beach {
    _id?: string;
    name: string;
    position: BeachPosition;
    lat: number;
    lng: number;
    user: string;
}

const schema = new mongoose.Schema(
    {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        name: { type: String, required: true },
        position: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, //linkar prai a usuarios, quando criar uma prai por padrão tem que ter um usuario linkado a ela 
    },
    {
        //metodo padrao do mongosse, quando a gnt transforma  esse dado em json modificado, 
        //ex: trasnforma o _id em id, deleta o_id padrão do mongose
        //obs: não vou remover do banco somente da trasnfomação final
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

interface BeachModel extends Omit<Beach, '_id'>, Document { }
export const Beach: Model<BeachModel> = mongoose.model('Beach', schema);

//extou definindo um tipo do documents do mongoose mais o meu Beach, no caso meus campos.
//depois criamos o model do mongoose. 