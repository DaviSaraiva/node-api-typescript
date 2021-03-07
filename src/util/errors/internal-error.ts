//erro que não serão apresentados ao cliente, erros internos
//não precisa propagar ao usuario
export class InternalError extends Error {
  constructor(
    public message: string,
    protected code: number = 500,
    protected description?: string
  ) {
    super(message);
    //debugar vai ver o nome certo
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    //se estora um erro a classe não vai aparecer
  }
}
