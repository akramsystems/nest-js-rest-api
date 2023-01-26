import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global() is a decorator that marks a module as a global module.
// making it available to all other modules in the application.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
