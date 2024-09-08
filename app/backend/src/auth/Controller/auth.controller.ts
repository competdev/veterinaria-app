import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../Service';
import { CredentialsDTO, JWTResponseDTO } from '../DTO';
import { LocalAuthGuard, JWTAuthGuard } from '../Guards';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ){}

    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    public async login(@Request() req, @Body() userCredentials: CredentialsDTO): Promise<JWTResponseDTO>{
        try{
            const response = this.authService.login(req.user);
            return response
        }catch(err){
            throw err
        }
    }

    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard)
    @Get('refresh')
    public async refreshToken(@Request() req){
        try{
            const response = this.authService.refreshJWT(req.user);
            return response
        }catch(err){
            throw err
        }
    }

}
