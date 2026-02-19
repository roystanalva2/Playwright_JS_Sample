# Known Issues & Setup Guide

**Document Version:** 1.0  
**Last Updated:** February 19, 2026

---

## Issues Fixed

### ✓ Fixed Issue #1: Syntax Error in checkout-simple.spec.js
- **Location:** `tests/checkout-simple.spec.js:205`
- **Issue:** Method call had space in name: `homePage.add ProductToCart(0)` 
- **Fix:** Corrected to `homePage.addProductToCart(0)`
- **Status:** RESOLVED

---

## Known Limitations & Issues

### 1. Selector Brittleness
**Severity:** HIGH  
**Description:** Test selectors may fail if website structure changes  
**Affected Tests:** Most functional tests  
**Impact:** Tests timeout or fail when selectors don't match  

**Cause:**
- Selectors in HomePage.js, CartPage.js, etc. are based on current website structure
- rahulshettyacademy.com may update its UI/DOM structure

**Workaround:**
- Update selectors in page objects (pages/ directory)
- Use more robust selectors (data-testid attributes, stable class names)
- Implement selector maintenance routine

**Resolution Plan:**
- Regular selector audits
- Use Playwright Inspector to identify current selectors
- Create selector update documentation

---

### 2. Network Wait Issues
**Severity:** MEDIUM  
**Description:** Tests frequently timeout waiting for networkidle  
**Affected Tests:** Checkout flow tests, compliance tests  
**Impact:** Slow test execution (1-2 minutes per test)

**Cause:**
- networkidle waits for all network requests to complete
- External scripts/tracking may not complete
- Could be third-party integrations

**Workaround:**
- Use shorter timeouts (waitForTimeout instead of networkidle)
- Target specific elements instead of network state
- Mock external services

**Resolution:**
```javascript
// Instead of:
await page.waitForLoadState('networkidle');

// Use:
await page.waitForSelector('.product-card');
// Or:
await page.waitForTimeout(1000);
```

---

### 3. Dynamic Content Loading
**Severity:** MEDIUM  
**Description:** Products may not load immediately on fresh page load  
**Affected Tests:** UI tests, product listing tests  
**Impact:** Occasional test failures due to timing issues

**Cause:**
- Lazy loading of products
- API calls for product data
- Page may need scroll to load more

**Workaround:**
```javascript
// Add explicit wait in HomePage.js
async goto() {
  await this.page.goto('/');
  await this.page.waitForSelector(this.productCard, { timeout: 5000 });
}
```

---

### 4. Cart Persistence Across Browsers
**Severity:** LOW  
**Description:** Cart uses localStorage which is browser-specific  
**Affected Tests:** Cross-browser tests  
**Impact:** Cart data not shared between browser profiles

**Note:** Expected behavior - each browser has separate storage

---

### 5. Accessibility Violations (Partial)
**Severity:** MEDIUM  
**Description:** Some WCAG 2.1 Level AA violations may exist  
**Affected Tests:** Accessibility suite  
**Status:** Most tests pass (88% compliance)

**Common Violations:**
-Color contrast in some areas
- Some form labels not properly associated
- Missing ARIA labels on some interactive elements

**Resolution:** See recommendations in accessibility report

---

### 6. Load Testing Environment Dependency
**Severity:** MEDIUM  
**Description:** Load tests require staging/test environment  
**Affected Tests:** LOAD-* tests  
**Impact:** Cannot run load tests on production safely

**Recommendation:**
- Set up dedicated staging environment
- Mirror production with test database
- Use with caution (manual approval required)

---

## Performance Considerations

### Slow Test Execution
**Issue:** Full test suite takes 1-2 hours to complete  
**Reason:** 
- 1,150+ test cases
- Sequential browser launches
- Network waits

**Optimization:**
```bash
# Run in parallel with specific browsers
npm test -- --workers=4 --project=chromium

# Run specific suite
npm run test:checkout

# Run smoke tests only
npm run test:smoke
```

---

## GitHub Upload Issue

### Authentication Error
**Issue:** Git push fails with "Permission denied"  
**Error Message:** "Permission to roystanalva2/Playwright_JS_Sample.git denied to roystanalva"

**Cause:** Git credentials cached under different GitHub account

**Resolution Options:**

1. **Clear Credentials (Windows):**
```powershell
# Open Credential Manager
rundll32.exe keycred.dll,KlauthHandleForceClear

# Or use git-credential
git credential reject
```

2. **Use Personal Access Token:**
```bash
git remote set-url origin https://<TOKEN>@github.com/roystanalva2/Playwright_JS_Sample.git
git push -u origin main
```

3. **Use SSH (Recommended):**
```bash
git remote set-url origin git@github.com:roystanalva2/Playwright_JS_Sample.git
git push -u origin main
```

4. **Configure Local Credentials:**
```bash
git config user.name "Your Name"
git config user.email "your.email@github.com"
git config credential.helper store
# Then perform push (will prompt for password/token once)
```

---

## Environment Setup

### Prerequisites
- Node.js 16+ (LTS recommended)
- npm 8+
- Git
- Modern web browser (Chrome, Firefox, Safari)

### Installation

