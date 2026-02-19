/**
 * HomePage Page Object Model
 * Handles interactions with the home/product listing page
 */
class HomePage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.productList = '//div[@class="product"]';
    this.addToCartButtons = '//button[text()="ADD TO CART"]';
    this.cartButton = '[aria-label="Cart Icone"]';
    this.searchInput = '#search-text';
    this.filterButtons = '[class="filter"]';
    this.productTitle = '//h4[@class="product-name"]';
    this.productPrice = '//span[@class="product-price"]';
    this.increaseQuantity = '[class="increment"]';
    this.decreaseQuantity = '[class="decrement"]';
    this.quantityInput = '[type="number"]';
    this.logoButton = '[class*="logo"]';
    this.productsCount = '//div[@class="product"]';
    this.loadingSpinner = '[class*="loading"]';
    this.errorMessage = '[class*="error"]';
    this.paginationButtons = '[class*="pagination"]';
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
    await this.page.waitForSelector(this.productList);
    const products = await this.page.locator(this.productList).all();
    return products;
  }

  /**
   * Get product count
   */
  async getProductCount() {
    const products = await this.page.locator(this.productsCount).count();
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
    const product = this.page.locator(this.productList).nth(productIndex);
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

  /**
   * Go to cart
   */
  async goToCart() {
    await this.page.locator(this.cartButton).click();
    await this.page.waitForLoadState('networkidle');
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
    const product = this.page.locator(this.productList).nth(productIndex);
    return await product.isVisible();
  }

  /**
   * Scroll to product
   */
  async scrollToProduct(productIndex) {
    const product = this.page.locator(this.productList).nth(productIndex);
    await product.scrollIntoViewIfNeeded();
  }

  /**
   * Get visible products count
   */
  async getVisibleProductsCount() {
    const products = await this.page.locator(this.productList).all();
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
