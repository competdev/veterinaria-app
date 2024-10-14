import {
    createParamDecorator,
    ExecutionContext,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
    (
        data: string | undefined,
        ctx: ExecutionContext // Contexto da requisição
    ) => {
        const request: Express.Request = ctx
            .switchToHttp() // Pegar o contexto HTTP
            .getRequest(); // Pegar a requisição
        // Se data for passado, retornar o valor do usuário
            if (data) {
            return request.user[data];
        }
        // Se não, retornar o usuário inteiro
        return request.user;
    },
);