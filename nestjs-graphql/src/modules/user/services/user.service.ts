import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ProfilePwUpdateDto, ProfileUpdateDto, RegisterUserDto, UserCreateDto, UserUpdateDto } from '../dto';
import { User } from '../entities';
import { UserRepository } from '../repositories';
import { jwtService } from '../../../config/services';
import { Role } from '../entities/role.entity';
import roles from './roles.mock';
import { RoleService } from './role.service';
import { EncryptionHelper } from '../helpers';

@Injectable()
export class UserService {
  private readonly jwtService?: JwtService;

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
  ) {
    this.jwtService = jwtService;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.getAll({
      deleted_at: null,
    });
  }

  async findById(_id: string): Promise<User> {
    return await this.userRepository.findOne({_id});
  }

  async getRoles(): Promise<Role[]> {
    return new Promise((resolve, reject) => {
      resolve(roles.map(role => Object.assign(new Role(), role)));
    });
  }

  async create(user: UserCreateDto): Promise<User> {
    const userEntity = new User();
    userEntity.name = user.name;
    userEntity.email = user.email;
    userEntity.password = await EncryptionHelper.encrypt(user.password);
    userEntity.roles = await this.roleService.findByCodes(user.roles);
    return await this.userRepository.save(userEntity);
  }

  async update(_id: string, user: UserUpdateDto): Promise<boolean> {
    const rolesData = await this.roleService.findByCodes(user.roles);
    if (user.password) {
      user.password = await EncryptionHelper.encrypt(user.password);
    }
    const userData = {...user, ...{roles: rolesData}};
    return !!await this.userRepository.findOneAndUpdate(
      {_id},
      {$set: userData},
    );
  }

  async updateLastNotifyAt(user: User, lastNotifyAt: string): Promise<boolean> {
    const date = new Date(parseInt(lastNotifyAt));
    const userData = {...user, ...{lastNotifyAt: date}};
    return !!await this.userRepository.findOneAndUpdate(
      {_id: user._id},
      {$set: userData},
    );
  }

  async delete(_id: string): Promise<boolean> {
    return !!await this.userRepository.findOneAndDelete(
      {_id},
    );
  }

  async register(user: RegisterUserDto): Promise<User> {
    const entity = Object.assign(new User(), user);
    return await this.userRepository.save(entity);
  }

  async findByToken(token: string) {
    const payload = this.verifyToken(token);

    if (!payload) {
      return null;
    }

    return await this.userRepository.findOne({
      _id: payload.id,
    });
  }

  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }

  async findByProjectId(_id: string): Promise<User[]> {
    return await this.userRepository.find({where: {projects: _id}});
  }

  async profileUpdate(user: User, input: ProfileUpdateDto): Promise<boolean> {
    const userData = {...user, ...input};
    return !!await this.userRepository.findOneAndUpdate(
      {_id: user._id},
      {$set: userData},
    );
  }

  async profilePwUpdate(user: User, input: ProfilePwUpdateDto): Promise<boolean> {
    const userEntity = await this.userRepository.findOne({_id: user._id});
    if (!userEntity || !(await userEntity.matchesPassword(input.oldPassword))) {
      return false;
    }
    userEntity.password = await EncryptionHelper.encrypt(input.newPassword);
    return !!await this.userRepository.save(userEntity);
  }

  async profileAvatarUpdate(user: User, avatar: string): Promise<boolean> {
    const userEntity = await this.userRepository.findOne({_id: user._id});
    if (!userEntity) {
      return false;
    }
    userEntity.avatar = avatar;
    return !!await this.userRepository.save(userEntity);
  }
}
