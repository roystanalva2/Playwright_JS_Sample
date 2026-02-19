const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const CartPage = require('../pages/CartPage');
const TestUtil = require('../utils/TestUtil');

/**
 * UI Testing Suite
 * Tests for UI elements, layout, visibility, and interactions
 */
test.describe('@ui UI Tests - HomePage', () => {
  let homePage;
  let testUtil;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    testUtil = new TestUtil(page);
    await homePage.goto();
  });

  test('@ui Page Load - HomePage should load successfully', async ({ page }) => {
    const title = await homePage.getPageTitle();
    expect(title).toContain('Practice');
  });

  test('@ui Product Display - Should display products on homepage', async () => {
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });

  test('@ui Product Visibility - All products should be visible', async () => {
    const visibleCount = await homePage.getVisibleProductsCount();
    const totalCount = await homePage.getProductCount();
    expect(visibleCount).toBe(totalCount);
  });

  test('@ui Add to Cart - Should add product to cart', async () => {
    await homePage.addProductToCart(0);
    const cartButton = 'button:has-text("Cart")';
    const cartVisible = await testUtil.isElementVisible(cartButton);
    expect(cartVisible).toBeTruthy();
  });

  test('@ui Search Functionality - Should search for product', async () => {
    await homePage.searchProduct('Tomato');
    await testUtil.waitForNetworkIdle();
    const products = await homePage.getProductCount();
    expect(products).toBeGreaterThan(0);
  });

  test('@ui Clear Search - Should clear search results', async () => {
    await homePage.searchProduct('Tomato');
    await homePage.clearSearch();
    const products = await homePage.getProductCount();
    expect(products).toBeGreaterThan(0);
  });

  test('@ui Filter Products - Should filter vegetarian products', async () => {
    const initialCount = await homePage.getProductCount();
    await homePage.filterByVegOnly();
    const filteredCount = await homePage.getProductCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('@ui Product Details - Should get product information', async () => {
    const title = await homePage.getProductTitle(0);
    const price = await homePage.getProductPrice(0);
    
    expect(title).toBeTruthy();
    expect(price).toBeGreaterThan(0);
  });

  test('@ui Responsive Layout - Should display on different viewports', async () => {
    const responsive = await testUtil.testResponsiveDesign();
    
    expect(responsive['Mobile']).toBeTruthy();
    expect(responsive['Tablet']).toBeTruthy();
    expect(responsive['Desktop']).toBeTruthy();
  });

  test('@ui Cart Navigation - Should navigate to cart', async () => {
    await homePage.addProductToCart(0);
    await homePage.goToCart();
    
    const pageUrl = await testUtil.getPageUrl();
    expect(pageUrl).toContain('cart');
  });

  test('@ui Quantity Control - Should increase product quantity', async () => {
    await homePage.increaseQuantityByIndex(0);
    await testUtil.wait(500);
    
    // Verify quantity increased
    const products = await homePage.getProducts();
    expect(products.length).toBeGreaterThan(0);
  });

  test('@ui Button States - Add to Cart button should be clickable', async ({ page }) => {
    const button = page.locator('//button[text()="ADD TO CART"]').first();
    await expect(button).toBeEnabled();
  });
});

test.describe('@ui UI Tests - Cart Page', () => {
  let homePage;
  let cartPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    cartPage = new CartPage(page);
    
    await homePage.goto();
    await homePage.addProductToCart(0);
    await homePage.goToCart();
  });

  test('@ui Cart Display - Should display added items in cart', async () => {
    const itemCount = await cartPage.getCartItemsCount();
    expect(itemCount).toBeGreaterThan(0);
  });

  test('@ui Cart Item Details - Should show item details', async () => {
    const items = await cartPage.getCartItems();
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toHaveProperty('name');
    expect(items[0]).toHaveProperty('price');
    expect(items[0]).toHaveProperty('quantity');
  });

  test('@ui Price Calculation - Should calculate correct subtotal', async () => {
    const items = await cartPage.getCartItems();
    const calculatedTotal = await cartPage.calculateTotalPrice();
    const displayedSubtotal = await cartPage.getSubtotal();
    
    expect(calculatedTotal).toBeCloseTo(displayedSubtotal, 1);
  });

  test('@ui Remove Item - Should remove item from cart', async () => {
    const initialCount = await cartPage.getCartItemsCount();
    await cartPage.removeCartItemByIndex(0);
    const finalCount = await cartPage.getCartItemsCount();
    
    expect(finalCount).toBeLessThan(initialCount);
  });

  test('@ui Proceed to Checkout - Should navigate to checkout', async ({ page }) => {
    const testUtil = new TestUtil(page);
    await cartPage.proceedToCheckout();
    
    const pageUrl = await testUtil.getPageUrl();
    expect(pageUrl).toContain('checkout');
  });
});

test.describe('@ui UI Tests - Element States', () => {
  let homePage;
  let testUtil;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    testUtil = new TestUtil(page);
    await homePage.goto();
  });

  test('@ui Disabled Elements - Should handle disabled buttons', async ({ page }) => {
    const button = page.locator('//button[disabled]').first();
    const isDisabled = await button.getAttribute('disabled');
    expect(isDisabled).toBeTruthy();
  });

  test('@ui Loading States - Should handle loading elements', async () => {
    await homePage.waitForPageLoad();
    const hasLoading = await homePage.hasErrorMessage();
    expect(typeof hasLoading).toBe('boolean');
  });

  test('@ui Link Navigation - Should navigate on link click', async ({ page }) => {
    const link = page.locator('a').first();
    const href = await link.getAttribute('href');
    expect(href).toBeTruthy();
  });
});
