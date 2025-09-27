import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  create(loginDto: LoginDto) {
    return 'login: ' + JSON.stringify(loginDto);
  }

}
