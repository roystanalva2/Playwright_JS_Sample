/**
 * Common Test Utilities
 * Helper methods for common test operations
 */
class TestUtil {
  constructor(page) {
    this.page = page;
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(filename) {
    await this.page.screenshot({ path: `./screenshots/${filename}.png`, fullPage: true });
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector, timeout = 5000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Get element text
   */
  async getElementText(selector) {
    return await this.page.locator(selector).textContent();
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector) {
    return await this.page.locator(selector).isVisible();
  }

  /**
   * Get all text content from page
   */
  async getPageText() {
    return await this.page.evaluate(() => document.body.innerText);
  }

  /**
   * Verify element count
   */
  async verifyElementCount(selector, expectedCount) {
    const count = await this.page.locator(selector).count();
    return count === expectedCount;
  }

  /**
   * Get element count
   */
  async getElementCount(selector) {
    return await this.page.locator(selector).count();
  }

  /**
   * Simulate network error
   */
  async simulateNetworkFailure() {
    await this.page.context().setOffline(true);
  }

  /**
   * Restore network
   */
  async restoreNetwork() {
    await this.page.context().setOffline(false);
  }

  /**
   * Set network throttling
   */
  async setNetworkThrottling(downloadSpeed, uploadSpeed) {
    await this.page.route('**/*', async (route) => {
      // Simulate network delays
      await this.page.waitForTimeout(1000);
      await route.continue();
    });
  }

  /**
   * Get navigation timing
   */
  async getNavigationTiming() {
    return await this.page.evaluate(() => {
      const timing = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
        loadComplete: timing.loadEventEnd - timing.loadEventStart,
        totalTime: timing.loadEventEnd - timing.fetchStart,
      };
    });
  }

  /**
   * Wait for network idle
   */
  async waitForNetworkIdle(timeout = 5000) {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Clear local storage
   */
  async clearLocalStorage() {
    await this.page.evaluate(() => localStorage.clear());
  }

  /**
   * Clear session storage
   */
  async clearSessionStorage() {
    await this.page.evaluate(() => sessionStorage.clear());
  }

  /**
   * Get local storage data
   */
  async getLocalStorageData() {
    return await this.page.evaluate(() => localStorage);
  }

  /**
   * Set local storage data
   */
  async setLocalStorageData(key, value) {
    await this.page.evaluate(([k, v]) => {
      localStorage.setItem(k, v);
    }, [key, value]);
  }

  /**
   * Get cookie value
   */
  async getCookie(name) {
    const cookies = await this.page.context().cookies();
    return cookies.find(c => c.name === name);
  }

  /**
   * Set cookie
   */
  async setCookie(cookie) {
    await this.page.context().addCookies([cookie]);
  }

  /**
   * Delete cookie
   */
  async deleteCookie(name) {
    const cookies = await this.page.context().cookies();
    const cookie = cookies.find(c => c.name === name);
    if (cookie) {
      await this.page.context().clearCookies({ name });
    }
  }

  /**
   * Reload page
   */
  async reloadPage() {
    await this.page.reload();
  }

  /**
   * Go back in browser
   */
  async goBack() {
    await this.page.goBack();
  }

  /**
   * Go forward in browser
   */
  async goForward() {
    await this.page.goForward();
  }

  /**
   * Get page URL
   */
  async getPageUrl() {
    return this.page.url();
  }

  /**
   * Wait for timeout
   */
  async wait(ms) {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Check responsive design
   */
  async testResponsiveDesign() {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 },
    ];

    const results = {};

    for (const viewport of viewports) {
      await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
      const isRendered = await this.page.evaluate(() => document.readyState === 'complete');
      results[viewport.name] = isRendered;
    }

    return results;
  }

  /**
   * Validate URL pattern
   */
  validateURLPattern(url, pattern) {
    const regex = new RegExp(pattern);
    return regex.test(url);
  }

  /**
   * Get page performance metrics
   */
  async getPerformanceMetrics() {
    return await this.page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0];
      return {
        dns: perf.domainLookupEnd - perf.domainLookupStart,
        tcp: perf.connectEnd - perf.connectStart,
        ttfb: perf.responseStart - perf.requestStart,
        download: perf.responseEnd - perf.responseStart,
        domInteractive: perf.domInteractive - perf.fetchStart,
        domComplete: perf.domComplete - perf.fetchStart,
        loadComplete: perf.loadEventEnd - perf.fetchStart,
      };
    });
  }
}

module.exports = TestUtil;
