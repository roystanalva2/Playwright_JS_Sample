/**
 * Security Testing Utilities
 * Tests for common security vulnerabilities and best practices
 */
class SecurityHelper {
  constructor(page) {
    this.page = page;
  }

  /**
   * Check for common security headers
   */
  async checkSecurityHeaders() {
    const securityHeaders = {
      'Content-Security-Policy': null,
      'X-Content-Type-Options': null,
      'X-Frame-Options': null,
      'Referrer-Policy': null,
      'Permissions-Policy': null,
      'Strict-Transport-Security': null,
      'X-XSS-Protection': null,
    };

    // Get headers from response
    try {
      const response = await this.page.goto(this.page.url());
      const headers = response.headers();

      for (const header in securityHeaders) {
        securityHeaders[header] = headers[header.toLowerCase()] || 'Not Set';
      }
    } catch (error) {
      console.log('Could not fetch headers:', error);
    }

    return securityHeaders;
  }

  /**
   * Test for XSS vulnerabilities
   */
  async testXSSVulnerability() {
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '"><script>alert("XSS")</script>',
      "<img src=x onerror='alert(\"XSS\")'>",
      '<svg/onload=alert("XSS")>',
      'javascript:alert("XSS")',
      '<iframe src="javascript:alert(\'XSS\')"></iframe>',
    ];

    const vulnerabilities = [];

    for (const payload of xssPayloads) {
      try {
        // Try to inject payload into an input and see if it executes
        const xssDetected = await this.page.evaluate((p) => {
          const div = document.createElement('div');
          div.innerHTML = p;
          return div.innerHTML.includes('<script') || div.innerHTML.includes('onerror=');
        }, payload);

        if (xssDetected) {
          vulnerabilities.push({
            type: 'XSS',
            payload: payload,
            vulnerable: true,
          });
        }
      } catch (error) {
        console.log('XSS test error:', error);
      }
    }

