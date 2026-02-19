/**
 * CheckoutPage Page Object Model
 * Handles interactions with the checkout page
 */
class CheckoutPage {
  constructor(page) {
    this.page = page;
    
    // Locators for rahulshettyacademy.com/seleniumPractise checkout
    this.firstNameInput = 'input[placeholder="First name"]';
    this.lastNameInput = 'input[placeholder="Last name"]';
    this.emailInput = 'input[placeholder="Email address"]';
    this.phoneInput = 'input[placeholder="Phone number"]';
    this.addressInput = 'textarea[placeholder="Address"]';
    this.countrySelect = 'select[name="country"]';
    this.stateInput = 'input[placeholder="State"]';
    this.zipInput = 'input[placeholder="Zip code"]';
    this.placeOrderButton = 'button:has-text("Place Order")';
    this.paymentMethodSelect = 'select[name="payment"]';
    this.cardNumberInput = 'input[placeholder="Card number"]';
    this.expiryInput = 'input[placeholder="MM/YY"]';
    this.cvvInput = 'input[placeholder="CVV"]';
    this.termsCheckbox = 'input[type="checkbox"][name="terms"]';
    this.termsLabel = 'label:has-text("I agree")';
    this.errorMessage = '.error-message';
    this.successMessage = '.success-message';
    this.orderSummary = '.order-summary';
    this.totalAmount = '.grand-total';
    this.promoCodeInput = 'input[placeholder="Promo code"]';
    this.applyPromoButton = 'button:has-text("Apply")';
    this.discountAmount = '.discount-amount';
    this.pageTitle = 'h1';
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
      await this.page.locator(this.countrySelect).selectOption(userData.country);
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
    await this.page.locator(this.paymentMethodSelect).selectOption(method);
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
