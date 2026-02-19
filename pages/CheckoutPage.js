/**
 * CheckoutPage Page Object Model
 * Handles interactions with the checkout page
 */
class CheckoutPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.firstNameInput = '[placeholder="First name"]';
    this.lastNameInput = '[placeholder="Last name"]';
    this.emailInput = '[placeholder="Email address"]';
    this.phoneInput = '[placeholder="Phone number"]';
    this.addressInput = '[placeholder="Address"]';
    this.countryInput = '[placeholder="Country"]';
    this.stateInput = '[placeholder="State"]';
    this.zipInput = '[placeholder="Zip code"]';
    this.placeOrderButton = '//button[text()="Place Order"]';
    this.paymentMethodDropdown = '#payment-method';
    this.cardNumberInput = '[placeholder="Card number"]';
    this.expiryInput = '[placeholder="MM/YY"]';
    this.cvvInput = '[placeholder="CVV"]';
    this.termsCheckbox = '[class*="terms"]//input';
    this.errorMessage = '[class*="error"]';
    this.successMessage = '[class*="success"]';
    this.orderSummary = '[class*="summary"]';
    this.totalAmount = '[class*="total"]';
    this.promoCodeInput = '#promo-code';
    this.applyPromoButton = '//button[text()="Apply"]';
    this.discountAmount = '[class*="discount"]';
  }

  /**
   * Fill checkout form with user details
   */
  async fillCheckoutForm(userData) {
    if (userData.firstName) {
      await this.page.locator(this.firstNameInput).fill(userData.firstName);
    }
    if (userData.lastName) {
      await this.page.locator(this.lastNameInput).fill(userData.lastName);
    }
    if (userData.email) {
      await this.page.locator(this.emailInput).fill(userData.email);
    }
    if (userData.phone) {
      await this.page.locator(this.phoneInput).fill(userData.phone);
    }
    if (userData.address) {
      await this.page.locator(this.addressInput).fill(userData.address);
    }
    if (userData.country) {
      await this.page.locator(this.countryInput).fill(userData.country);
    }
    if (userData.state) {
      await this.page.locator(this.stateInput).fill(userData.state);
    }
    if (userData.zipCode) {
      await this.page.locator(this.zipInput).fill(userData.zipCode);
    }
  }

  /**
   * Select payment method
   */
  async selectPaymentMethod(method) {
    await this.page.locator(this.paymentMethodDropdown).selectOption(method);
  }

  /**
   * Fill payment details
   */
  async fillPaymentDetails(paymentData) {
    if (paymentData.cardNumber) {
      await this.page.locator(this.cardNumberInput).fill(paymentData.cardNumber);
    }
    if (paymentData.expiry) {
      await this.page.locator(this.expiryInput).fill(paymentData.expiry);
    }
    if (paymentData.cvv) {
      await this.page.locator(this.cvvInput).fill(paymentData.cvv);
    }
  }

  /**
   * Accept terms and conditions
   */
  async acceptTerms() {
    const termsCheckbox = this.page.locator(this.termsCheckbox);
    const isChecked = await termsCheckbox.isChecked();
    if (!isChecked) {
      await termsCheckbox.click();
    }
  }

  /**
   * Apply promo code
   */
  async applyPromoCode(code) {
    await this.page.locator(this.promoCodeInput).fill(code);
    await this.page.locator(this.applyPromoButton).click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Get discount amount
   */
  async getDiscountAmount() {
    try {
      const discountText = await this.page.locator(this.discountAmount).textContent();
      return parseFloat(discountText.replace('$', '').replace('-', '').trim());
    } catch (e) {
      return 0;
    }
  }

  /**
   * Get total amount
   */
  async getTotalAmount() {
    const totalText = await this.page.locator(this.totalAmount).textContent();
    return parseFloat(totalText.replace('$', '').replace('Total: ', '').trim());
  }

  /**
   * Click place order button
   */
  async placeOrder() {
    const startTime = Date.now();
    await this.page.locator(this.placeOrderButton).click();
    await this.page.waitForLoadState('networkidle');
    const endTime = Date.now();
    return endTime - startTime;
  }

  /**
   * Check for error message
   */
  async getErrorMessage() {
    try {
      return await this.page.locator(this.errorMessage).textContent();
    } catch (e) {
      return null;
    }
  }

  /**
   * Check for success message
   */
  async getSuccessMessage() {
    try {
      return await this.page.locator(this.successMessage).textContent();
    } catch (e) {
      return null;
    }
  }

  /**
   * Verify all required fields are visible
   */
  async verifyRequiredFieldsVisible() {
    const fields = {
      firstName: await this.page.locator(this.firstNameInput).isVisible(),
      lastName: await this.page.locator(this.lastNameInput).isVisible(),
      email: await this.page.locator(this.emailInput).isVisible(),
      phone: await this.page.locator(this.phoneInput).isVisible(),
      address: await this.page.locator(this.addressInput).isVisible(),
    };
    return fields;
  }

  /**
   * Clear all form fields
   */
  async clearAllFields() {
    await this.page.locator(this.firstNameInput).clear();
    await this.page.locator(this.lastNameInput).clear();
    await this.page.locator(this.emailInput).clear();
    await this.page.locator(this.phoneInput).clear();
    await this.page.locator(this.addressInput).clear();
  }

  /**
   * Validate email format
   */
  async hasValidEmailField() {
    const email = await this.page.locator(this.emailInput).getAttribute('type');
    return email === 'email';
  }

  /**
   * Try to submit without filling required fields
   */
  async trySubmitEmptyForm() {
    try {
      await this.page.locator(this.placeOrderButton).click();
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Wait for checkout page to load
   */
  async waitForCheckoutPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.locator(this.firstNameInput).waitFor({ timeout: 5000 });
  }

  /**
   * Get order summary details
   */
  async getOrderSummary() {
    return await this.page.locator(this.orderSummary).textContent();
  }

  /**
   * Check if terms checkbox is visible
   */
  async isTermsCheckboxVisible() {
    return await this.page.locator(this.termsCheckbox).isVisible();
  }

  /**
   * Scroll to form field
   */
  async scrollToField(fieldSelector) {
    await this.page.locator(fieldSelector).scrollIntoViewIfNeeded();
  }
}

module.exports = CheckoutPage;
