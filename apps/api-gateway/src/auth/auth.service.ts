import { Inject, Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/auth.dto';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE_RABBITMQ } from './consts';

@Injectable()
export class AuthService {

  constructor(
    @Inject(AUTH_SERVICE_RABBITMQ) private readonly client: ClientProxy
  ) {
   }

  login(loginDto: LoginDTO) {
    this.client.emit('login', loginDto);
    return { message: 'Login request sent' };
  }
}
