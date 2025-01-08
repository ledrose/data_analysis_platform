import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';
import { Response, Request } from 'express';
import { time } from 'console';

@Catch()
export class GlobalExceptionFilter<T> implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception instanceof HttpException 
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const { method, url } = req;
    const userAgent = req.get('user-agent') || '';
    const ip = req.ip;

    this.logger.error(`${status} ${method} ${url} ${userAgent} ${ip}  ${JSON.stringify(exception)}`)
    this.logger.debug(`${exception['stack']}`)

    res
      .status(status)
      .json(exception['response'] && {
        ...exception['response'],
        timestamp: new Date().toISOString(),
        } || {
        statusCode: status,
        timestamp: new Date().toISOString(),
      });

  }
}
