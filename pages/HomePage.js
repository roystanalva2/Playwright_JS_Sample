/**
 * HomePage Page Object Model
 * Handles interactions with the home/product listing page
 */
class HomePage {
  constructor(page) {
    this.page = page;
    
    // Locators for rahulshettyacademy.com/seleniumPractise
    this.productCard = '.product';
    this.addToCartButtons = 'button:has-text("ADD TO CART")';
    this.cartButton = 'img[alt="Cart"]';
    this.searchInput = 'input#search-text';
    this.filterVegCheckbox = 'input[value="Veg"]';
    this.productTitle = '.product-name';
    this.productPrice = '.product-price';
    this.increaseQuantity = '.increment';
    this.decreaseQuantity = '.decrement';
    this.quantityInput = 'input[type="number"]';
    this.logoButton = 'a.logo';
    this.productsCount = '.product';
    this.loadingSpinner = '.loading';
    this.errorMessage = '.error-message';
    this.paginationButtons = '.pagination button';
  }

  /**
   * Navigate to home page
   */
  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get all products on the page
   */
  async getProducts() {
    await this.page.waitForSelector(this.productCard);
    const products = await this.page.locator(this.productCard).all();
    return products;
  }

  /**
   * Get product count
   */
  async getProductCount() {
    const products = await this.page.locator(this.productCard).count();
    return products;
  }

  /**
   * Add product to cart by index
   */
  async addProductToCart(productIndex) {
    const addToCartButton = this.page.locator(this.addToCartButtons).nth(productIndex);
    await addToCartButton.click();
    // Wait for cart update or confirmation
    await this.page.waitForTimeout(500);
  }

  /**
   * Add product to cart by partial name match
   */
  async addProductToCartByName(productName) {
    const productButton = this.page.locator(`//h4[contains(text(), '${productName}')]/following::button[text()='ADD TO CART']`);
    await productButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Search for product
   */
  async searchProduct(searchTerm) {
    const searchField = this.page.locator(this.searchInput);
    await searchField.fill(searchTerm);
    await searchField.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click on product to view details
   */
  async clickProductByIndex(productIndex) {
    const product = this.page.locator(this.productCard).nth(productIndex);
    await product.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get product price by index
   */
  async getProductPrice(productIndex) {
    const priceText = await this.page.locator(this.productPrice).nth(productIndex).textContent();
    return parseFloat(priceText.replace('$', '').trim());
  }

  /**
   * Get product title by index
   */
  async getProductTitle(productIndex) {
    return await this.page.locator(this.productTitle).nth(productIndex).textContent();
  }

  async goToCart() {
    try {
      await this.page.locator(this.cartButton).click();
      await this.page.waitForLoadState('networkidle');
    } catch (e) {
      // Try alternative cart button locators
      try {
        await this.page.click('a[href*="cart"]');
        await this.page.waitForLoadState('networkidle');
      } catch (e2) {
        // Try finding any link with cart-related text
        try {
          await this.page.locator('text=Cart').click();
          await this.page.waitForLoadState('networkidle');
        } catch (e3) {
          console.error('Could not find cart button with any locator');
          throw e3;
        }
      }
    }
  }

  /**
   * Filter products
   */
  async filterByVegOnly() {
    const vegetarianFilter = this.page.locator('//label//input[@value="Veg"]/../span');
    await vegetarianFilter.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Clear search
   */
  async clearSearch() {
    const searchField = this.page.locator(this.searchInput);
    await searchField.clear();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Increase product quantity
   */
  async increaseQuantityByIndex(productIndex) {
    const increaseBtn = this.page.locator(this.increaseQuantity).nth(productIndex);
    await increaseBtn.click();
  }

  /**
   * Decrease product quantity
   */
  async decreaseQuantityByIndex(productIndex) {
    const decreaseBtn = this.page.locator(this.decreaseQuantity).nth(productIndex);
    await decreaseBtn.click();
  }

  /**
   * Get page title
   */
  async getPageTitle() {
    return await this.page.title();
  }

  /**
   * Check if product is visible
   */
  async isProductVisible(productIndex) {
    const product = this.page.locator(this.productCard).nth(productIndex);
    return await product.isVisible();
  }

  /**
   * Scroll to product
   */
  async scrollToProduct(productIndex) {
    const product = this.page.locator(this.productCard).nth(productIndex);
    await product.scrollIntoViewIfNeeded();
  }

  /**
   * Get visible products count
   */
  async getVisibleProductsCount() {
    const products = await this.page.locator(this.productCard).all();
    let visibleCount = 0;
    for (const product of products) {
      if (await product.isVisible()) {
        visibleCount++;
      }
    }
    return visibleCount;
  }

  /**
   * Check for error message
   */
  async hasErrorMessage() {
    return await this.page.locator(this.errorMessage).isVisible().catch(() => false);
  }
}

module.exports = HomePage;
