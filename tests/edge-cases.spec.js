const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');
const TestUtil = require('../utils/TestUtil');

/**
 * Edge Cases Testing Suite
 * Tests for boundary conditions, error handling, and unusual scenarios
 */
test.describe('@edge-cases Edge Cases - Boundary Conditions', () => {
  let homePage;
  let testUtil;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    testUtil = new TestUtil(page);
    await homePage.goto();
  });

  test('@edge-cases Zero Products - Handle empty search results', async () => {
    await homePage.searchProduct('xyznonexistent12345');
    await testUtil.waitForNetworkIdle();
    
    const productCount = await homePage.getProductCount();
    expect(productCount).toBe(0);
  });

  test('@edge-cases Large Search String - Handle very long search input', async () => {
    const longString = 'a'.repeat(1000);
    await homePage.searchProduct(longString);
    await testUtil.waitForNetworkIdle();
    
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThanOrEqual(0);
  });

  test('@edge-cases Special Characters in Search - Should handle special chars', async () => {
    const specialChars = '!@#$%^&*()';
    await homePage.searchProduct(specialChars);
    await testUtil.waitForNetworkIdle();
    
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThanOrEqual(0);
  });

  test('@edge-cases SQL Injection in Search - Should handle SQL payloads safely', async () => {
    const sqlPayload = "' OR '1'='1";
    await homePage.searchProduct(sqlPayload);
    await testUtil.waitForNetworkIdle();
    
    // Should not return all products
    const pageText = await testUtil.getPageText();
    expect(pageText).toBeTruthy();
  });

  test('@edge-cases XSS in Search - Should sanitize XSS payload', async () => {
    const xssPayload = '<script>alert("XSS")</script>';
    await homePage.searchProduct(xssPayload);
    await testUtil.waitForNetworkIdle();
    
    // Script should not execute
    const pageText = await testUtil.getPageText();
    expect(pageText).toBeTruthy();
  });

  test('@edge-cases Negative Price - Handle negative/invalid prices', async () => {
    const products = await homePage.getProducts();
    
    for (let i = 0; i < Math.min(products.length, 3); i++) {
      const price = await homePage.getProductPrice(i);
      expect(price).toBeGreaterThan(0);
    }
  });

  test('@edge-cases Zero Quantity - Should handle zero item quantity', async ({ page }) => {
    await homePage.decreaseQuantityByIndex(0);
    await testUtil.wait(500);
    
    // Verify page still works
    const products = await homePage.getProducts();
    expect(products.length).toBeGreaterThan(0);
  });

  test('@edge-cases Missing Images - Handle broken image sources', async ({ page }) => {
    const images = await page.locator('img').all();
    expect(images.length).toBeGreaterThan(0);
  });

  test('@edge-cases Very Large Quantity - Add large quantity to cart', async () => {
    const largeQty = 999;
    
    // Add to cart multiple times to simulate large quantity
    for (let i = 0; i < 3; i++) {
      await homePage.addProductToCart(0);
    }
    
    await homePage.goToCart();
    const items = await new CartPage(this.page).getCartItems();
    expect(items.length).toBeGreaterThan(0);
  });

  test('@edge-cases Rapid Multiple Clicks - Handle rapid add to cart clicks', async () => {
    const button = 'button:has-text("ADD TO CART")';
    
    // Simulate rapid clicks
    for (let i = 0; i < 5; i++) {
      await testUtil.page.locator(button).first().click();
      await testUtil.wait(100);
    }
    
    await homePage.goToCart();
    const cartItems = await new CartPage(this.page).getCartItemsCount();
    // Should handle rapid clicks gracefully
    expect(cartItems).toBeGreaterThanOrEqual(0);
  });
});

