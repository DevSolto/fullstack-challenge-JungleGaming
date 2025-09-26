import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { HealthModule } from './health/health.module';

function msToSeconds(ms: number) {
  return Math.max(1, Math.floor(ms / 1000));
}
const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '1000', 10);
const limit = parseInt(process.env.RATE_LIMIT_MAX ?? '10', 10);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: msToSeconds(windowMs), limit }]),
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
