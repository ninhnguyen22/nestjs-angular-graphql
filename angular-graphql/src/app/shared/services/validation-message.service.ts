import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationMessageService {
  getErrorMessage(rule, ...values) {
    switch (rule) {
      case 'required':
        return 'You must inter value';
      case 'email':
        return 'Not in valid email';
      case 'min':
        return `You must enter at least ${values[0]} characters`;
      case 'max':
        return `You can only enter up to ${values[0]} characters`;
    }
    return '';
  }
}
