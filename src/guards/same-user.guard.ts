import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class SameUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userIdFromToken = request.user.id; // Assuming user 'id' is stored in JWT token
    const paramId = request.params.id; // Get the 'id' param from request

    if (userIdFromToken !== +paramId) {
      // If token user 'id' doesn't match the request user 'id', throw an error
      throw new ForbiddenException('You can only change your own password');
    }

    return true; // Allow the request if IDs match
  }
}