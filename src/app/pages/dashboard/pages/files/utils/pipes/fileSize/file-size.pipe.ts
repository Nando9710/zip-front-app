import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
  standalone: true
})
export class FileSizePipe implements PipeTransform {

  transform(size: number): string {
    if (!size) return null;

    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let unit = 0;

    while (size >= 1024) {
      size /= 1024;
      unit++;
    }

    return `${size.toFixed(1)} ${units[unit]}`;
  }

}
