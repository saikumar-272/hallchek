import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'caseConvert',
})
export class CaseConvertPipe implements PipeTransform {
  transform(value: string, textcase: 'lower' | 'upper' | 'capital' = 'upper') {
    if (textcase == 'lower') return value.toLowerCase();
    if (textcase == 'capital') return toUpper(value);
    return value.toUpperCase();
  }
}

function toUpper(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map(function (word) {
      return word[0].toUpperCase() + word.substr(1);
    })
    .join(' ');
}
