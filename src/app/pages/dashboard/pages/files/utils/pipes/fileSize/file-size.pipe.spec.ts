import { FileSizePipe } from './file-size.pipe';

describe('FileSizePipe', () => {
  it('create an instance', () => {
    const pipe = new FileSizePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return the correct size', () => {
    const pipe = new FileSizePipe();
    expect(pipe.transform(1024)).toBe('1.0 KB');
    expect(pipe.transform(1024 * 1024)).toBe('1.0 MB');
    expect(pipe.transform(1024 * 1024 * 1024)).toBe('1.0 GB');
    expect(pipe.transform(1024 * 1024 * 1024 * 1024)).toBe('1.0 TB');
  });
});
