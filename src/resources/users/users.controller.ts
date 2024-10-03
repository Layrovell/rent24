import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserHelperProvider } from './userMapper.provider';
import { UsersService } from './users.service';
import { ViewUserDto } from './dto/view-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(
		private readonly userService: UsersService,
		private readonly userHelperProvider: UserHelperProvider
	) {}

	@Get('')
	async getAllUsers(): Promise<ViewUserDto[]> {
		const users = await this.userService.getAllUsers();

		return this.userHelperProvider.userListToViewDto(users);
	}

	@Get(':id')
	async getUserById(@Param('id') id: number): Promise<ViewUserDto> {
		const user = await this.userService.getUserById(id);

		return this.userHelperProvider.userToViewDto(user);
	}
}
