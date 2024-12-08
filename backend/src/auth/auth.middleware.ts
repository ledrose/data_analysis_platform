import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async use(req: Request, res: Response, next: () => void) {
    const token = this.extractTokenFromHeader(req);
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
    } finally {
      next();
    }
  }


  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
