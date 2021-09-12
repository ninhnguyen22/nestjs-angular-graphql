import { Injectable } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import roles from './roles.mock';

@Injectable()
export class RoleService {

  async findAll(): Promise<Role[]> {
    return new Promise((resolve, reject) => {
      resolve(roles.map(role => Object.assign(new Role(), role)));
    });
  }

  async findByCodes(codes: string[]): Promise<Role[]> {
    return new Promise((resolve, reject) => {
      resolve(roles.filter(r => codes.includes(r.code)).map(role => Object.assign(new Role(), role)));
    });
  }

  async findOne(code: string): Promise<Role> {
    return new Promise((resolve, reject) => {
      const role = roles.find(r => r.code === code);
      if (!role) {
        reject('Role does not exist');
      }
      resolve(Object.assign(new Role(), role));
    });
  }

}
