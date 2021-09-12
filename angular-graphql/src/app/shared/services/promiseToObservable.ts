import { Observable } from 'apollo-link';

export default promise =>
  new Observable((subscriber: any) => {
    promise.then(
      (value) => {
        if (subscriber.closed) return;
        subscriber.next(value);
        subscriber.complete();
      },
      err => subscriber.error(err)
    );
    return subscriber;
  });
