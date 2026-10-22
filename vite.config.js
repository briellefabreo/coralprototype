import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// This base path matches the recommended GitHub repository name below.
// If you name the repository something else, change the path to /YOUR-REPOSITORY-NAME/.
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? '/coral-community-alert-link/' : '/',
});
