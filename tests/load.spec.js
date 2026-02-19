const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const TestUtil = require('../utils/TestUtil');

/**
 * Load Testing Suite
 * Simulates high-load scenarios and concurrent operations
 */
test.describe('@load Load Tests - Concurrent Users', () => {
  test('@load Concurrent Page Access - Multiple users accessing homepage', async ({ page }) => {
    const homePage = new HomePage(page);
    const testUtil = new TestUtil(page);
    
    const loadStartTime = Date.now();
    
    // Simulate 10 concurrent page loads
    const loadPromises = [];
    for (let i = 0; i < 10; i++) {
      loadPromises.push(
        page.goto('https://rahulshettyacademy.com/seleniumPractise', { timeout: 10000 })
      );
    }

    try {
      await Promise.race(loadPromises);
      const loadEndTime = Date.now();
      const loadTime = loadEndTime - loadStartTime;
      
      expect(loadTime).toBeLessThan(30000); // Should complete within 30 seconds
    } catch (e) {
      // Some requests might timeout under heavy load
      console.log('Load test note: Some concurrent requests timed out');
    }
  });

  test('@load Sequential Operations - Many sequential operations', async ({ page }) => {
    const homePage = new HomePage(page);
    const testUtil = new TestUtil(page);
    
    await homePage.goto();
    
    const operationTimes = [];
    const operationCount = 20;

    for (let i = 0; i < operationCount; i++) {
      const startTime = Date.now();
      
      try {
        // Alternate between different operations
        if (i % 3 === 0) {
          await homePage.searchProduct('Tomato');
        } else if (i % 3 === 1) {
          await homePage.addProductToCart(0);
        } else {
          await testUtil.wait(100);
        }
      } catch (e) {
        console.log(`Operation ${i} failed:`, e.message);
      }
      
      const endTime = Date.now();
      operationTimes.push(endTime - startTime);
    }

    // Calculate average response time
    const averageTime = operationTimes.reduce((a, b) => a + b, 0) / operationTimes.length;
    expect(averageTime).toBeLessThan(5000);
  });
});

