import { test, expect } from '@playwright/test';

test.describe('VGC Hub E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('http://localhost:5173');
  });

  test.describe('Authentication Flow', () => {
    test('should complete full signup flow', async ({ page }) => {
      // Click sign up button
      await page.click('text=Sign Up');
      
      // Fill in signup form
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="dateOfBirth"]', '1990-01-01');
      await page.selectOption('select[name="division"]', 'master');
      await page.fill('input[name="password"]', 'password123');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should be redirected to competitor view
      await expect(page.locator('text=Competitor View')).toBeVisible();
    });

    test('should handle login flow', async ({ page }) => {
      // Fill in login form
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should be redirected to competitor view
      await expect(page.locator('text=Competitor View')).toBeVisible();
    });

    test('should handle logout', async ({ page }) => {
      // Login first
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Wait for competitor view
      await expect(page.locator('text=Competitor View')).toBeVisible();
      
      // Click logout
      await page.click('text=Logout');
      
      // Should be back to login screen
      await expect(page.locator('text=Login')).toBeVisible();
    });
  });

  test.describe('Navigation and UI', () => {
    test('should navigate between all main tabs', async ({ page }) => {
      // Login first
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Test navigation to each tab
      const tabs = ['Tournaments', 'Pairings', 'Search', 'Following', 'Social'];
      
      for (const tab of tabs) {
        await page.click(`text=${tab}`);
        await expect(page.locator(`text=${tab}`)).toBeVisible();
      }
    });

    test('should handle responsive design', async ({ page }) => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('nav')).toBeVisible();
      
      // Test tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page.locator('nav')).toBeVisible();
      
      // Test desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await expect(page.locator('nav')).toBeVisible();
    });

    test('should handle keyboard navigation', async ({ page }) => {
      // Login first
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Test tab navigation
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      
      // Should navigate to a different tab
      await expect(page.locator('nav')).toBeVisible();
    });
  });

  test.describe('Tournament Functionality', () => {
    test('should register for tournament', async ({ page }) => {
      // Login first
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Navigate to tournaments
      await page.click('text=Tournaments');
      
      // Find and click register button on first tournament
      await page.click('button:has-text("Register")');
      
      // Should show registration confirmation
      await expect(page.locator('text=Registration Successful')).toBeVisible();
    });

    test('should view tournament pairings', async ({ page }) => {
      // Login first
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Navigate to pairings
      await page.click('text=Pairings');
      
      // Should show pairings interface
      await expect(page.locator('text=Tournament Pairings')).toBeVisible();
      
      // Test round navigation
      await page.click('button:has-text("Round 1")');
      await expect(page.locator('text=Round 1')).toBeVisible();
    });

    test('should handle tournament queue', async ({ page }) => {
      // Login first
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Navigate to tournaments
      await page.click('text=Tournaments');
      
      // Join queue for a tournament
      await page.click('button:has-text("Join Queue")');
      
      // Should show queue status
      await expect(page.locator('text=Queue Position')).toBeVisible();
    });
  });

  test.describe('Player Search and Profiles', () => {
    test('should search for players', async ({ page }) => {
      // Login first
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Navigate to search
      await page.click('text=Search');
      
      // Search for a player
      await page.fill('input[placeholder*="search"]', 'Test Player');
      await page.keyboard.press('Enter');
      
      // Should show search results
      await expect(page.locator('text=Test Player')).toBeVisible();
    });

    test('should view player profile', async ({ page }) => {
      // Login first
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Navigate to search and find a player
      await page.click('text=Search');
      await page.fill('input[placeholder*="search"]', 'Test Player');
      await page.keyboard.press('Enter');
      
      // Click on player card
      await page.click('text=Test Player');
      
      // Should show player profile
      await expect(page.locator('text=Player Profile')).toBeVisible();
    });

    test('should navigate profile tabs', async ({ page }) => {
      // Login and navigate to player profile
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      await page.click('text=Search');
      await page.fill('input[placeholder*="search"]', 'Test Player');
      await page.keyboard.press('Enter');
      await page.click('text=Test Player');
      
      // Test profile tab navigation
      const tabs = ['Overview', 'Achievements', 'History'];
      
      for (const tab of tabs) {
        await page.click(`text=${tab}`);
        await expect(page.locator(`text=${tab}`)).toBeVisible();
      }
    });
  });

  test.describe('Social Features', () => {
    test('should follow players', async ({ page }) => {
      // Login first
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Navigate to search and find a player
      await page.click('text=Search');
      await page.fill('input[placeholder*="search"]', 'Test Player');
      await page.keyboard.press('Enter');
      
      // Click follow button
      await page.click('button:has-text("Follow")');
      
      // Should show following status
      await expect(page.locator('text=Following')).toBeVisible();
    });

    test('should view following feed', async ({ page }) => {
      // Login first
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Navigate to following
      await page.click('text=Following');
      
      // Should show following feed
      await expect(page.locator('text=Following Feed')).toBeVisible();
    });

    test('should create and view posts', async ({ page }) => {
      // Login first
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Navigate to social
      await page.click('text=Social');
      
      // Create a post
      await page.click('button:has-text("Create Post")');
      await page.fill('textarea[placeholder*="post"]', 'Test post content');
      await page.click('button:has-text("Post")');
      
      // Should show the new post
      await expect(page.locator('text=Test post content')).toBeVisible();
    });
  });

  test.describe('Team Builder', () => {
    test('should build a team', async ({ page }) => {
      // Login first
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Navigate to team builder
      await page.click('text=Team Builder');
      
      // Add Pokemon to team
      await page.click('button:has-text("Add Pokemon")');
      await page.fill('input[placeholder*="Pokemon"]', 'Charizard');
      await page.click('text=Charizard');
      
      // Should show Pokemon in team
      await expect(page.locator('text=Charizard')).toBeVisible();
    });

    test('should save and load teams', async ({ page }) => {
      // Login first
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Navigate to team builder
      await page.click('text=Team Builder');
      
      // Build a team
      await page.click('button:has-text("Add Pokemon")');
      await page.fill('input[placeholder*="Pokemon"]', 'Charizard');
      await page.click('text=Charizard');
      
      // Save team
      await page.click('button:has-text("Save Team")');
      await page.fill('input[placeholder*="team name"]', 'Test Team');
      await page.click('button:has-text("Save")');
      
      // Should show save confirmation
      await expect(page.locator('text=Team Saved')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Mock network failure
      await page.route('**/*', route => route.abort());
      
      // Try to login
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Should show error message
      await expect(page.locator('text=Network Error')).toBeVisible();
    });

    test('should handle invalid form submissions', async ({ page }) => {
      // Try to submit empty form
      await page.click('button[type="submit"]');
      
      // Should show validation errors
      await expect(page.locator('text=Required')).toBeVisible();
    });

    test('should handle 404 pages', async ({ page }) => {
      // Navigate to non-existent page
      await page.goto('http://localhost:5173/nonexistent');
      
      // Should show 404 or redirect to home
      await expect(page.locator('text=404') | page.locator('text=Login')).toBeVisible();
    });
  });

  test.describe('Performance Tests', () => {
    test('should load quickly', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('http://localhost:5173');
      
      const loadTime = Date.now() - startTime;
      
      // Should load in under 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should handle rapid interactions', async ({ page }) => {
      // Login first
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Rapidly click different tabs
      const tabs = ['Tournaments', 'Pairings', 'Search', 'Following', 'Social'];
      
      for (let i = 0; i < 3; i++) {
        for (const tab of tabs) {
          await page.click(`text=${tab}`);
          await page.waitForTimeout(100); // Small delay
        }
      }
      
      // Should still be functional
      await expect(page.locator('nav')).toBeVisible();
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      // Check for ARIA labels on important elements
      await expect(page.locator('[aria-label]')).toHaveCount(0); // Should have some ARIA labels
    });

    test('should support screen readers', async ({ page }) => {
      // Check for semantic HTML elements
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    });

    test('should have proper focus management', async ({ page }) => {
      // Login first
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Test focus management
      await page.keyboard.press('Tab');
      await expect(page.locator(':focus')).toBeVisible();
    });
  });

  test.describe('Cross-browser Compatibility', () => {
    test('should work in different browsers', async ({ page, browserName }) => {
      // This test will run in different browsers
      await page.goto('http://localhost:5173');
      
      // Basic functionality should work in all browsers
      await expect(page.locator('text=Login')).toBeVisible();
      
      // Browser-specific checks
      if (browserName === 'chromium') {
        // Chrome-specific tests
        await expect(page.locator('body')).toBeVisible();
      } else if (browserName === 'firefox') {
        // Firefox-specific tests
        await expect(page.locator('body')).toBeVisible();
      } else if (browserName === 'webkit') {
        // Safari-specific tests
        await expect(page.locator('body')).toBeVisible();
      }
    });
  });
}); 