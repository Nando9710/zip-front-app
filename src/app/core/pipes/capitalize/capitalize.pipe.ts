import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
  standalone: true,
  pure: true
})
export class CapitalizePipe implements PipeTransform {

  /**
   * Recibe una cadena de texto y la devuelve la con la primera letra en mayúscula
   *
   * @param sentence - Cadena de texto
   * @returns - Cadena de texto con la primera letra en mayúscula
   */
  transform(sentence: string): string {
    if (!sentence?.length) return '';

    return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
  }

}