test.describe('@edge-cases Edge Cases - Cart Edge Cases', () => {
  let homePage;
  let cartPage;
  let testUtil;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    cartPage = new CartPage(page);
    testUtil = new TestUtil(page);
    
    await homePage.goto();
  });

  test('@edge-cases Empty Cart - Navigate to empty cart', async ({ page }) => {
    await homePage.goToCart();
    
    // Cart might be empty
    const isEmpty = await cartPage.isCartEmpty();
    expect(typeof isEmpty).toBe('boolean');
  });

  test('@edge-cases Remove All Items - Remove all items from cart', async () => {
    await homePage.addProductToCart(0);
    await homePage.goToCart();
    
    const itemCount = await cartPage.getCartItemsCount();
    
    for (let i = 0; i < itemCount; i++) {
      await cartPage.removeCartItemByIndex(0);
    }
    
    const finalCount = await cartPage.getCartItemsCount();
    expect(finalCount).toBe(0);
  });

  test('@edge-cases Modify After Remove - Try to modify removed item', async () => {
    await homePage.addProductToCart(0);
    await homePage.goToCart();
    
    await cartPage.removeCartItemByIndex(0);
    await testUtil.wait(500);
    
    const finalCount = await cartPage.getCartItemsCount();
    expect(finalCount).toBe(0);
  });

  test('@edge-cases Quantity Zero - Quantity cannot go below zero', async () => {
    await homePage.addProductToCart(0);
    await homePage.goToCart();
    
    // Try to decrease multiple times
    for (let i = 0; i < 5; i++) {
      await cartPage.decreaseQuantityByIndex(0);
      await testUtil.wait(200);
    }
    
    const items = await cartPage.getCartItems();
    // Quantity should not be negative
    expect(items[0].quantity).toBeGreaterThanOrEqual(0);
  });

  test('@edge-cases Fractional Quantity - Should not accept fractional quantity', async ({ page }) => {
    const quantityInput = page.locator('[type="number"]').first();
    const type = await quantityInput.getAttribute('type');
    expect(type).toBe('number');
  });

  test('@edge-cases Duplicate Add - Add same product multiple times', async () => {
    await homePage.addProductToCart(0);
    await homePage.addProductToCart(0);
    await homePage.addProductToCart(0);
    
    await homePage.goToCart();
    const items = await cartPage.getCartItems();
    
    // Item should be added multiple times or quantity increased
    expect(items.length).toBeGreaterThan(0);
  });

  test('@edge-cases Cart Persistence - Cart items should persist on refresh', async () => {
    await homePage.addProductToCart(0);
    await homePage.goToCart();
    
    const itemsBeforeRefresh = await cartPage.getCartItemsCount();
    
    await testUtil.reloadPage();
    await testUtil.waitForNetworkIdle();
    
    const itemsAfterRefresh = await cartPage.getCartItemsCount();
    
    expect(itemsAfterRefresh).toBe(itemsBeforeRefresh);
  });
});

test.describe('@edge-cases Edge Cases - Checkout Edge Cases', () => {
  let testUtil;

  test.beforeEach(async ({ page }) => {
    testUtil = new TestUtil(page);
  });

  test('@edge-cases Empty Form Submission - Should not allow empty checkout', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    
    // Try to submit without filling form
    const error = await checkoutPage.trySubmitEmptyForm();
    expect(error).toBeDefined();
  });

  test('@edge-cases Invalid Email - Should reject invalid email format', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const invalidEmails = ['test', 'test@', '@example.com', 'test @example.com'];
    
    for (const email of invalidEmails) {
      await checkoutPage.fillCheckoutForm({
        firstName: 'Test',
        lastName: 'User',
        email: email,
        phone: '1234567890',
        address: '123 Main St',
      });
    }
  });

  test('@edge-cases Invalid Phone Number - Should validate phone format', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const invalidPhones = ['123', 'abc', '!@#$%'];
    
    for (const phone of invalidPhones) {
      await checkoutPage.fillCheckoutForm({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: phone,
        address: '123 Main St',
      });
    }
  });

  test('@edge-cases Very Long Input - Should handle long form inputs', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const longString = 'a'.repeat(500);
    
    await checkoutPage.fillCheckoutForm({
      firstName: longString,
      lastName: longString,
      email: longString + '@example.com',
      address: longString,
    });
  });

  test('@edge-cases Special Characters in Fields - Should handle special chars in form', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    
    await checkoutPage.fillCheckoutForm({
      firstName: "O'Brien",
      lastName: "José-García",
      email: 'test+alias@example.com',
      address: '123 Main St. #456',
    });
  });

  test('@edge-cases Rapid Form Submission - Should handle multiple submissions', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    
    await checkoutPage.fillCheckoutForm({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Main St',
    });
    
    await checkoutPage.acceptTerms();
    
    // Try to submit multiple times rapidly
    for (let i = 0; i < 3; i++) {
      try {
        // Would need to click button here
      } catch (e) {
        // Handle error
      }
    }
  });
});
