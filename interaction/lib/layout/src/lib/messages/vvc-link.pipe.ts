import { Pipe, PipeTransform } from '@angular/core';
import * as Autolinker from 'autolinker';

@Pipe({ name: 'vvcLink' })
export class VvcLinkPipe implements PipeTransform {
  transform(value: string, options?: any): string {
    return Autolinker.link(value, options);
  }
}