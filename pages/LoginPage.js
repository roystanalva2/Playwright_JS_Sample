/**
 * LoginPage Page Object Model
 * Handles interactions with the login page
 */
class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.usernameInput = '#username';
    this.passwordInput = '#password';
    this.loginButton = '//button[text()="Login"]';
    this.forgotPasswordLink = '//a[text()="Forgot Password"]';
    this.signupLink = '//a[text()="Sign up"]';
    this.loginTitle = '//h1[contains(text(), "Login")]';
    this.errorMessage = '[class*="error"]';
    this.rememberMeCheckbox = '[type="checkbox"]';
    this.loginSuccessMessage = '[class*="success"]';
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await this.page.goto('/#/documents');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Enter username
   */
  async enterUsername(username) {
    await this.page.locator(this.usernameInput).fill(username);
  }

  /**
   * Enter password
   */
  async enterPassword(password) {
    await this.page.locator(this.passwordInput).fill(password);
  }

  /**
   * Click login button
   */
  async clickLogin() {
    const startTime = Date.now();
    await this.page.locator(this.loginButton).click();
    await this.page.waitForLoadState('networkidle');
    const endTime = Date.now();
    return endTime - startTime;
  }

  /**
   * Login with credentials
   */
  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    return await this.clickLogin();
  }

  /**
   * Check if login page is displayed
   */
  async isLoginPageDisplayed() {
    return await this.page.locator(this.loginTitle).isVisible();
  }

  /**
   * Get error message
   */
  async getErrorMessage() {
    try {
      return await this.page.locator(this.errorMessage).textContent();
    } catch (e) {
      return null;
    }
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword() {
    await this.page.locator(this.forgotPasswordLink).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click sign up link
   */
  async clickSignup() {
    await this.page.locator(this.signupLink).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check remember me checkbox
   */
  async checkRememberMe() {
    const isChecked = await this.page.locator(this.rememberMeCheckbox).isChecked();
    if (!isChecked) {
      await this.page.locator(this.rememberMeCheckbox).click();
    }
  }

  /**
   * Verify all login elements are visible
   */
  async verifyLoginPageElements() {
    const elements = {
      usernameInput: await this.page.locator(this.usernameInput).isVisible(),
      passwordInput: await this.page.locator(this.passwordInput).isVisible(),
      loginButton: await this.page.locator(this.loginButton).isVisible(),
      forgotPasswordLink: await this.page.locator(this.forgotPasswordLink).isVisible(),
    };
    return elements;
  }

  /**
   * Test with SQL injection attempt
   */
  async testSQLInjection() {
    const sqlInjectionPayload = "' OR '1'='1";
    await this.enterUsername(sqlInjectionPayload);
    await this.enterPassword(sqlInjectionPayload);
    return await this.clickLogin();
  }

  /**
   * Test with XSS payload
   */
  async testXSSPayload() {
    const xssPayload = '<script>alert("XSS")</script>';
    await this.enterUsername(xssPayload);
    return await this.clickLogin();
  }

  /**
   * Fill login form
   */
  async fillLoginForm(credentials) {
    if (credentials.username) {
      await this.enterUsername(credentials.username);
    }
    if (credentials.password) {
      await this.enterPassword(credentials.password);
    }
  }

  /**
   * Wait for login page to load
   */
  async waitForLoginPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.locator(this.loginTitle).waitFor({ timeout: 5000 });
  }
}

module.exports = LoginPage;
