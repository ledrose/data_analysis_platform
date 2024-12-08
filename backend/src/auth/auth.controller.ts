import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signin(@Body() signInDto: UserLoginDto) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    register(@Body() user: UserLoginDto) {
        return this.authService.register(user);
    }
}
