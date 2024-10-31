import { SetMetadata } from '@nestjs/common';

import { Role } from 'src/entities/user.entity';

export const Roles = (role: Role) => SetMetadata('role', role);
