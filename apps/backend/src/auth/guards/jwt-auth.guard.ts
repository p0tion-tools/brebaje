import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JWT_SECRET } from '../../utils/constants';
import { User } from 'src/users/user.model';

/**
 * Interface for JWT payload structure.
 */
interface JwtPayload {
  user: User;
  iat: number;
  exp: number;
}

/**
 * Custom request interface that includes the authenticated user.
 */
export interface AuthenticatedRequest extends Request {
  user: User;
}

/**
 * JWT authentication guard that validates JWT tokens and attaches user to request.
 *
 * Extracts the JWT token from the Authorization header, verifies it,
 * and attaches the user object to the request for use in controllers.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  /**
   * Validates the JWT token and attaches user to request.
   *
   * @param context - The execution context containing request information
   * @returns True if authentication is valid, throws UnauthorizedException otherwise
   * @throws UnauthorizedException If token is missing or invalid
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: JWT_SECRET,
      });

      // Attach user to request object
      request.user = payload.user;
    } catch (error) {
      console.error('JWT verification error:', (error as Error).message);
      throw new UnauthorizedException('Invalid or expired authentication token');
    }

    return true;
  }

  /**
   * Extracts the JWT token from the Authorization header.
   *
   * @param request - The HTTP request object
   * @returns The JWT token string or undefined if not found
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
