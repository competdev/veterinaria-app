import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public apiPing(): string {
    return 'API Online';
  }
}
