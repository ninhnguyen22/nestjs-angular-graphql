import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  getEnv(key: string): any {
    return environment[key];
  }

  getResourceUrl(): string {
    return this.getEnv('resourceUrl');
  }
}
