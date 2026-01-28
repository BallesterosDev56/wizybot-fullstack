import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Returns API health status and version information
   */
  getApiStatus(): Record<string, string> {
    return {
      message: 'WizyBot API is running',
      version: '1.0.0',
      status: 'healthy',
      author: 'Daniel Ballesteros',
    };
  }
}
