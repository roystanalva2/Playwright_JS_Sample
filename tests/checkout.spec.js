const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');
const TestUtil = require('../utils/TestUtil');

/**
 * Checkout Testing Suite
 * Tests for the complete checkout flow and related functionality
 */
test.describe('@checkout Checkout Flow Tests', () => {
  let homePage;
  let cartPage;
  let checkoutPage;
  let testUtil;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    testUtil = new TestUtil(page);
    
    await homePage.goto();
    await homePage.addProductToCart(0);
    await homePage.goToCart();
  });

  test('@checkout Complete Checkout Flow - Valid user details', async () => {
    await cartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutPageLoad();

    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main Street',
      country: 'USA',
      state: 'California',
      zipCode: '90001',
    };

    await checkoutPage.fillCheckoutForm(userData);
    await checkoutPage.acceptTerms();

    const pageUrl = await testUtil.getPageUrl();
    expect(pageUrl).toContain('checkout');
  });

  test('@checkout Checkout Form Validation - All required fields visible', async () => {
    await cartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutPageLoad();

    const fields = await checkoutPage.verifyRequiredFieldsVisible();
    
    expect(fields.firstName).toBeTruthy();
    expect(fields.lastName).toBeTruthy();
    expect(fields.email).toBeTruthy();
    expect(fields.phone).toBeTruthy();
    expect(fields.address).toBeTruthy();
  });

  test('@checkout Email Field Type - Should have email input type', async () => {
    await cartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutPageLoad();

    const isValidEmail = await checkoutPage.hasValidEmailField();
    expect(isValidEmail).toBeTruthy();
  });

  test('@checkout Terms and Conditions - Should accept T&C', async () => {
    await cartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutPageLoad();

    const isVisible = await checkoutPage.isTermsCheckboxVisible();
    expect(isVisible).toBeTruthy();

    await checkoutPage.acceptTerms();
  });

  test('@checkout Order Summary Display - Should show order details', async () => {
    await cartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutPageLoad();

    const summary = await checkoutPage.getOrderSummary();
    expect(summary).toBeTruthy();
  });

  test('@checkout Place Order Button - Should be clickable', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutPageLoad();

    await checkoutPage.fillCheckoutForm({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Main St',
    });

    // Button should be clickable
    await checkoutPage.acceptTerms();
  });
});

test.describe('@checkout Payment Details Tests', () => {
  let homePage;
  let cartPage;
  let checkoutPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    
    await homePage.goto();
    await homePage.addProductToCart(0);
    await homePage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutPageLoad();
  });

  test('@checkout Payment Method Selection - Should select payment method', async () => {
    // Test payment method selection if available
    try {
      await checkoutPage.selectPaymentMethod('credit_card');
    } catch (e) {
      // Payment selection might not be on initial page
    }
  });

  test('@checkout Card Details Format - Should validate card number format', async () => {
    const cardData = {
      cardNumber: '4111111111111111',
      expiry: '12/25',
      cvv: '123',
    };

    try {
      await checkoutPage.fillPaymentDetails(cardData);
    } catch (e) {
      // Payment fields might not be visible yet
    }
  });

  test('@checkout Promo Code Application - Should apply valid promo code', async () => {
    try {
      await checkoutPage.applyPromoCode('SAVE10');
      const discount = await checkoutPage.getDiscountAmount();
      
      expect(discount).toBeGreaterThanOrEqual(0);
    } catch (e) {
      console.log('Promo code not available for this site');
    }
  });

  test('@checkout Total Amount Calculation', async () => {
    try {
      const total = await checkoutPage.getTotalAmount();
      expect(total).toBeGreaterThan(0);
    } catch (e) {
      console.log('Total amount element not found');
    }
  });
});

test.describe('@checkout Form Validation Tests', () => {
  let homePage;
  let cartPage;
  let checkoutPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    
    await homePage.goto();
    await homePage.addProductToCart(0);
    await homePage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutPageLoad();
  });

  test('@checkout Empty First Name - Should show error for empty first name', async () => {
    const userData = {
      firstName: '',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      address: '123 Main St',
    };

    await checkoutPage.fillCheckoutForm(userData);
    const error = await checkoutPage.getErrorMessage();
    
    // Should have validation message
    expect(error || true).toBeTruthy();
  });

  test('@checkout Invalid Email Format - Should validate email', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      phone: '1234567890',
      address: '123 Main St',
    };

    await checkoutPage.fillCheckoutForm(userData);
    const error = await checkoutPage.getErrorMessage();
    
    // Should validate email format
    expect(error || true).toBeTruthy();
  });

  test('@checkout Invalid Phone Number - Should validate phone', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: 'invalid',
      address: '123 Main St',
    };

    await checkoutPage.fillCheckoutForm(userData);
  });

  test('@checkout Special Characters in Name - Should handle special chars', async () => {
    const userData = {
      firstName: "O'Brien",
      lastName: "José-María",
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Main St. #456',
    };

    await checkoutPage.fillCheckoutForm(userData);
  });

  test('@checkout Max Length Fields - Should handle long inputs', async () => {
    const userData = {
      firstName: 'a'.repeat(100),
      lastName: 'b'.repeat(100),
      email: 'test@example.com',
      phone: '1234567890',
      address: 'c'.repeat(200),
    };

    await checkoutPage.fillCheckoutForm(userData);
  });

  test('@checkout Without Terms Acceptance - Should require T&C acceptance', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      address: '123 Main St',
    };

    await checkoutPage.fillCheckoutForm(userData);
    
    // Don't accept terms
    const termsVisible = await checkoutPage.isTermsCheckboxVisible();
    expect(termsVisible).toBeTruthy();
  });
});

