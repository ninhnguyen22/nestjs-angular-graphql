import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  visibility: BehaviorSubject<boolean>;

  constructor() {
    this.visibility = new BehaviorSubject(false);
  }

  get visibilityStatus(): boolean {
    return this.visibility.value;
  }

  show() {
    this.visibility.next(true);
  }

  hide() {
    this.visibility.next(false);
  }
}
