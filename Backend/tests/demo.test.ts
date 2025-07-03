/**
 * Einfacher Demo-Test um zu zeigen, dass Vitest funktioniert
 */

import { describe, it, expect } from 'vitest';

describe('Demo Tests - Vitest funktioniert!', () => {
  it('should pass a simple test', () => {
    expect(2 + 2).toBe(4);
  });

  it('should work with async functions', async () => {
    const result = await Promise.resolve('Hello Vitest!');
    expect(result).toBe('Hello Vitest!');
  });

  it('should work with object matching', () => {
    const card = {
      id: '123',
      title: 'Test Card',
      currentLearningLevel: 0
    };
    
    expect(card).toEqual({
      id: '123',
      title: 'Test Card',
      currentLearningLevel: 0
    });
  });
});
