import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppServices {
  flattenObject(obj: any): any {
    const flat: any = {};

    for (const key in obj) {
      if (
        typeof obj[key] === 'object' &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        for (const innerKey in obj[key]) {
          flat[innerKey] = obj[key][innerKey];
        }
      } else {
        flat[key] = obj[key];
      }
    }
    return flat;
  }

  public restrictNumeric(e: any) {
    let input;
    // console.log(e);
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
  }

  slides = [
    {
      image: '2.jpg',
      title: 'Celebrate at a function hall/conventions',
      description:
        'Spacious and elegant halls for weddings, receptions, corporate events  and celebrations of any scale — hassle-free and memorable.',
    },
    {
      image: '3.jpg',
      title: 'Celebrate at a Mini Function Hall',
      description:
        'Intimate spaces for birthdays, get-togethers, and small functions — cozy, stylish, and budget-friendly.',
    },
    {
      image: '4.jpg',
      title: 'Celebrate at a farm house',
      description:
        'Host your special moments surrounded by nature — perfect for weddings, parties, and family gatherings in a serene farm house setting',
    },
  ];
}
