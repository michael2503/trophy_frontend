import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripHtml'
})
export class StripHtmlPipe implements PipeTransform {

  transform(value: string) {
    return value.replace(/<\/*[a-z0-9]+[^<>]*>/ig, '');
  }

}