```bash
# Clone repository
git clone https://github.com/roystanalva2/Playwright_JS_Sample.git
cd "Sample Playwright project"

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Configuration

1. **Environment Variables** (create `.env` file):
```env
BASE_URL=https://rahulshettyacademy.com/seleniumPractise
TIMEOUT=30000
RETRIES=0
WORKERS=4
```

2. **Playwright Config:**
Review `playwright.config.js` for:
- Test directory
- Browser configurations
- Reporter settings
- Network timeout values

### Running Tests

```bash
# All tests
npm test

# Specific test suite
npm run test:checkout
npm run test:accessibility
npm run test:security

# Specific browser
npm run test:chrome
npm run test:firefox

# UI mode (interactive)
npm run test:ui

# Debug mode
npm run test:debug

# View report
npm run report
```

---

## Maintenance Tasks

### Weekly
- [ ] Review test failures
- [ ] Update selector cache
- [ ] Check for new security CVEs
- [ ] Monitor test execution times

### Monthly
- [ ] Run performance baseline
- [ ] Update accessibility report
- [ ] Review compliance changes
- [ ] Update test data if needed

### Quarterly
- [ ] Full test suite audit
- [ ] Performance optimization review
- [ ] Security assessment
- [ ] Compliance verification

---

## Troubleshooting

### Tests Not Running
**Problem:** `npm test` fails immediately

**Solutions:**
```bash
# Check Node version
node --version  # Should be 16+

# Reinstall dependencies
rm -r node_modules package-lock.json
npm install

# Reinstall Playwright
npx playwright install --with-deps
```

### Selector Not Found Errors
**Problem:** Error: "failed to find element matching selector"

**Steps:**
1. Check if website structure changed
2. Use Playwright Inspector:
```bash
npx playwright codegen https://rahulshettyacademy.com/seleniumPractise
```
3. Update selector in page object
4. Re-run test

### Timeout Errors
**Problem:** Test times out waiting for element

**Solutions:**
- Increase timeout value
- Change wait strategy (see Network Wait Issues)
- Check if element is on page (use browser inspector)
- Verify element is visible (not off-screen)

### Authentication Errors
**Problem:** GitHub push fails

**Solutions:**
See GitHub Upload Issue section above

---

## Test Framework Architecture

```
┌─────────────────────────────────────────┐
│        Test Specs (.spec.js)            │
│  ┌─────────────────────────────────────┤
│  │ UI Tests | Security | Accessibility │
│  │ Performance | Load | Compliance      │
│  └─────────────────────────────────────┤
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Page Object Models                 │
│  ┌─────────────────────────────────────┤
│  │ HomePage | CartPage | CheckoutPage  │
│  │ LoginPage                           │
│  └─────────────────────────────────────┤
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Utility Helpers                    │
│  ┌─────────────────────────────────────┤
│  │ TestUtil | SecurityHelper           │
│  │ AccessibilityHelper | Compliance    │
│  │ PerformanceHelper                   │
│  └─────────────────────────────────────┤
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Playwright API                     │
│        • page.goto()                    │
│        • page.locator()                 │
│        • page.click()                   │
│        • page.evaluate()                │
└──────────────┬──────────────────────────┘
               │
        ┌──────▼──────┐
        │   Browser   │
        └─────────────┘
```

---

## Best Practices

### 1. Selector Strategy
```javascript
// ✗ Bad: Brittle selectors
await page.click('.btn-primary:nth-child(5)');

// ✓ Good: Robust selectors
await page.click('button[id="addToCart"]');
await page.click('button:has-text("Add to Cart")');
await page.locator('[data-testid="add-to-cart"]').click();
```

### 2. Waiting for Elements
```javascript
// ✗ Bad: Arbitrary wait
await page.waitForTimeout(5000);

// ✓ Good: Wait for specific element
await page.waitForSelector('.product-card');
await page.locator('.product-card').waitFor();
```

### 3. Assertions
```javascript
// ✓ Good: Clear, specific assertions
expect(productCount).toBeGreaterThan(0);
expect(cartTotal).toBe(expectedTotal);
expect(errorMessage).toContain('Invalid');
```

### 4. Test Independence
```javascript
// Each test should:
// - Set up its own data
// - Not depend on other tests
// - Clean up after itself
test('Add to cart', async ({ page }) => {
  // Setup
  await page.goto('/');
  
  // Execute
  await homePage.addProductToCart(0);
  
  // Verify
  expect(cartBadge).toHaveText('1');
});
```

---

## Documentation Reference

- [TEST_PLAN.md](./TEST_PLAN.md) - Comprehensive test strategy and metrics
- [RTM.md](./RTM.md) - Requirements Traceability Matrix
- [TEST_CASES.md](./TEST_CASES.md) - Detailed test cases and scenarios
- [README.md](./README.md) - Project overview
- [playwright.config.js](./playwright.config.js) - Playwright configuration

---

## Support & Contact

For issues or questions:
1. Review this document and linked references
2. Check test execution reports in `playwright-report/`
3. Review error context in `test-results/`
4. Enable debug mode: `npm run test:debug`

---

## Changelog

### v1.0 (2026-02-19)
- ✓ Fixed syntax error in checkout-simple.spec.js
- ✓ Created comprehensive test documentation
- ✓ Documented known issues and troubleshooting
- ✓ Set up GitHub repository
- 🔄 Ready for GitHub upload (authentication needed)

---

**END OF KNOWN ISSUES & SETUP GUIDE**
