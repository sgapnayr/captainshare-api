import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { BoatsModule } from './boats/boats.module';
import { TripsModule } from './trips/trips.module';

@Module({
  imports: [UsersModule, BoatsModule, TripsModule],
})
export class AppModule {}
