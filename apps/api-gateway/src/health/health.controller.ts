import { Controller, Get } from '@nestjs/common';
import type { HealthResponse } from '@repo/types';

@Controller('health')
export class HealthController {
  @Get()
  ok(): HealthResponse {
    return { status: 'ok', uptime: process.uptime() };
  }
}
