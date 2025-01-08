import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async use(req: Request, res: Response, next: () => void) {
    const token = this.extractTokenFromHeader(req);
    if (this.configService.get<string>('IGNORE_AUTH')) {
      req["user"] = "regroe";
      next();
      return;
    }

    if (!token) {
      next();
      return;
    }
    try {
      const payload = await this.jwtService.verifyAsync(token,
        {
          secret: this.configService.get<string>('JWT_SECRET')
        }
      );
      req["user"] = payload.username;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return res.status(401).json({ message: 'Token expired', "statusCode": "401" });
      } else {
        return res.status(401).json({ message: 'Invalid token', "statusCode": "401" });
      }
    }
    next();
  }


  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
