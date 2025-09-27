import { BadGatewayException, Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';

@Controller('api/auth')
export class GatewayAuthController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private getAuthUrl(path: string): string {
    const baseUrl = this.configService.get<string>('AUTH_BASE_URL');

    if (!baseUrl) {
      throw new Error('AUTH_BASE_URL is not defined');
    }

    return new URL(path, baseUrl).toString();
  }

  private async forwardToAuth(
    path: string,
    body: unknown,
  ): Promise<AxiosResponse<unknown>> {
    const url = this.getAuthUrl(path);

    try {
      return await lastValueFrom(
        this.httpService.post(url, body, { validateStatus: () => true }),
      );
    } catch {
      throw new BadGatewayException('Auth service request failed');
    }
  }

  @Post('register')
  async register(@Body() body: RegisterDTO, @Res() res: Response) {
    const response = await this.forwardToAuth('/register', body);

    return res.status(response.status).send(response.data);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginDTO, @Res() res: Response) {
    const response = await this.forwardToAuth('/login', body);

    return res.status(response.status).send(response.data);
  }
}
