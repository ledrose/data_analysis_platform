import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';


export const Auth = createParamDecorator(
    (data: string, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();
        return request["user"];
    }
    
)