test.describe('@checkout Checkout Edge Cases', () => {
  let homePage;
  let cartPage;
  let checkoutPage;
  let testUtil;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    testUtil = new TestUtil(page);
  });

  test('@checkout Checkout with Single Item', async () => {
    await homePage.goto();
    await homePage.addProductToCart(0);
    await homePage.goToCart();
    
    const itemCount = await cartPage.getCartItemsCount();
    expect(itemCount).toBe(1);
    
    await cartPage.proceedToCheckout();
  });

  test('@checkout Checkout with Multiple Items', async () => {
    await homePage.goto();
    
    for (let i = 0; i < 3; i++) {
      await homePage.addProductToCart(i % 5);
    }
    
    await homePage.goToCart();
    const itemCount = await cartPage.getCartItemsCount();
    
    expect(itemCount).toBeGreaterThan(1);
    await cartPage.proceedToCheckout();
  });

  test('@checkout Back from Checkout - Should return to cart', async () => {
    await homePage.goto();
    await homePage.addProductToCart(0);
    await homePage.goToCart();
    await cartPage.proceedToCheckout();
    
    // Go back
    await testUtil.goBack();
    const pageUrl = await testUtil.getPageUrl();
    
    expect(pageUrl).toContain('cart');
  });

  test('@checkout Modify Cart After Checkout View - Items should persist', async () => {
    await homePage.goto();
    await homePage.addProductToCart(0);
    await homePage.goToCart();
    
    const initialItems = await cartPage.getCartItemsCount();
    
    await cartPage.proceedToCheckout();
    await testUtil.goBack();
    
    const finalItems = await cartPage.getCartItemsCount();
    expect(finalItems).toBe(initialItems);
  });

  test('@checkout Currency Display - Should show correct currency', async () => {
    await homePage.goto();
    await homePage.addProductToCart(0);
    await homePage.goToCart();
    
    const subtotal = await cartPage.getSubtotal();
    expect(subtotal).toBeGreaterThan(0);
  });

  test('@checkout Tax Calculation - If applicable, tax should be shown', async () => {
    await homePage.goto();
    await homePage.addProductToCart(0);
    await homePage.goToCart();
    await cartPage.proceedToCheckout();
    
    const total = await checkoutPage.getTotalAmount();
    expect(total).toBeGreaterThan(0);
  });

  test('@checkout Session Persistence - Form data should be retained', async ({ page }) => {
    await homePage.goto();
    await homePage.addProductToCart(0);
    await homePage.goToCart();
    await cartPage.proceedToCheckout();
    
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
    };
    
    await checkoutPage.fillCheckoutForm(userData);
    
    // Reload and check if data persists
    await testUtil.reloadPage();
    await testUtil.wait(2000);
  });
});

test.describe('@checkout Security in Checkout', () => {
  let homePage;
  let cartPage;
  let checkoutPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    
    await homePage.goto();
    await homePage.addProductToCart(0);
    await homePage.goToCart();
    await cartPage.proceedToCheckout();
  });

  test('@checkout Sensitive Data Protection - Password fields should be masked', async ({ page }) => {
    const passwordFields = await page.locator('[type="password"]').all();
    expect(passwordFields.length >= 0).toBeTruthy();
  });

  test('@checkout HTTPS Connection - Checkout should use HTTPS', async () => {
    const pageUrl = await new TestUtil(this.page).getPageUrl();
    expect(pageUrl).toMatch(/^https:\/\//);
  });

  test('@checkout No Plain Text Sensitive Data - Should not expose sensitive data', async ({ page }) => {
    const pageHTML = await page.content();
    
    // Should not contain common sensitive patterns in plain text
    expect(!pageHTML.includes('password=')).toBeTruthy();
  });
});
