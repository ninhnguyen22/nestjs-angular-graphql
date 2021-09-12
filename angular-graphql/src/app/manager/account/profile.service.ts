import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Apollo } from "apollo-angular";

import { ProfileAvatarUpdateMutation, ProfilePwUpdateMutation, ProfileQuery, ProfileUpdateMutation } from "./models";
import { getProfileQuery, updateAvatarMutation, updateProfileMutation, updatePwMutation } from "./queries";

@Injectable({providedIn: 'root'})
export class ProfileService {
  constructor(private http: HttpClient, private apollo: Apollo) {
    this.apollo = apollo;
  }

  getProfile() {
    return this.apollo.watchQuery<ProfileQuery>({
      query: getProfileQuery,
      fetchPolicy: 'no-cache',
    }).valueChanges;
  }

  updateProfile(variables) {
    return this.apollo.mutate<ProfileUpdateMutation>({
      mutation: updateProfileMutation,
      variables,
      fetchPolicy: 'no-cache',
      refetchQueries: [],
    });
  }

  updatePwProfile(variables) {
    return this.apollo.mutate<ProfilePwUpdateMutation>({
      mutation: updatePwMutation,
      variables,
      fetchPolicy: 'no-cache',
      refetchQueries: [],
    });
  }

  updateAvatarProfile(variables) {
    return this.apollo.mutate<ProfileAvatarUpdateMutation>({
      mutation: updateAvatarMutation,
      context: {
        useMultipart: true
      },
      variables,
      fetchPolicy: 'no-cache',
      refetchQueries: [],
    });
  }
}
