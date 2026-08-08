import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class HealthService implements OnModuleInit {
  private readonly logger = new Logger(HealthService.name);
  private intervalId: NodeJS.Timeout;

  onModuleInit() {
    // Start self-ping every 5 minutes to keep Render instance alive
    const FIVE_MINUTES = 5 * 60 * 1000;
    
    this.intervalId = setInterval(() => {
      this.selfPing();
    }, FIVE_MINUTES);

    this.logger.log('🔄 Self-ping scheduler started (every 5 minutes)');
  }

  private async selfPing() {
    try {
      const baseUrl = process.env.BACKEND_URL || 'http://localhost:4000';
      const response = await fetch(`${baseUrl}/health/ping`);
      
      if (response.ok) {
        this.logger.debug('✅ Self-ping successful');
      } else {
        this.logger.warn(`⚠️ Self-ping failed with status ${response.status}`);
      }
    } catch (error) {
      this.logger.error('❌ Self-ping error:', error.message);
    }
  }

  onModuleDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.logger.log('🛑 Self-ping scheduler stopped');
    }
  }
}
