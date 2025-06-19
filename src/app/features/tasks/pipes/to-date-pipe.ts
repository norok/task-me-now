import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toDate'
})
export class ToDatePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    try {
      const date = new Date(value);
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Invalid date format:', value);
      return '';
    }
  }
}
