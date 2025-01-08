import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from './user.service';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async signIn(username: string, password: string) {
        const user = await this.usersService.findOne(username);
        if (!user || !await bcrypt.compare(password, user.passwordHash)) {
            throw new UnauthorizedException("Invalid credentials");
        }
        const payload = {sub: user.id, username: user.username}; 
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }

    async register(user: UserLoginDto) {
        const hash = await bcrypt.hash(user.password, 10);
        const userEntity = await this.usersService.findOne(user.username);
        if (userEntity) {
            throw new ConflictException
        }
        return {
            username: (await this.usersService.create(user.username, hash)).username
        };
    }
}
