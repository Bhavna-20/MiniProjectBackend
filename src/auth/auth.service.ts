import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const result = await this.usersService.findOneByEmail(email);
    if (result.password !== password) return false;
    return result;
  }

  sign(user: User) {
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    return {
      access_token: accessToken,
      userId: user.id,
    };
  }
  async registerUser(createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);
    return this.sign(newUser);
  }
}
