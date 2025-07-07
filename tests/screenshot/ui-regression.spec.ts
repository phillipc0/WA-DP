import { test, expect } from '@playwright/test';

test.describe('UI Regression Tests', () => {
  test('Homepage renders correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('Portfolio page renders correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(500);
    
    // Check if there's any dynamic content that needs to be loaded
    await page.waitForSelector('body', { state: 'attached' });
    
    await expect(page).toHaveScreenshot('portfolio-page.png');
  });

  test('Edit page renders correctly', async ({ page }) => {
    await page.goto('/edit');
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('edit-page.png');
  });

  test('Theme toggle works correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(500);
    
    // Screenshot in light mode
    await expect(page).toHaveScreenshot('theme-light.png');
    
    // Toggle to dark mode
    await page.click('[data-testid="theme-switch"], [aria-label*="theme"], button[class*="theme"]');
    await page.waitForTimeout(500);
    
    // Screenshot in dark mode
    await expect(page).toHaveScreenshot('theme-dark.png');
  });

  test('Responsive design - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('mobile-homepage.png');
  });

  test('Responsive design - tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('tablet-homepage.png');
  });
});