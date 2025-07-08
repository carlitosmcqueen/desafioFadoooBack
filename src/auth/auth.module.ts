import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class AuthModule {} 