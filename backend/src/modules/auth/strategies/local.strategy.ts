import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      const user = await this.authService.validateUser(email, password);
      if (!user) {
        // DEMO MODE: More helpful error message
        if (process.env.DEMO_MODE === 'true') {
          throw new UnauthorizedException('Invalid credentials. Try: admin@demo.com / admin123');
        }
        throw new UnauthorizedException('Invalid email or password');
      }
      return user;
    } catch (error) {
      // Re-throw UnauthorizedException, but allow demo mode fallback
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // On other errors, still throw unauthorized (safe for demo)
      throw new UnauthorizedException('Authentication failed');
    }
  }
}

