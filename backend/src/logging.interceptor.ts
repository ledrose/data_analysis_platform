import { BadGatewayException, CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Response , Request} from 'express';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const { method, url } = req;
    const userAgent = req.get('user-agent') || '';
    const ip = req.ip;
    this.logger.log(`${res.statusCode} ${method} ${url} ${userAgent} ${ip}`);
    this.logger.debug(`Request body: ${JSON.stringify(req.body)}, Request params: ${JSON.stringify(req.params)}, Request query: ${JSON.stringify(req.query)}`);
    return next.handle()
      .pipe(
        tap({
            next: (resp) => this.logger.debug(`Response body: ${JSON.stringify(resp)}`),
            error: (err) => this.logger.error(`${method} ${url} ${userAgent} ${ip} ${err.message}`)
          })
      );
  }
}
