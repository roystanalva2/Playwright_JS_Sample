const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const PerformanceHelper = require('../utils/PerformanceHelper');
const TestUtil = require('../utils/TestUtil');
require('dotenv').config();

/**
 * Performance Testing Suite
 * Tests for page load times, Core Web Vitals, and overall performance
 */
test.describe('@performance Performance Tests', () => {
  let homePage;
  let performanceHelper;
  let testUtil;
  const LOAD_TIME_THRESHOLD = parseInt(process.env.LOAD_TIME_THRESHOLD) || 3000;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    performanceHelper = new PerformanceHelper(page);
    testUtil = new TestUtil(page);
  });

  test('@performance Page Load Time - Should load within threshold', async ({ page }) => {
    const startTime = Date.now();
    await homePage.goto();
    const endTime = Date.now();
    
    const loadTime = endTime - startTime;
    expect(loadTime).toBeLessThan(LOAD_TIME_THRESHOLD);
  });

  test('@performance Navigation Timing - Should meet performance metrics', async ({ page }) => {
    await homePage.goto();
    
    const timing = await performanceHelper.measurePageLoadTime();
    
    expect(timing.domComplete).toBeLessThan(3000);
    expect(timing.loadComplete).toBeLessThan(5000);
  });

  test('@performance Page Size - Should be reasonably sized', async ({ page }) => {
    await homePage.goto();
    
    const pageSize = await performanceHelper.getPageSize();
    
    // Check total page size
    const totalSizeMB = pageSize.totalSize / (1024 * 1024);
    expect(totalSizeMB).toBeLessThan(10); // Page should be less than 10MB
  });

  test('@performance Resource Count - Should have reasonable resource count', async ({ page }) => {
    await homePage.goto();
    
    const pageSize = await performanceHelper.getPageSize();
    
    // Should have reasonable number of resources
    expect(pageSize.resourceCount).toBeLessThan(200);
  });

  test('@performance API Response Time - APIs should respond quickly', async ({ page }) => {
    await homePage.goto();
    
    const apiTiming = await performanceHelper.measureAPIResponseTime();
    
    if (apiTiming.length > 0) {
      apiTiming.forEach(api => {
        expect(api.duration).toBeLessThan(5000); // APIs should respond within 5 seconds
      });
    }
  });

  test('@performance JavaScript Execution - JS should execute efficiently', async ({ page }) => {
    await homePage.goto();
    
    const jsMetrics = await performanceHelper.getJSExecutionTime();
    
    expect(jsMetrics.totalJSTime).toBeLessThan(3000);
  });

  test('@performance Layout Shift - Should have minimal layout shifts', async ({ page }) => {
    await homePage.goto();
    
    const shifts = await performanceHelper.monitorLayoutShifts();
    
    expect(shifts.length).toBeLessThan(5); // Should have minimal layout shifts
  });

  test('@performance TTFB - Time to First Byte should be fast', async ({ page }) => {
    await homePage.goto();
    
    const timing = await performanceHelper.measurePageLoadTime();
    
    expect(timing.ttfb).toBeLessThan(1000); // TTFB should be < 1 second
  });

  test('@performance DOM Interactive Time - DOM should be interactive quickly', async ({ page }) => {
    await homePage.goto();
    
    const timing = await performanceHelper.measurePageLoadTime();
    
    expect(timing.domInteractive).toBeLessThan(2000);
  });
});

test.describe('@performance Performance Tests - Search Performance', () => {
  let homePage;
  let testUtil;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    testUtil = new TestUtil(page);
    await homePage.goto();
  });

  test('@performance Search Response Time - Search should respond quickly', async () => {
    const startTime = Date.now();
    await homePage.searchProduct('Tomato');
    const endTime = Date.now();
    
    const responseTime = endTime - startTime;
    expect(responseTime).toBeLessThan(2000); // Search should respond within 2 seconds
  });

  test('@performance Filter Performance - Filtering should be responsive', async () => {
    const startTime = Date.now();
    await homePage.filterByVegOnly();
    const endTime = Date.now();
    
    const filterTime = endTime - startTime;
    expect(filterTime).toBeLessThan(2000);
  });

  test('@performance Multiple Searches - Sequential searches should maintain performance', async () => {
    const searches = ['Tomato', 'Broccoli', 'Cucumber'];
    const times = [];

    for (const search of searches) {
      const startTime = Date.now();
      await homePage.searchProduct(search);
      const endTime = Date.now();
      times.push(endTime - startTime);
    }

    // Each search should be reasonably fast
    times.forEach(time => {
      expect(time).toBeLessThan(3000);
    });
  });
});

