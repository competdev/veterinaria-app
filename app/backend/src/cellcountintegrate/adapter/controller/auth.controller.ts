import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Post,
    Request,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../domain/service';
import { CredentialsDTO, JWTResponseDTO } from '../dto';
import { JwtGuard } from '../../../auth/guard';
import { LocalAuthGuard } from '../../../auth/guard/local.guard';
import { DI_AUTHSERVICE } from '../../../configs';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(
        @Inject(DI_AUTHSERVICE) private readonly authService: AuthService
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
    @UseGuards(JwtGuard)
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
