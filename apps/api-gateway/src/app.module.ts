import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE_RABBITMQ } from './auth/consts';

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
    AuthModule,
    ClientsModule.register([
      {
        name: AUTH_SERVICE_RABBITMQ,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@localhost:5672'],
          queue: 'auth_queue',
          queueOptions: {
            durable: true,
          },
        },
      }
    ])
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
