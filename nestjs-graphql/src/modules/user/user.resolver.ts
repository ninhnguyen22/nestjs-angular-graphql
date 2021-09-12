import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

import { UserService, AuthService } from './services';
import {
  UserCreateDto,
  UserUpdateDto,
  LoginUserDto,
  LoginResponseUserDto,
  RefreshTokenDto, RegisterUserDto, ProfileUpdateDto, ProfilePwUpdateDto,
} from './dto';
import { User } from './entities';
import { NotificationPubSubService } from '../notification/services';
import { FileUploadService } from '../../config/services';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly notifyPubSubService: NotificationPubSubService,
    private readonly fileUploadService: FileUploadService,
  ) {
  }

  @Query(() => User)
  async me(@Context('currentUser') currentUser: User) {
    return currentUser;
  }

  @Query(() => [User])
  async users() {
    return this.userService.findAll();
  }

  @Query(() => User)
  async user(@Args('_id') _id: string) {
    return this.userService.findById(_id);
  }

  @Query(() => [User])
  async roles() {
    return this.userService.getRoles();
  }

  @Mutation(() => User)
  async userCreate(@Args('input') input: UserCreateDto) {
    return await this.userService.create(input);
  }

  @Mutation(() => User)
  async userUpdate(
    @Args('_id') _id: string,
    @Args('input') input: UserUpdateDto,
  ) {
    return await this.userService.update(_id, input);
  }

  @Mutation(() => Boolean)
  async userDelete(@Args('_id') _id: string) {
    return await this.userService.delete(_id);
  }

  @Mutation(() => LoginResponseUserDto)
  async login(@Args('input') input: LoginUserDto) {
    const loginResponse = await this.authService.login(input);
    /* Login Subscription */
    if (loginResponse && loginResponse.user) {
      this.notifyPubSubService.publishLogged(loginResponse.user);
    }
    return loginResponse;
  }

  @Mutation(() => User)
  async register(@Args('input') input: RegisterUserDto) {
    return await this.userService.register(input);
  }

  @Mutation(() => RefreshTokenDto)
  async refreshToken(@Args('refreshToken') refreshToken: string) {
    return await this.authService.refreshToken(refreshToken);
  }

  @Mutation(() => User)
  async profileUpdate(
    @Context('currentUser') currentUser: User,
    @Args('input') input: ProfileUpdateDto,
  ) {
    return await this.userService.profileUpdate(currentUser, input);
  }

  @Mutation(() => Boolean)
  async profileAvatarUpdate(
    @Context('currentUser') currentUser: User,
    @Args({name: 'file', type: () => GraphQLUpload}) fileUpload: FileUpload,
  ): Promise<boolean> {
    const avatar = await this.fileUploadService.upload(fileUpload);
    const updateStatus = await this.userService.profileAvatarUpdate(currentUser, avatar);
    if (updateStatus) {
      /* Remove old avatar */
      if (currentUser.avatar) {
        await this.fileUploadService.delete(currentUser.avatar);
      }
    }
    return updateStatus;
  }

  @Mutation(() => User)
  async profilePwUpdate(
    @Context('currentUser') currentUser: User,
    @Args('input') input: ProfilePwUpdateDto,
  ) {
    return await this.userService.profilePwUpdate(currentUser, input);
  }

  @Mutation(() => Boolean)
  async lasNotifyUpdate(
    @Context('currentUser') currentUser: User,
    @Args('lastNotifyAt') lastNotifyAt: string,
  ) {
    return await this.userService.updateLastNotifyAt(currentUser, lastNotifyAt);
  }

}
