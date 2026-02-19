/**
 * Performance Testing Utilities
 * Measures page load times and API response times
 */
class PerformanceHelper {
  constructor(page) {
    this.page = page;
  }

  /**
   * Measure page load time
   */
  async measurePageLoadTime() {
    const navigationTiming = await this.page.evaluate(() => {
      const timing = performance.getEntriesByType('navigation')[0];
      return {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        ttfb: timing.responseStart - timing.requestStart,
        download: timing.responseEnd - timing.responseStart,
        domInteractive: timing.domInteractive - timing.fetchStart,
        domComplete: timing.domComplete - timing.fetchStart,
        loadComplete: timing.loadEventEnd - timing.fetchStart,
      };
    });
    return navigationTiming;
  }

  /**
   * Get Core Web Vitals
   */
  async getCoreWebVitals() {
    const vitals = await this.page.evaluate(() => {
      return {
        // Largest Contentful Paint
        lcp: new Promise(resolve => {
          const observer = new PerformanceObserver(entryList => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.renderTime || lastEntry.loadTime);
          });
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }),
        // First Input Delay
        fid: new Promise(resolve => {
          const observer = new PerformanceObserver(entryList => {
            const entries = entryList.getEntries();
            if (entries.length > 0) {
              resolve(entries[0].processingDuration);
            }
          });
          observer.observe({ entryTypes: ['first-input'] });
        }),
        // Cumulative Layout Shift
        cls: new Promise(resolve => {
          let clsValue = 0;
          const observer = new PerformanceObserver(entryList => {
            entryList.getEntries().forEach(entry => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            resolve(clsValue);
          });
          observer.observe({ entryTypes: ['layout-shift'] });
        }),
      };
    });
    return vitals;
  }

  /**
   * Measure API response time
   */
  async measureAPIResponseTime() {
    const resourceTiming = await this.page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      const apiCalls = resources.filter(r => r.name.includes('api'));
      
      return apiCalls.map(api => ({
        url: api.name,
        duration: api.duration,
        transferSize: api.transferSize,
        decodedBodySize: api.decodedBodySize,
      }));
    });
    return resourceTiming;
  }

  /**
   * Get page size (resource sizes)
   */
  async getPageSize() {
    const resourceData = await this.page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      let totalSize = 0;
      const byType = {};

      resources.forEach(resource => {
        const type = resource.initiatorType;
        const size = resource.transferSize || 0;
        totalSize += size;

        if (!byType[type]) {
          byType[type] = { count: 0, size: 0 };
        }
        byType[type].count += 1;
        byType[type].size += size;
      });

      return {
        totalSize,
        byType,
        resourceCount: resources.length,
      };
    });
    return resourceData;
  }

  /**
   * Check if page loads within threshold
   */
  async isPageLoadWithinThreshold(thresholdMs) {
    const timing = await this.measurePageLoadTime();
    return timing.loadComplete < thresholdMs;
  }

  /**
   * Get JavaScript execution time
   */
  async getJSExecutionTime() {
    const jsMetrics = await this.page.evaluate(() => {
      const timing = performance.getEntriesByType('navigation')[0];
      return {
        scriptEvaluateTime: (timing.domInteractive - timing.fetchStart) - (timing.domContentLoadedEventStart - timing.fetchStart),
        totalJSTime: timing.domComplete - timing.domLoading,
      };
    });
    return jsMetrics;
  }

  /**
   * Monitor for layout shifts
   */
  async monitorLayoutShifts() {
    const shifts = await this.page.evaluate(() => {
      return new Promise(resolve => {
        const shiftEntries = [];
        const observer = new PerformanceObserver(entryList => {
          entryList.getEntries().forEach(entry => {
            if (!entry.hadRecentInput) {
              shiftEntries.push({
                value: entry.value,
                time: entry.startTime,
                sources: entry.sources?.map(s => ({
                  node: s.node?.nodeName,
                  previousRect: s.previousRect,
                  currentRect: s.currentRect,
                })),
              });
            }
          });
        });
        observer.observe({ entryTypes: ['layout-shift'] });
        setTimeout(() => resolve(shiftEntries), 5000);
      });
    });
    return shifts;
  }
}

module.exports = PerformanceHelper;
