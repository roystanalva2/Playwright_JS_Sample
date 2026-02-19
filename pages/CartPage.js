/**
 * CartPage Page Object Model
 * Handles interactions with the shopping cart page
 */
class CartPage {
  constructor(page) {
    this.page = page;
    
    // Locators for rahulshettyacademy.com/seleniumPractise cart page
    this.cartItems = 'tr.cartItem';
    this.cartItemName = '.product-name';
    this.cartItemPrice = '.product-price';
    this.cartItemQuantity = 'input[type="number"]';
    this.removeButton = 'button:has-text("Remove")';
    this.subtotalAmount = '.totAmt';
    this.proceedButton = 'button:has-text("PROCEED TO CHECKOUT")';
    this.continueShoppingButton = 'button:has-text("Continue Shopping")';
    this.emptyCartMessage = '.empty-message';
    this.cartBadge = '.cart-badge';
    this.increaseQuantity = 'button.increment';
    this.decreaseQuantity = 'button.decrement';
    this.promoCodeInput = 'input[placeholder="Promo code"]';
    this.applyPromoButton = 'button:has-text("Apply")';
  }

  /**
   * Get number of items in cart
   */
  async getCartItemsCount() {
    const items = await this.page.locator(this.cartItems).count();
    return items;
  }

  /**
   * Get all cart items details
   */
  async getCartItems() {
    const items = await this.page.locator(this.cartItems).all();
    const cartItems = [];

    for (const item of items) {
      const name = await item.locator(this.cartItemName).textContent();
      const priceText = await item.locator(this.cartItemPrice).textContent();
      const price = parseFloat(priceText.replace('$', '').trim());
      const quantity = await item.locator(this.cartItemQuantity).textContent();

      cartItems.push({
        name: name.trim(),
        price: price,
        quantity: parseInt(quantity),
      });
    }

    return cartItems;
  }

  /**
   * Remove item from cart by index
   */
  async removeCartItemByIndex(index) {
    const removeBtn = this.page.locator(this.removeButton).nth(index);
    await removeBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Remove item from cart by name
   */
  async removeCartItemByName(itemName) {
    const removeBtn = this.page.locator(
      `//h4[text()='${itemName}']/ancestor::tr//button[@class='delete']`
    );
    await removeBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get subtotal
   */
  async getSubtotal() {
    const subtotalText = await this.page.locator(this.subtotalAmount).textContent();
    return parseFloat(subtotalText.replace('Rs. ', '').trim());
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout() {
    await this.page.locator(this.proceedButton).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Continue shopping
   */
  async continueShopping() {
    await this.page.locator(this.continueShoppingButton).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty() {
    try {
      const emptyMessage = await this.page.locator(this.emptyCartMessage).isVisible();
      return emptyMessage;
    } catch (e) {
      return false;
    }
  }

  /**
   * Verify cart item exists
   */
  async cartItemExists(itemName) {
    const item = this.page.locator(`//h4[contains(text(), '${itemName}')]`);
    return await item.isVisible();
  }

  /**
   * Increase item quantity
   */
  async increaseQuantityByIndex(index) {
    const increaseBtn = this.page.locator(this.increaseQuantity).nth(index);
    await increaseBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Decrease item quantity
   */
  async decreaseQuantityByIndex(index) {
    const decreaseBtn = this.page.locator(this.decreaseQuantity).nth(index);
    await decreaseBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Calculate total price of items
   */
  async calculateTotalPrice() {
    const items = await this.getCartItems();
    let total = 0;
    items.forEach(item => {
      total += item.price * item.quantity;
    });
    return total;
  }

  /**
   * Wait for cart to load
   */
  async waitForCartLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get cart item quantity by index
   */
  async getItemQuantityByIndex(index) {
    const quantityText = await this.page.locator(this.cartItemQuantity).nth(index).textContent();
    return parseInt(quantityText);
  }
}

module.exports = CartPage;