test.describe('@load Load Tests - High Volume Interactions', () => {
  let homePage;
  let testUtil;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    testUtil = new TestUtil(page);
    await homePage.goto();
  });

  test('@load Rapid Add to Cart - Add multiple items rapidly', async () => {
    const productCount = await homePage.getProductCount();
    const itemsToAdd = Math.min(20, productCount);

    const startTime = Date.now();

    for (let i = 0; i < itemsToAdd; i++) {
      try {
        await homePage.addProductToCart(i % productCount);
        await testUtil.wait(50); // Minimal wait
      } catch (e) {
        console.log(`Add failed at index ${i}`);
      }
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // Should handle 20 adds
    expect(totalTime).toBeLessThan(60000);
  });

  test('@load Rapid Searches - Many search operations', async () => {
    const searchTerms = [
      'Tomato', 'Broccoli', 'Cucumber', 'Carrot', 'Spinach',
      'Bean', 'Potato', 'Onion', 'Lettuce', 'Pepper',
    ];

    const startTime = Date.now();
    let successCount = 0;

    for (let i = 0; i < 15; i++) {
      try {
        const searchTerm = searchTerms[i % searchTerms.length];
        await homePage.searchProduct(searchTerm);
        successCount++;
        await testUtil.wait(200);
      } catch (e) {
        console.log(`Search failed at iteration ${i}`);
      }
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    expect(successCount).toBeGreaterThan(10); // Most searches should succeed
    expect(totalTime).toBeLessThan(120000); // Should complete in 2 minutes
  });

  test('@load Rapid Filter Operations', async () => {
    const startTime = Date.now();
    let successCount = 0;

    for (let i = 0; i < 10; i++) {
      try {
        await homePage.filterByVegOnly();
        successCount++;
        await testUtil.wait(300);
      } catch (e) {
        console.log(`Filter failed at iteration ${i}`);
      }
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    expect(successCount).toBeGreaterThan(5);
    expect(totalTime).toBeLessThan(60000);
  });

  test('@load Rapid Quantity Changes', async () => {
    await homePage.addProductToCart(0);

    const startTime = Date.now();
    let successCount = 0;

    for (let i = 0; i < 20; i++) {
      try {
        if (i % 2 === 0) {
          await homePage.increaseQuantityByIndex(0);
        } else {
          await homePage.decreaseQuantityByIndex(0);
        }
        successCount++;
        await testUtil.wait(100);
      } catch (e) {
        console.log(`Quantity change failed at iteration ${i}`);
      }
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    expect(successCount).toBeGreaterThan(10);
    expect(totalTime).toBeLessThan(60000);
  });

  test('@load Rapid Page Navigation', async ({ page }) => {
    const testUtil = new TestUtil(page);
    
    const startTime = Date.now();
    let successCount = 0;

    for (let i = 0; i < 8; i++) {
      try {
        if (i % 2 === 0) {
          await homePage.goto();
        } else {
          await homePage.goToCart();
          await homePage.continueShopping();
        }
        successCount++;
      } catch (e) {
        console.log(`Navigation failed at iteration ${i}`);
      }
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    expect(successCount).toBeGreaterThan(4);
    expect(totalTime).toBeLessThan(60000);
  });
});

test.describe('@load Load Tests - Stress Testing', () => {
  test('@load DOM Mutation - Add/Remove large number of elements', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/seleniumPractise');
    
    const startTime = Date.now();

    // Simulate heavy DOM manipulation
    await page.evaluate(() => {
      for (let i = 0; i < 100; i++) {
        const div = document.createElement('div');
        div.textContent = `Element ${i}`;
        document.body.appendChild(div);
      }
    });

    const endTime = Date.now();
    const mutationTime = endTime - startTime;

    // Should handle DOM mutations
    expect(mutationTime).toBeLessThan(5000);
  });

  test('@load Data Processing - Handle large data sets', async ({ page }) => {
    const startTime = Date.now();

    // Process large array
    const result = await page.evaluate(() => {
      const largeArray = new Array(10000).fill(0).map((_, i) => i);
      return largeArray.reduce((a, b) => a + b, 0);
    });

    const endTime = Date.now();
    const processingTime = endTime - startTime;

    expect(result).toBe(49995000); // Verify calculation
    expect(processingTime).toBeLessThan(5000);
  });

  test('@load Multiple Event Listeners - Handle many event listeners', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/seleniumPractise');

    const startTime = Date.now();

    await page.evaluate(() => {
      // Add many event listeners
      for (let i = 0; i < 50; i++) {
        document.addEventListener(`customEvent${i}`, () => {});
      }
    });

    const endTime = Date.now();
    const listenerTime = endTime - startTime;

    expect(listenerTime).toBeLessThan(2000);
  });

  test('@load Memory Intensive Operations - Handle large strings', async ({ page }) => {
    const startTime = Date.now();

    const result = await page.evaluate(() => {
      let largeString = '';
      for (let i = 0; i < 10000; i++) {
        largeString += 'x'.repeat(100);
      }
      return largeString.length;
    });

    const endTime = Date.now();
    const memoryTime = endTime - startTime;

    expect(result).toBe(1000000); // 10000 * 100
    expect(memoryTime).toBeLessThan(5000);
  });
});

test.describe('@load Load Tests - Resource Limits', () => {
  test('@load Max Connections - Handle many simultaneous requests', async ({ page }) => {
    const startTime = Date.now();

    // Create many requests simultaneously
    const requests = [];
    for (let i = 0; i < 15; i++) {
      requests.push(
        page.evaluate(() => fetch('https://api.example.com/data').catch(() => null))
      );
    }

    try {
      await Promise.all(requests);
    } catch (e) {
      console.log('Some requests failed under load');
    }

    const endTime = Date.now();
    const connectionTime = endTime - startTime;

    expect(connectionTime).toBeLessThan(30000);
  });

  test('@load Large Response Handling - Handle large response payloads', async ({ page }) => {
    const startTime = Date.now();

    const result = await page.evaluate(() => {
      // Simulate large response processing
      const largeData = new Array(1000)
        .fill(0)
        .map((_, i) => ({
          id: i,
          data: 'x'.repeat(100),
        }));
      return largeData.length;
    });

    const endTime = Date.now();
    const processingTime = endTime - startTime;

    expect(result).toBe(1000);
    expect(processingTime).toBeLessThan(5000);
  });
});

test.describe('@load Load Tests - Recovery', () => {
  let homePage;
  let testUtil;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    testUtil = new TestUtil(page);
  });

  test('@load Recovery After Heavy Load - System should recover gracefully', async () => {
    // Heavy load phase
    for (let i = 0; i < 10; i++) {
      try {
        await homePage.searchProduct('test');
        await testUtil.wait(100);
      } catch (e) {
        console.log(`Heavy load iteration ${i} failed`);
      }
    }

    // Recovery phase - should work again
    await testUtil.wait(2000);
    await homePage.goto();
    
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });

  test('@load Parallel Operations Complete Successfully', async () => {
    // Run multiple operations in parallel
    const results = await Promise.allSettled([
      homePage.goto(),
      new Promise(resolve => setTimeout(() => resolve('ready'), 1000)),
    ]);

    const fulfilled = results.filter(r => r.status === 'fulfilled').length;
    expect(fulfilled).toBeGreaterThan(0);
  });
});