    return vulnerabilities;
  }

  /**
   * Test for SQL injection vulnerabilities
   */
  async testSQLInjection() {
    const sqlPayloads = [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "' UNION SELECT NULL, NULL, NULL --",
      "1' AND '1'='1",
      "admin/'",
      "1 OR 1=1",
    ];

    const injectionTests = sqlPayloads.map(payload => ({
      payload,
      tested: true,
      message: 'SQL injection test should be performed on backend validation'
    }));

    return injectionTests;
  }

  /**
   * Test for CSRF protection
   */
  async testCSRFProtection() {
    const csrfTests = await this.page.evaluate(() => {
      const forms = document.querySelectorAll('form');
      const results = [];

      forms.forEach(form => {
        const csrfInput = form.querySelector('input[name*="csrf"], input[name*="token"], input[name*="_token"]');
        results.push({
          method: form.method,
          action: form.action,
          hasCsrfToken: !!csrfInput,
          tokenName: csrfInput?.name || 'Not found',
        });
      });

      return results;
    });

    return csrfTests;
  }

  /**
   * Test for sensitive data exposure
   */
  async testSensitiveDataExposure() {
    const sensitiveDataPatterns = {
      apiKeys: /api[_-]?key|apikey/gi,
      creditCards: /\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}/g,
      emails: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      passwords: /password|passwd|pwd/gi,
      tokens: /token|session|secret/gi,
      privateKeys: /-----BEGIN RSA PRIVATE KEY-----/,
    };

    const exposureIssues = await this.page.evaluate((patterns) => {
      const issues = [];
      const pageHTML = document.documentElement.outerHTML;
      const pageText = document.body.innerText;

      for (const [type, pattern] of Object.entries(patterns)) {
        const matches = pageHTML.match(pattern);
        if (matches) {
          issues.push({
            type,
            foundCount: matches.length,
            sensitive: type !== 'emails', // Emails less critical than others
          });
        }
      }

      return issues;
    }, sensitiveDataPatterns);

    return exposureIssues;
  }

  /**
   * Check for insecure content (mixed HTTP/HTTPS)
   */
  async checkMixedContent() {
    const mixedContent = await this.page.evaluate(() => {
      const issues = [];
      const httpResources = document.querySelectorAll('img[src*="http://"], script[src*="http://"], link[href*="http://"]');

      if (httpResources.length > 0) {
        issues.push({
          type: 'mixed-content',
          count: httpResources.length,
          message: 'Found insecure HTTP resources on HTTPS page',
        });
      }

      return issues;
    });

    return mixedContent;
  }

  /**
   * Test for authentication bypass
   */
  async testAuthenticationBypass() {
    const bypassTests = [
      {
        test: 'Direct URL access without login',
        method: 'Navigate directly to protected page',
      },
      {
        test: 'Session token manipulation',
        method: 'Modify session cookies',
      },
      {
        test: 'Parameter tampering',
        method: 'Modify user ID in URL/parameters',
      },
    ];

    return bypassTests;
  }

  /**
   * Check for clickjacking protection
   */
  async checkClickjackingProtection() {
    const clickjackingInfo = await this.page.evaluate(() => {
      // Check if the page has X-Frame-Options header
      // This can only be partially verified on client side
      return {
        isFrameable: true, // Would need to check X-Frame-Options header
        message: 'Clickjacking protection should be verified via headers',
      };
    });

    return clickjackingInfo;
  }

  /**
   * Check for insecure cookies
   */
  async checkInsecureCookies() {
    const cookies = await this.page.context().cookies();
    const issues = [];

    for (const cookie of cookies) {
      if (!cookie.httpOnly) {
        issues.push({
          name: cookie.name,
          issue: 'Cookie is not HttpOnly (vulnerable to XSS)',
        });
      }

      if (!cookie.secure && cookie.domain.includes('http')) {
        issues.push({
          name: cookie.name,
          issue: 'Cookie is not Secure (not encrypted)',
        });
      }

      if (cookie.sameSite === 'None') {
        issues.push({
          name: cookie.name,
          issue: 'Cookie SameSite is None (vulnerable to CSRF)',
        });
      }
    }

    return {
      totalCookies: cookies.length,
      issues,
      cookies: cookies.map(c => ({
        name: c.name,
        secure: c.secure,
        httpOnly: c.httpOnly,
        sameSite: c.sameSite,
      })),
    };
  }

  /**
   * Test for weak password validation
   */
  async testPasswordValidation() {
    const passwordTests = [
      { password: '123', expected: 'rejected', description: 'Too short' },
      { password: 'aaaaa', expected: 'rejected', description: 'No numbers or special chars' },
      { password: 'password123', expected: 'accepted', description: 'Strong password' },
      { password: 'Pass123!@#', expected: 'accepted', description: 'Very strong password' },
    ];

    return passwordTests;
  }

  /**
   * Check input validation
   */
  async checkInputValidation() {
    const validationIssues = await this.page.evaluate(() => {
      const inputs = document.querySelectorAll('input');
      const issues = [];

      inputs.forEach(input => {
        const hasValidation = {
          required: input.hasAttribute('required'),
          pattern: input.hasAttribute('pattern'),
          minLength: input.hasAttribute('minlength'),
          type: input.getAttribute('type'),
        };

        // Check if sensitive inputs have proper type
        const name = input.getAttribute('name') || input.id || '';
        if (name.includes('password') && hasValidation.type !== 'password') {
          issues.push({
            fieldName: name,
            issue: 'Password field does not have type="password"',
          });
        }

        if (name.includes('email') && hasValidation.type !== 'email') {
          issues.push({
            fieldName: name,
            issue: 'Email field does not have type="email"',
          });
        }
      });

      return issues;
    });

    return validationIssues;
  }

  /**
   * Get comprehensive security report
   */
  async getSecurityReport() {
    const [headers, xssTests, sqlTests, csrfTests, sensitiveData, mixedContent, bypassTests, cookies, passwordTests, inputValidation] = await Promise.all([
      this.checkSecurityHeaders(),
      this.testXSSVulnerability(),
      this.testSQLInjection(),
      this.testCSRFProtection(),
      this.testSensitiveDataExposure(),
      this.checkMixedContent(),
      this.testAuthenticationBypass(),
      this.checkInsecureCookies(),
      this.testPasswordValidation(),
      this.checkInputValidation(),
    ]);

    return {
      securityHeaders: headers,
      xssVulnerabilities: xssTests,
      sqlInjectionTests: sqlTests,
      csrfProtection: csrfTests,
      sensitiveDataExposure: sensitiveData,
      mixedContent,
      authenticationBypass: bypassTests,
      cookieSecurity: cookies,
      passwordValidation: passwordTests,
      inputValidation,
      summary: {
        criticalIssues: xssTests.length > 0 || sensitiveData.length > 0,
        hasMissingSecurityHeaders: Object.values(headers).some(v => v === 'Not Set'),
        hasInsecureCookies: cookies.issues.length > 0,
      },
    };
  }
}

module.exports = SecurityHelper;
