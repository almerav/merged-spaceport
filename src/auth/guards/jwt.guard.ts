import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Marks this class as injectable for dependency injection
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Checks if the request is allowed to proceed
  canActivate(context: ExecutionContext) {
    return super.canActivate(context); // Calls parent class method
  }

  // Handles request after JWT validation
  handleRequest(err, user) {
    // Throws error or unauthorized exception if no valid user
    if (err || !user) {
      throw err || new UnauthorizedException('Unauthorized access');
    }
    return user; // Returns authenticated user
  }
}
