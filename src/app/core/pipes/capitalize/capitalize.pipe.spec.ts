import {CapitalizePipe} from './capitalize.pipe';

describe('CapitalizePipe', (): void => {
  it('create an instance', (): void => {
    const pipe: CapitalizePipe = new CapitalizePipe();
    expect(pipe).toBeTruthy();
  });
});
