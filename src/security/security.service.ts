import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SecurityService {
	private readonly saltRounds = 10;

	async hashData(password: string): Promise<string> {
		return await bcrypt.hash(password, this.saltRounds);
	}

	async compareData(password: string, hash: string): Promise<boolean> {
		return await bcrypt.compare(password, hash);
	}
}
