import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from 'src/entities';

@Injectable()
export class UsersService {
	constructor(
		@Inject(User)
		private userRepository: Repository<User>
	) {}

	async getUserById(id: number): Promise<User> {
		const user = await this.userRepository.findOneBy({ id });

		if (!user) {
			throw new NotFoundException(`User with the ID ${id} not found`);
		}

		return user;
	}

	async getUserByEmail(email: string): Promise<User> {
		const user = await this.userRepository.findOneBy({ email });

		if (!user) return null;

		return user;
	}

	async createUser(user: Partial<User>): Promise<User> {
		const oldUser = await this.getUserByEmail(user.email);

		if (oldUser) {
			throw new BadRequestException(
				`User with the email ${user.email} already exists`
			);
		}

		return await this.userRepository.save(user);
	}

	async getAllUsers() {
		const users = await this.userRepository.find();

		if (!users.length) {
			throw new NotFoundException(`The list of users is empty`);
		}

		return users;
	}
}
