import { defineConfig, devices } from '@playwright/test'
import path from 'path'

require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') })

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  projects: [
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-390x844',
      use: {
        viewport: { width: 390, height: 844 },
        userAgent: devices['iPhone 14'].userAgent,
        hasTouch: true,
        isMobile: true,
      },
    },
  ],
})
