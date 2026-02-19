# Advanced Configuration Guide

## Environment-Specific Configuration

### Development Environment (.env.dev)
```env
BASE_URL=http://localhost:3000
HEADLESS=false
SLOW_MO=100
DEFAULT_TIMEOUT=30000
ENABLE_SECURITY_TESTS=false
DEBUG=true
```

### Staging Environment (.env.staging)
```env
BASE_URL=https://staging.example.com/seleniumPractise
HEADLESS=true
SLOW_MO=0
DEFAULT_TIMEOUT=30000
ENABLE_SECURITY_TESTS=true
DEBUG=false
```

### Production Environment (.env.prod)
```env
BASE_URL=https://rahulshettyacademy.com/seleniumPractise
HEADLESS=true
SLOW_MO=0
DEFAULT_TIMEOUT=45000
ENABLE_SECURITY_TESTS=true
MAX_RETRIES=3
```

## Performance Tuning

### Fast Test Execution
```javascript
// playwright.config.js
module.exports = {
  fullyParallel: true,
  workers: 8,  // 8 parallel workers
  retries: 0,
  timeout: 30000,
};
```

### Reliable Test Execution
```javascript
// playwright.config.js
module.exports = {
  fullyParallel: false,
  workers: 1,   // Single worker
  retries: 2,   // Retry failed tests
  timeout: 60000,
};
```

### Balanced Approach
```javascript
// playwright.config.js
module.exports = {
  fullyParallel: true,
  workers: 4,   // 4 workers
  retries: 1,   // Single retry
  timeout: 40000,
};
```

## Custom Test Tags

Add your own tags in test names:
```javascript
test('@smoke @critical New feature should work', async () => {
  // This test has multiple tags
});
```

Run by custom tags:
```bash
npx playwright test --grep "@critical"
npx playwright test --grep "@smoke.*@critical"  # Both tags
```

## Reporter Configuration

### Add Custom Reporter
```javascript
// playwright.config.js
module.exports = {
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['list'],
    ['dot'],
  ],
};
```

### Generate Coverage Reports
```bash
npm run test -- --coverage
```

## Network Condition Simulation

### Slow 3G
```javascript
await context.route('**/*', async (route) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  await route.continue();
});
```

### Offline Mode
```javascript
await context.setOffline(true);
// ... test offline behavior ...
await context.setOffline(false);
```

### Specific Route Mocking
```javascript
await page.route('**/api/products', async (route) => {
  await route.abort('failed');
  // or
  await route.fulfill({
    status: 200,
    body: JSON.stringify({ products: [] }),
  });
});
```

## Advanced Assertions

### Custom Assertions
```javascript
expect(value).toBeWithin(min, max);
expect(response).toHaveStatusOK();
expect(text).toMatchPattern(/pattern/);
```

### Soft Assertions (continue on failure)
```javascript
await expect.soft(element).toBeVisible();
await expect.soft(text).toContain('expected');
// Tests continue even if soft assertions fail
```

## Data-Driven Testing

### Create parameterized tests
```javascript
const testCases = [
  { searchTerm: 'Tomato', expectedCount: 5 },
  { searchTerm: 'Broccoli', expectedCount: 3 },
  { searchTerm: 'Cucumber', expectedCount: 4 },
];

testCases.forEach(({ searchTerm, expectedCount }) => {
  test(`Search for ${searchTerm}`, async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.searchProduct(searchTerm);
    const count = await homePage.getProductCount();
    expect(count).toBe(expectedCount);
  });
});
```

## Visual Regression Testing

### Enable Visual Comparisons
```javascript
test('Visual regression - Homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

Update baseline:
```bash
npx playwright test --update-snapshots
```

## API Testing Integration

### Test API alongside UI
```javascript
test('Product API and UI consistency', async ({ page, context }) => {
  // Test API directly
  const response = await context.request.get('/api/products');
  const apiProducts = await response.json();
  
  // Test UI
  const homePage = new HomePage(page);
  await homePage.goto();
  const uiProducts = await homePage.getProducts();
  
  // Assert consistency
  expect(apiProducts.length).toBe(uiProducts.length);
});
```

## Test Fixtures

### Custom Fixtures
```javascript
const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    await use(page);
    
    // Cleanup
    await page.goto('/logout');
  },
});