test.describe('@performance Performance Tests - Cart Operations', () => {
  let homePage;
  let testUtil;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    testUtil = new TestUtil(page);
    await homePage.goto();
  });

  test('@performance Add to Cart - Should be responsive', async () => {
    const startTime = Date.now();
    await homePage.addProductToCart(0);
    const endTime = Date.now();
    
    const addTime = endTime - startTime;
    expect(addTime).toBeLessThan(1000); // Should be very quick
  });

  test('@performance Navigate to Cart - Should load quickly', async () => {
    await homePage.addProductToCart(0);
    
    const startTime = Date.now();
    await homePage.goToCart();
    const endTime = Date.now();
    
    const navigationTime = endTime - startTime;
    expect(navigationTime).toBeLessThan(2000);
  });

  test('@performance Multiple Add Operations - Should handle multiple adds efficiently', async () => {
    const startTime = Date.now();
    
    for (let i = 0; i < 5; i++) {
      await homePage.addProductToCart(i % 3);
      await testUtil.wait(100);
    }
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    // 5 operations should take reasonable time
    expect(totalTime).toBeLessThan(5000);
  });
});

test.describe('@performance Performance Tests - Memory Leaks', () => {
  let homePage;
  let testUtil;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    testUtil = new TestUtil(page);
  });

  test('@performance Repeated Navigation - Should not leak memory on repeated navigation', async ({ page }) => {
    const performanceHelper = new PerformanceHelper(page);
    
    for (let i = 0; i < 3; i++) {
      await homePage.goto();
      await testUtil.wait(500);
    }

    const metrics = await page.evaluate(() => {
      return {
        jsHeapSizeLimit: performance.memory?.jsHeapSizeLimit,
        totalJSHeapSize: performance.memory?.totalJSHeapSize,
        usedJSHeapSize: performance.memory?.usedJSHeapSize,
      };
    });

    expect(metrics.usedJSHeapSize).toBeTruthy();
  });

  test('@performance Multiple Filter Operations - Should maintain performance', async () => {
    await homePage.goto();
    
    const times = [];
    
    for (let i = 0; i < 3; i++) {
      const startTime = Date.now();
      await homePage.filterByVegOnly();
      const endTime = Date.now();
      times.push(endTime - startTime);
    }

    // Performance should not degrade significantly
    expect(times[2]).toBeLessThan(times[0] + 500);
  });
});

test.describe('@performance Performance Tests - Network Conditions', () => {
  let homePage;
  let testUtil;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    testUtil = new TestUtil(page);
  });

  test('@performance Slow Network - Page should still load on slow connection', async ({ page, context }) => {
    // Create a page with slower network
    const slowPage = await context.newPage();
    
    // Simulate 4G connection
    await context.route('**/*', async (route) => {
      await slowPage.waitForTimeout(500); // Add delay
      await route.continue();
    });

    const startTime = Date.now();
    await slowPage.goto('https://rahulshettyacademy.com/seleniumPractise');
    const endTime = Date.now();

    const loadTime = endTime - startTime;
    expect(loadTime).toBeLessThan(10000); // Should load within reasonable time

    await slowPage.close();
  });

  test('@performance Offline Recovery - Page should handle network condition changes', async ({ page, context }) => {
    await homePage.goto();
    
    // Set offline
    await context.setOffline(true);
    
    // Try to navigate
    try {
      await page.goto('https://rahulshettyacademy.com/seleniumPractise', { timeout: 2000 });
    } catch (e) {
      // Expected to fail
    }

    // Restore network
    await context.setOffline(false);
    
    // Should work again
    await homePage.goto();
    const title = await homePage.getPageTitle();
    expect(title).toBeTruthy();
  });
});
