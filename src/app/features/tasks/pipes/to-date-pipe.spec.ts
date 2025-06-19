import { ToDatePipe } from './to-date-pipe';

describe('ToDatePipe', () => {
  let pipe: ToDatePipe;

  beforeEach(() => {
    pipe = new ToDatePipe();
    // Store original toLocaleDateString to restore later
    spyOn(Date.prototype, 'toLocaleDateString').and.callFake(function() {
      // Return a consistent format for testing
      const date = this as Date;
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    });
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform ISO string to locale date', () => {
    const isoDate = '2023-05-15T10:30:00.000Z';
    const result = pipe.transform(isoDate);
    expect(result).toBe('5/15/2023');
  });

  it('should return empty string for null input', () => {
    const result = pipe.transform(null);
    expect(result).toBe('');
  });

  it('should return empty string for undefined input', () => {
    const result = pipe.transform(undefined);
    expect(result).toBe('');
  });

  it('should handle empty string input', () => {
    const result = pipe.transform('');
    expect(result).toBe('');
  });

  it('should handle invalid date format gracefully', () => {
    const consoleSpy = spyOn(console, 'error');
    const result = pipe.transform('not-a-date');
    expect(result).toBe('');
    expect(consoleSpy).toHaveBeenCalledWith('Invalid date format:', 'not-a-date');
  });

  it('should handle different date formats', () => {
    // Test date string in different format
    const dateStr = '2023/10/25';
    const result = pipe.transform(dateStr);
    expect(result).toBe('10/25/2023');
  });

  it('should handle date object converted to string', () => {
    const date = new Date(2023, 3, 15); // April 15, 2023
    const isoString = date.toISOString();
    const result = pipe.transform(isoString);
    expect(result).toBe('4/15/2023');
  });
});