test('Authenticated user action', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/dashboard');
  expect(await authenticatedPage.title()).toContain('Dashboard');
});
```

## Debugging Techniques

### Debug Single Test
```bash
npx playwright test tests/ui.spec.js -g "Page Load" --debug
```

### Pause Execution
```javascript
test('Debug test', async ({ page }) => {
  await page.pause();  // Execution pauses here
  // Interact in inspector, then resume
});
```

### Log Information
```javascript
test('Test with logs', async ({ page }) => {
  console.log('URL:', page.url());
  console.log('Title:', await page.title());
  page.on('console', msg => console.log(msg.text()));
});
```

### Slow Motion
```javascript
const context = await browser.newContext({
  slowMo: 1000,  // 1 second delay between actions
});
```

## Accessibility Testing Advanced

### Axe Integration
```javascript
import { injectAxe, checkA11y } from 'axe-playwright';

test('Accessibility', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page);
});
```

## CI/CD Integration

### GitHub Actions
See `.github/workflows/playwright.yml`

### Local CI Simulation
```bash
CI=true npm test
```

### Jenkins Integration
```groovy
stage('Run Tests') {
  steps {
    sh 'npm install'
    sh 'npx playwright install'
    sh 'npm test'
  }
}

post {
  always {
    junit 'test-results/junit/results.xml'
    publishHTML([
      reportDir: 'test-results/html',
      reportFiles: 'index.html',
      reportName: 'Playwright Report'
    ])
  }
}
```

## Performance Profiling

### Measure Test Performance
```javascript
test('Performance profiling', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto('/');
  const navigationTime = Date.now() - startTime;
  
  console.log(`Page load time: ${navigationTime}ms`);
  
  const metrics = await page.evaluate(() => {
    const timing = performance.getEntriesByType('navigation')[0];
    return {
      domInteractive: timing.domInteractive - timing.fetchStart,
      loadComplete: timing.loadEventEnd - timing.fetchStart,
    };
  });
  
  console.log('Metrics:', metrics);
});
```

## Memory Management

### Clear Cache Between Tests
```javascript
test.beforeEach(async ({ context }) => {
  await context.clearCookies();
  // Clear local storage
  await context.executionContext?.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});
```

## Flaky Test Handling

### Mark Tests as Flaky
```javascript
test('Potentially flaky test', async ({ page, retry }) => {
  test.skip(retry > 0, 'Flaky on retry');
  // ... test code ...
});
```

### Retry Failed Tests
```javascript
// playwright.config.js
module.exports = {
  retries: process.env.CI ? 2 : 0,
};
```

## Report Generation

### HTML Report
```bash
npx playwright show-report
```

### JSON Report Analysis
```bash
node -e "
const fs = require('fs');
const report = JSON.parse(fs.readFileSync('test-results/json/results.json'));
console.log(JSON.stringify({
  total: report.stats.expected + report.stats.unexpected,
  passed: report.stats.expected,
  failed: report.stats.unexpected,
}, null, 2));
"
```

## Environment Variables

### Secure Secrets
```bash
# Never commit passwords/keys
npm test -- --grep @smoke
```

Use GitHub Secrets for CI:
```yaml
- name: Run tests
  env:
    API_KEY: ${{ secrets.API_KEY }}
    TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
  run: npm test
```

## Best Practices Checklist

- ✅ Use Page Object Model pattern
- ✅ Add explicit waits, not sleep
- ✅ Use tags for test categorization
- ✅ Implement proper error handling
- ✅ Keep tests independent
- ✅ Use test data factories
- ✅ Enable detailed reporting
- ✅ Configure retry logic
- ✅ Implement health checks
- ✅ Document test purposes
- ✅ Review and update selectors regularly
- ✅ Use data-driven testing for variations
- ✅ Monitor test performance
- ✅ Maintain test isolation
- ✅ Use version control

## Troubleshooting

### Tests timeout in CI
```javascript
// Increase timeout in CI
timeout: process.env.CI ? 60000 : 30000
```

### Flaky network tests
```javascript
// Implement retry logic
const MAX_RETRIES = 3;
for (let i = 0; i < MAX_RETRIES; i++) {
  try {
    await action();
    break;
  } catch (e) {
    if (i === MAX_RETRIES - 1) throw e;
    await page.waitForTimeout(1000 * (i + 1));
  }
}
```

### Element not found
```javascript
// Add better waits
await page.waitForLoadState('networkidle');
await page.locator(selector).waitFor({ state: 'visible' });
```

## Resources

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Test Configuration Guide](https://playwright.dev/docs/test-configuration)
- [CI/CD Integration](https://playwright.dev/docs/ci)

---

Last Updated: February 2026
