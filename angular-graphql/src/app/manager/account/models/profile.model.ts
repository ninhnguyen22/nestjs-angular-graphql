import { User } from "../../user/models";

export type ProfileQuery = {
  me: User;
};

export type ProfileUpdateMutation = {
  profileUpdate: boolean
};

export type ProfilePwUpdateMutation = {
  profilePwUpdate: boolean
};

export type ProfileAvatarUpdateMutation = {
  profileAvatarUpdate: string
};
