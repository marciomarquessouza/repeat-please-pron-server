import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { UserGroup } from '../user-group.enum';

export const GetUser = createParamDecorator(
  (groupsAlloweds: UserGroup[], ctx: ExecutionContext): User => {
    const request: { user: User } = ctx.switchToHttp().getRequest();

    if (!request.user) {
      throw new BadRequestException(`User not found`);
    }

    if (groupsAlloweds && groupsAlloweds.length) {
      const { group } = request.user;
      const isGroupAllowed = groupsAlloweds.includes(group);
      if (!isGroupAllowed) {
        throw new UnauthorizedException();
      }
    }

    return request.user;
  },
);
