import { Role } from 'src/entities/user.entity';

export class ViewUserDto {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	role: Role;
	createdat: Date;
	updatedAt: Date;
	deletedAt: Date;
}
