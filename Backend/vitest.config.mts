import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // ... other Vitest configurations
    setupFiles: ['./tests/vitest.setup.ts'], // Corrected path
    // You might also need to exclude the test file itself from direct setup,
    // though usually setupFiles runs before any test files.
    // However, if your authService.test.ts also sets process.env.JWT_SECRET, you should remove that line from the test file.
  },
});