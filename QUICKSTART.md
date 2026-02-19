# Quick Start Guide

## Installation (2 minutes)

1. **Install dependencies:**
```bash
cd "Sample Playwright project"
npm install
```

2. **Install Playwright browsers:**
```bash
npx playwright install
```

Done! ✅

## Running Your First Test (1 minute)

### Option 1: Run all tests
```bash
npm test
```

### Option 2: Run specific test type
```bash
npm run test:ui-tests          # UI tests only
npm run test:security         # Security tests only
npm run test:accessibility    # Accessibility tests only
```

### Option 3: Run with UI (see what's happening)
```bash
npm run test:ui
```

## 📊 View Results

After tests complete:
```bash
npm run report
```

This opens an HTML report with:
- ✅ Passed tests
- ❌ Failed tests
- ⏱️ Execution time
- 📸 Screenshots
- 🎬 Videos

## 🎯 Common Commands

### Run tests in different browsers
```bash
npm run test:chrome          # Chromium only
npm run test:firefox         # Firefox only
npm run test:webkit          # Safari only
```

### Run in headed mode (see browser)
```bash
npm run test:headed
```

### Debug tests
```bash
npm run test:debug
```

### Run smoke tests only
```bash
npx playwright test --grep @smoke
```

## 📁 Project Structure Quick Reference

```
pages/           → Page Object Models (HomePage, CartPage, etc.)
tests/           → Test files (ui.spec.js, security.spec.js, etc.)
utils/           → Helper classes (PerformanceHelper, SecurityHelper, etc.)
data/            → Test data (testData.json)
.env             → Configuration (BASE_URL, timeouts, etc.)
```

## 🔍 Common Issues & Solutions

### Issue: Tests timeout
**Solution:** Increase timeout in `.env` or `playwright.config.js`
```env
DEFAULT_TIMEOUT=60000
```

### Issue: "Browser not found"
**Solution:** Install browsers
```bash
npx playwright install
```

### Issue: "Cannot find page element"
**Solution:** Check selector in page object, increase wait time
- Verify the website loaded
- Check if selector changed on the website

### Issue: Tests pass locally but fail in CI/CD
**Solution:** Ensure `playwright.config.js` has:
- `workers: 1` for CI mode
- `retries: 2` for flaky tests
- Proper timeouts

## 🚀 Next Steps

1. **Explore test files:** Open `tests/` folder to see test examples
2. **Modify page objects:** Update selectors in `pages/` if website changed
3. **Add custom tests:** Create new `.spec.js` file following existing pattern
4. **Configure environment:** Edit `.env` for your settings
5. **View reports:** Run `npm run report` after tests

## 📚 Test Categories

| Category | Command | What it tests |
|----------|---------|---------------|
| UI | `npm run test:ui-tests` | Pages, buttons, forms |
| Security | `npm run test:security` | XSS, SQL injection, headers |
| Accessibility | `npm run test:accessibility` | WCAG compliance, screen readers |
| Performance | `npm run test:performance` | Page load time, Core Web Vitals |
| Load | `npm run test:load` | Stress testing, concurrent users |
| Checkout | `npm run test:checkout` | Purchase flow, forms |
| Edge Cases | `npm run test:edge-cases` | Boundary conditions, errors |
| Compliance | `npm run test:compliance` | GDPR, PCI-DSS, ADA |

## 💡 Tips

✅ **Run smoke tests regularly** - Quick validation of critical paths
```bash
npx playwright test --grep @smoke
```

✅ **Use headed mode for debugging** - See what the browser is doing
```bash
npm run test:headed
```

✅ **Check reports for failures** - Includes videos and screenshots
```bash
npm run report
```

✅ **Filter by tag for specific testing** - Save time
```bash
npx playwright test --grep @security
```

## 🔧 Customization

### Change base URL
Edit `.env`:
```env
BASE_URL=your-website.com
```

### Change test timeout
Edit `.env`:
```env
DEFAULT_TIMEOUT=30000
```

### Add new page object
1. Create `pages/YourPage.js`
2. Define selectors and methods
3. Use in tests:
```javascript
const yourPage = new YourPage(page);
```

### Add new test file
1. Create `tests/yourFeature.spec.js`
2. Import page objects
3. Write tests with tags:
```javascript
test('@smoke New feature test', async () => {
  // Your test
});
```

## 📖 Documentation

- **Page Objects:** See `pages/` folder comments
- **Utilities:** See `utils/` folder comments
- **Environment:** See `.env` file
- **Config:** See `playwright.config.js`
- **Full README:** See `README.md`

## ✅ Checklist Before Running

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] Playwright browsers installed (`npx playwright install`)
- [ ] `.env` file configured
- [ ] Internet connection available
- [ ] Website is accessible

## 🆘 Need Help?

1. **Check logs:** Look at console output for errors
2. **View reports:** Run `npm run report` for screenshots
3. **Enable debug:** Run `npm run test:debug` to step through
4. **Check GitHub:** Look for similar issues
5. **Read comments:** Code has detailed comments

## 📝 Example Test Run

```bash
# 1. Install dependencies
npm install
npx playwright install

# 2. Configure settings (optional)
# Edit .env if needed

# 3. Run tests
npm test

# 4. View results
npm run report
```

That's it! 🎉

## 🔄 Continuous Integration

For GitHub Actions, GitLab CI, Jenkins, etc.:
```bash
npm install
npx playwright install
npm test
```

Most CI platforms will:
- Install Node.js
- Run `npm install`
- Run `npm test`
- Store test results

---

**Happy Testing! 🚀**

For detailed documentation, see `README.md`
