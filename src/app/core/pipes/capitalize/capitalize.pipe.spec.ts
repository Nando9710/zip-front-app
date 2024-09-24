import { CapitalizePipe } from './capitalize.pipe';

describe('CapitalizePipe', (): void => {
  it('create an instance', (): void => {
    const pipe: CapitalizePipe = new CapitalizePipe();
    expect(pipe).toBeTruthy();
  });

  it('text is null', (): void => {
    const pipe: CapitalizePipe = new CapitalizePipe();

    const result: string = pipe.transform(null);
    expect(result).toBe('');
  });

  it('capitalize text', (): void => {
    const pipe: CapitalizePipe = new CapitalizePipe();

    const text = 'hola adios'
    const result: string = pipe.transform(text);
    expect(result).toBe('Hola adios');
  });
});
