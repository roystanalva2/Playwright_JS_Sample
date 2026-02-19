/**
 * Test Data Factory
 * Generates and manages test data for various scenarios
 */
const fs = require('fs');
const path = require('path');

class TestDataFactory {
  constructor() {
    this.testDataPath = path.join(__dirname, '../data/testData.json');
    this.loadTestData();
  }

  /**
   * Load test data from JSON file
   */
  loadTestData() {
    try {
      const data = fs.readFileSync(this.testDataPath, 'utf8');
      this.data = JSON.parse(data);
    } catch (error) {
      console.log('Could not load test data:', error);
      this.data = {};
    }
  }

  /**
   * Get valid user data
   */
  getValidUser(index = 0) {
    return this.data.validUsers?.[index] || this.generateRandomUser('valid');
  }

  /**
   * Get all valid users
   */
  getAllValidUsers() {
    return this.data.validUsers || [];
  }

  /**
   * Get invalid user data
   */
  getInvalidUser(index = 0) {
    return this.data.invalidUsers?.[index] || this.generateRandomUser('invalid');
  }

  /**
   * Get all invalid users
   */
  getAllInvalidUsers() {
    return this.data.invalidUsers || [];
  }

  /**
   * Generate random user
   */
  generateRandomUser(type = 'valid') {
    const firstNames = ['John', 'Jane', 'Robert', 'Mary', 'Michael', 'Patricia'];
    const lastNames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones'];
    const states = ['California', 'New York', 'Texas', 'Florida', 'Illinois'];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const phone = Math.random().toString().slice(2, 12);
    const address = `${Math.floor(Math.random() * 999) + 1} Main Street`;
    const zipCode = Math.random().toString().slice(2, 7);
    const state = states[Math.floor(Math.random() * states.length)];

    return {
      firstName,
      lastName,
      email,
      phone,
      address,
      country: 'USA',
      state,
      zipCode,
    };
  }

  /**
   * Get search term
   */
  getSearchTerm(index = 0) {
    return this.data.searchTerms?.[index] || 'Tomato';
  }

  /**
   * Get all search terms
   */
  getAllSearchTerms() {
    return this.data.searchTerms || [];
  }

  /**
   * Get random search term
   */
  getRandomSearchTerm() {
    const terms = this.data.searchTerms || [];
    return terms[Math.floor(Math.random() * terms.length)];
  }

  /**
   * Get promo code
   */
  getPromoCode(index = 0) {
    return this.data.promoCodes?.[index] || { code: 'SAVE10', discount: 10 };
  }

  /**
   * Get all promo codes
   */
  getAllPromoCodes() {
    return this.data.promoCodes || [];
  }

  /**
   * Get payment method
   */
  getPaymentMethod(index = 0) {
    return this.data.paymentMethods?.[index] || this.generateCreditCard();
  }

  /**
   * Get all payment methods
   */
  getAllPaymentMethods() {
    return this.data.paymentMethods || [];
  }

  /**
   * Generate credit card data
   */
  generateCreditCard() {
    return {
      cardNumber: '4111111111111111',
      expiry: '12/25',
      cvv: Math.random().toString().slice(2, 5),
    };
  }

  /**
   * Generate invalid email
   */
  generateInvalidEmail() {
    const invalidEmails = [
      'test',
      'test@',
      '@example.com',
      'test @example.com',
      'test@example',
      'test..test@example.com',
    ];
    return invalidEmails[Math.floor(Math.random() * invalidEmails.length)];
  }

  /**
   * Generate invalid phone number
   */
  generateInvalidPhone() {
    const invalidPhones = ['123', 'abc', '!@#$%', '12', ''];
    return invalidPhones[Math.floor(Math.random() * invalidPhones.length)];
  }

  /**
   * Generate XSS payload
   */
  generateXSSPayload() {
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '"><script>alert("XSS")</script>',
      "<img src=x onerror='alert(\"XSS\")'>",
      '<svg/onload=alert("XSS")>',
      'javascript:alert("XSS")',
    ];
    return xssPayloads[Math.floor(Math.random() * xssPayloads.length)];
  }

  /**
   * Generate SQL injection payload
   */
  generateSQLInjectionPayload() {
    const sqlPayloads = [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "' UNION SELECT NULL, NULL, NULL --",
      "1' AND '1'='1",
      'admin/',
    ];
    return sqlPayloads[Math.floor(Math.random() * sqlPayloads.length)];
  }

  /**
   * Generate long string
   */
  generateLongString(length = 1000) {
    return 'a'.repeat(length);
  }

  /**
   * Generate special characters string
   */
  generateSpecialCharacters() {
    return '!@#$%^&*()_+-=[]{}|;:\'",.<>?/~`';
  }

  /**
   * Generate bulk user data
   */
  generateBulkUsers(count = 10) {
    const users = [];
    for (let i = 0; i < count; i++) {
      users.push(this.generateRandomUser('valid'));
    }
    return users;
  }

  /**
   * Export test data as JSON
   */
  exportAsJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  /**
   * Create complex test scenario
   */
  createCheckoutScenario() {
    return {
      user: this.getValidUser(0),
      paymentMethod: this.getPaymentMethod(0),
      promoCode: this.getPromoCode(0),
      searchItems: this.getAllSearchTerms().slice(0, 3),
    };
  }

  /**
   * Create security test scenario
   */
  createSecurityTestScenario() {
    return {
      xssPayloads: [
        '<script>alert("XSS")</script>',
        '"><script>alert("XSS")</script>',
        "<img src=x onerror='alert(\"XSS\")'>",
      ],
      sqlPayloads: [
        "' OR '1'='1",
        "'; DROP TABLE users; --",
        "' UNION SELECT NULL, NULL, NULL --",
      ],
      invalidInputs: [
        this.generateInvalidEmail(),
        this.generateInvalidPhone(),
        this.generateLongString(500),
      ],
    };
  }
}

module.exports = TestDataFactory;
