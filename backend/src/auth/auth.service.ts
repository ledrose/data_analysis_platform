import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async signIn(username: string, passHash: string) {
        const user = await this.usersService.findOne(username);
        if (!user || !await bcrypt.compare(passHash, user.password)) {
            throw new UnauthorizedException();
        }
        const payload = {sub: user.id, username: user.username}; 
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }


}
