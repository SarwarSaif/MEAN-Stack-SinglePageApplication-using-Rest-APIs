import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

// control is an asynchronous validator here
export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any}> | Observable<{ [key: string]: any}> => {
  if (typeof(control.value) === 'string') {
    return of(null); // Quick observable creation using 'of' from rxjs
  }
  const file = control.value as File;
  const fileReader = new FileReader();
  // Create our own observable using rxjs
  // Angular: create is deprecated: So I used new Observable() instead
  // tslint:disable-next-line: deprecation
  const frObs = Observable.create((observer: Observer<{[key: string]: any}>) => {
    fileReader.addEventListener('loadend', () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);

      let header = '';
      let isValid = false;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }
      // for (const ar of arr) {
      //   header += ar.toString[16];
      //   console.log(ar);
      // }
      switch (header) {
        case '89504e47': // for png
          isValid = true;
          break;
        case 'ffd8ffe0': // for gif
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8': // for jpeg
          isValid = true;
          break;
        default:
          isValid = false; // Or you can use the blob.type as fallback
          break;
      }
      console.log(isValid);
      if (isValid) {
        observer.next(null);
      } else {
        observer.next({invalidMimeType: true});
      }
      observer.complete();
    });
    fileReader.readAsArrayBuffer(file);
  });
  return frObs;
};
