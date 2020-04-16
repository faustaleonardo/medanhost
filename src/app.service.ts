import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello. This API is created by fausta leonardo.';
  }
}
