import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { BoatsModule } from './boats/boats.module';
import { TripsModule } from './trips/trips.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [UsersModule, BoatsModule, TripsModule, ReviewsModule],
})
export class AppModule {}
