import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Get default role (admin)
    const defaultRole = await this.roleService.findBySlug('admin');
    if (!defaultRole) {
      throw new BadRequestException('Default role not found');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = await this.userService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      phoneNumber: registerDto.phoneNumber,
      roleId: defaultRole.id,
    });

    // Generate JWT token
    const access_token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role.slug,
    });

    return {
      success: true,
      message: 'User registered successfully',
      access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || undefined,
        role: {
          id: user.role.id,
          roleName: user.role.roleName,
          slug: user.role.slug,
        },
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const access_token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role.slug,
    });

    return {
      success: true,
      message: 'Login successful',
      access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || undefined,
        role: {
          id: user.role.id,
          roleName: user.role.roleName,
          slug: user.role.slug,
        },
      },
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (user && !user.deletedAt) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        return user;
      }
    }

    return null;
  }

  async getProfile(userId: number) {
    const user = await this.userService.findById(userId);

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('User not found');
    }

    return {
      success: true,
      message: 'Profile retrieved successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || undefined,
        role: {
          id: user.role.id,
          roleName: user.role.roleName,
          slug: user.role.slug,
        },
      },
    };
  }
}
