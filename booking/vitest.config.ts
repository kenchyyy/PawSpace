// import { defineConfig } from "vitest/config";
// import path from 'path';

// export default defineConfig({
//     test: {
//         projects: [
//             "vitest.config.storybook.ts",
//             "vitest.config.db.ts"
//         ]
//     },
//     resolve: {
//     alias: {
//       '@': path.resolve(__dirname, 'src'),
//     },
//   },
// });

// vite.config.ts
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 👈 matches your tsconfig
    },
  },
  test: {
    globals: true, // optional, if you're using global `describe`, `it`, etc.
    environment: 'jsdom', // optional, for React component testing
  },
});
