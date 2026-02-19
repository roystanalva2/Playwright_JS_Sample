# Playwright JavaScript POM Framework - Rahul Shetty Academy

[![Playwright Tests](https://github.com/roystanalva2/Playwright_JS_Sample/actions/workflows/playwright-tests.yml/badge.svg)](https://github.com/roystanalva2/Playwright_JS_Sample/actions/workflows/playwright-tests.yml)

A comprehensive Playwright JavaScript testing framework for [Rahul Shetty Academy Selenium Practice](https://rahulshettyacademy.com/seleniumPractise) covering all types of testing scenarios.

## 📋 Overview

This framework provides complete test coverage for:
- **UI Testing** - User interface elements, visibility, interactions
- **Edge Cases** - Boundary conditions, error handling, unusual scenarios
- **Performance Testing** - Page load times, Core Web Vitals, network metrics
- **Load Testing** - Concurrent users, stress testing, system recovery
- **Checkout Testing** - Complete purchase flow, payment processing
- **Security Testing** - XSS, SQL injection, CSRF, sensitive data exposure
- **Accessibility Testing** - WCAG 2.1 compliance, screen reader support
- **Compliance Testing** - GDPR, PCI-DSS, CCPA, HIPAA, ADA, COPPA, SOC2

## 🏗️ Project Structure

```
playwright-pom-framework/
├── pages/                      # Page Object Models
│   ├── HomePage.js            # Homepage with product listing
│   ├── CartPage.js            # Shopping cart functionality
│   ├── CheckoutPage.js        # Checkout form and payment
│   └── LoginPage.js           # Login/Authentication
├── tests/                      # Test suites
│   ├── ui.spec.js             # UI testing
│   ├── edge-cases.spec.js     # Edge case testing
│   ├── performance.spec.js    # Performance testing
│   ├── load.spec.js           # Load/Stress testing
│   ├── checkout.spec.js       # Checkout flow testing
│   ├── security.spec.js       # Security testing
│   ├── accessibility.spec.js  # Accessibility testing
│   └── compliance.spec.js     # Compliance testing
├── utils/                     # Utility helpers
│   ├── TestUtil.js           # Common test utilities
│   ├── PerformanceHelper.js  # Performance metrics
│   ├── AccessibilityHelper.js # WCAG accessibility checks
│   ├── SecurityHelper.js      # Security vulnerabilities
│   └── ComplianceHelper.js   # Regulatory compliance
├── data/                      # Test data
│   └── testData.json         # User data, search terms, etc.
├── playwright.config.js       # Playwright configuration
├── package.json              # Dependencies and scripts
├── .env                       # Environment variables
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or setup the project:**
```bash
cd "Sample Playwright project"
npm install
```

2. **Install Playwright browsers:**
```bash
npx playwright install
```

3. **Configure environment variables:**
Edit `.env` file with your settings:
```env
BASE_URL=https://rahulshettyacademy.com/seleniumPractise
LOAD_TIME_THRESHOLD=3000
API_RESPONSE_THRESHOLD=2000
HEADLESS=true
```

## 📝 Running Tests

### Run all tests
```bash
npm test
```

### Run tests by category

```bash
# UI Tests
npm run test:ui-tests

# Edge Case Tests
npm run test:edge-cases

# Performance Tests
npm run test:performance

# Load Tests
npm run test:load

# Checkout Tests
npm run test:checkout

# Security Tests
npm run test:security

# Accessibility Tests
npm run test:accessibility

# Compliance Tests
npm run test:compliance
```

### Run tests by browser
```bash
npm run test:chrome
npm run test:firefox
npm run test:webkit
```

### Run in headed mode (see browser)
```bash
npm run test:headed
```

### Run with UI mode
```bash
npm run test:ui
```

### Run in debug mode
```bash
npm run test:debug
```

### View test reports
```bash
npm run report
```

## 📊 Test Coverage

### UI Tests (24 tests)
- Page load verification
- Product display and visibility
- Search functionality
- Add to cart operations
- Filter functionality
- Cart navigation
- Responsive design
- Button states

### Edge Cases (27 tests)
- Boundary conditions
- Invalid inputs
- SQL injection attempts
- XSS payload handling
- Large data handling
- Rapid operations
- Cart edge cases
- Form validation edge cases

### Performance Tests (22 tests)
- Page load time measurement
- Core Web Vitals tracking
- API response time monitoring
- JavaScript execution efficiency
- Layout shift detection
- Network condition handling
- Memory leak detection
- Search and filter performance

### Load Tests (24 tests)
- Concurrent user simulation
- Sequential operation handling
- High-volume interactions
- Stress testing
- DOM mutation handling
- Resource limit testing
- System recovery testing

### Checkout Tests (32 tests)
- Complete checkout flow
- Form validation
- Payment method selection
- Promo code application
- Order summary display
- Session persistence
- Security in checkout

### Security Tests (27 tests)
- Security header validation
- XSS vulnerability detection
- SQL injection testing
- CSRF protection verification
- Sensitive data exposure
- Cookie security
- Input validation
- Password strength
- Authentication bypass testing
- Comprehensive security reporting

### Accessibility Tests (33 tests)
- Image alt text verification
- Form label validation
- Heading hierarchy
- Keyboard navigation
- ARIA attributes
- Color contrast
- Text readability
- Screen reader support
- WCAG 2.1 compliance
- Mobile accessibility

### Compliance Tests (28 tests)
- GDPR compliance
- PCI-DSS requirements
- CCPA compliance
- HIPAA requirements
- ADA compliance
- COPPA compliance
- SOC 2 compliance
- Data retention policies

## 🔧 Page Object Models

### HomePage
```javascript
const homePage = new HomePage(page);
await homePage.goto();
await homePage.searchProduct('Tomato');
await homePage.addProductToCart(0);
const productCount = await homePage.getProductCount();
```

### CartPage
```javascript
const cartPage = new CartPage(page);
const items = await cartPage.getCartItems();
const subtotal = await cartPage.getSubtotal();
await cartPage.proceedToCheckout();
```

### CheckoutPage
```javascript
const checkoutPage = new CheckoutPage(page);
await checkoutPage.fillCheckoutForm(userData);
await checkoutPage.acceptTerms();
await checkoutPage.applyPromoCode('SAVE10');
```

### LoginPage
```javascript
const loginPage = new LoginPage(page);
const time = await loginPage.login('username', 'password');
await loginPage.clickForgotPassword();
```

## 🔍 Utility Helpers

### TestUtil
Common testing utilities for navigation, event handling, and utilities

```javascript
const testUtil = new TestUtil(page);
await testUtil.waitForElement(selector);
await testUtil.takeScreenshot('filename');
const text = await testUtil.getElementText(selector);
```

### PerformanceHelper
Performance metrics and Web Vitals measurement

```javascript
const perfHelper = new PerformanceHelper(page);
const timing = await perfHelper.measurePageLoadTime();
const vitals = await perfHelper.getCoreWebVitals();
const pageSize = await perfHelper.getPageSize();
```

### AccessibilityHelper
WCAG 2.1 compliance and accessibility verification

```javascript
const a11yHelper = new AccessibilityHelper(page);
const violations = await a11yHelper.getAccessibilityViolations();
const report = await a11yHelper.getFullAccessibilityReport();
```

### SecurityHelper
Security vulnerability testing

```javascript
const secHelper = new SecurityHelper(page);
const headers = await secHelper.checkSecurityHeaders();
const report = await secHelper.getSecurityReport();
```

### ComplianceHelper
Regulatory compliance checking

```javascript
const compHelper = new ComplianceHelper(page);
const gdprCheck = await compHelper.checkGDPRCompliance();
const fullReport = await compHelper.getComplianceReport();
```

## 📈 Test Tags

Tests are organized with tags for easy filtering:

- `@ui` - UI tests
- `@edge-cases` - Edge case tests
- `@performance` - Performance tests
- `@load` - Load/stress tests
- `@checkout` - Checkout tests
- `@security` - Security tests
- `@accessibility` - Accessibility tests
- `@compliance` - Compliance tests
- `@smoke` - Quick smoke tests

Run tests by tag:
```bash
npx playwright test --grep @ui
npx playwright test --grep @security
```

## 🌐 Browser Coverage

Framework is tested against:
- Chromium
- Firefox
- WebKit (Safari)
- Mobile Chrome
- Mobile Safari

Configure in `playwright.config.js`

## 📱 Responsive Testing

Tests include viewport testing for:
- Mobile (375x667)
- Tablet (768x1024)
- Desktop (1920x1080)

## 🔐 Security Best Practices

- Tests validate HTTPS usage
- Security headers verification
- XSS and SQL injection detection
- Sensitive data exposure checking
- Cookie security validation
- Input sanitization verification

## ♿ Accessibility Standards

Framework verifies compliance with:
- WCAG 2.1 Level A & AA
- Keyboard navigation
- Screen reader support
- Color contrast
- Alt text for images
- Form labels and ARIA attributes

## 📋 Configuration

### playwright.config.js
- Timeout settings
- Reporter configuration
- Browser configuration
- Parallel execution settings

### .env Variables
- `BASE_URL` - Application URL
- `LOAD_TIME_THRESHOLD` - Performance threshold
- `HEADLESS` - Run in headless mode
- `DEFAULT_TIMEOUT` - Action timeout

## 📊 Reports

After running tests:
- HTML Report: `test-results/html/index.html`
- JSON Report: `test-results/json/results.json`
- JUnit Report: `test-results/junit/results.xml`

View reports:
```bash
npm run report
```

## 🎯 Best Practices

1. **Use Page Objects** - Maintain tests in POM structure
2. **Explicit Waits** - Use `waitForLoadState('networkidle')`
3. **Error Handling** - Try-catch blocks for non-critical operations
4. **Test Data** - Use test data from `data/testData.json`
5. **Assertions** - Use descriptive assertion messages
6. **Tags** - Always tag tests for easy filtering

## 🐛 Debugging

### Run single test
```bash
npx playwright test tests/ui.spec.js -g "Should display products"
```

### Debug mode
```bash
npx playwright test --debug
```

### View test results
```bash
npx playwright show-report
```

### Trace viewer
Enable in config and view traces:
```bash
npx playwright show-trace test-results/trace.zip
```

## 🤝 Contributing

When adding new tests:
1. Follow POM pattern
2. Add appropriate tags
3. Use descriptive test names
4. Include error handling
5. Update this README

## ⚠️ Notes

- Some tests may timeout on slow networks
- Adjust timeouts in `.env` for your environment
- Some compliance features require manual verification
- Security tests are for demonstration purposes

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [GDPR Compliance](https://gdpr-info.eu/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## 📝 License

This framework is provided as-is for educational purposes.

## 📧 Support

For issues or questions:
1. Check test logs and reports
2. Review browser console for errors
3. Enable trace collection for debugging
4. Check network conditions settings

---

**Last Updated:** February 2026
