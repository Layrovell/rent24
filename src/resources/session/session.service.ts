import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { Session, User } from 'src/entities';

@Injectable()
export class SessionService {
  constructor(
    @Inject(Session)
    private readonly sessionRepository: Repository<Session>
  ) {}

  async createSession({
    refreshToken,
    user,
    location,
    deviceName,
  }: {
    refreshToken: string;
    user: User;
    location: string;
    deviceName: string;
  }): Promise<any> {
    const session = this.sessionRepository.create({
      refreshToken,
      user,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days expiration
      online: true, // User is online upon login
      location,
      deviceName,
    });

    return this.sessionRepository.save(session);
  }

  async findByToken(refreshToken: string): Promise<any> {
    const session = await this.sessionRepository.findOne({
      where: { refreshToken },
      relations: {
        user: true,
      },
    });

    if (!session || new Date() > session.expiresAt) {
      throw new UnauthorizedException('Session expired or invalid');
    }

    return session;
  }

  async updateSession({
    sessionId,
    newRefreshToken,
    online,
    location,
    deviceName,
  }: {
    sessionId: number;
    newRefreshToken: string;
    online: boolean;
    location: string;
    deviceName: string;
  }): Promise<Session> {
    const session = await this.sessionRepository.findOneBy({ id: sessionId });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    session.refreshToken = newRefreshToken;
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // Reset expiration

    if (online !== undefined) session.online = online;
    if (location) session.location = location;
    if (deviceName) session.deviceName = deviceName;

    return this.sessionRepository.save(session);
  }

  async deleteSession(sessionId: number): Promise<void> {
    await this.sessionRepository.delete(sessionId);
  }

  async deleteSessionsByUser(userId: number): Promise<void> {
    await this.sessionRepository.delete({ user: { id: userId } });
  }
}
