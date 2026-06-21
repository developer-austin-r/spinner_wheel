import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { SpinnerModule } from './spinner/spinner.module';
import { Role, SelectedSpinnerValue, Spinner, SpinnerAmount, SpinnerColor, User } from './database/entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.getOrThrow<string>('DATABASE_URL'),
        entities: [Role, User, SpinnerAmount, SpinnerColor, Spinner, SelectedSpinnerValue],
        synchronize: false,
        logging: config.get<string>('TYPEORM_LOGGING') === 'true',
      }),
    }),
    AuthModule,
    UserModule,
    RoleModule,
    SpinnerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
