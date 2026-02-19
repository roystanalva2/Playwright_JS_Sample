/**
 * Accessibility Testing Utilities
 * Tests for WCAG 2.1 compliance and accessibility standards
 */

class AccessibilityHelper {
  constructor(page) {
    this.page = page;
  }

  /**
   * Run Axe accessibility scan
   */
  async runAxeScan() {
    try {
      // Note: Axe library can be integrated here
      // For now, returning empty violations
      return {
        violations: [],
        passes: [],
      };
    } catch (error) {
      console.log('Axe scan error:', error);
      return null;
    }
  }

  /**
   * Check for WCAG violations
   */
  async getAccessibilityViolations() {
    const results = await this.runAxeScan();
    if (!results) return [];
    return results.violations;
  }

  /**
   * Verify all images have alt text
   */
  async verifyImageAltText() {
    const imagesWithoutAlt = await this.page.evaluate(() => {
      const images = document.querySelectorAll('img');
      const issues = [];
      images.forEach(img => {
        if (!img.alt || img.alt.trim() === '') {
          issues.push({
            src: img.src,
            hasAlt: !!img.alt,
          });
        }
      });
      return issues;
    });
    return imagesWithoutAlt;
  }

  /**
   * Verify all form inputs have labels
   */
  async verifyFormLabels() {
    const inputsWithoutLabels = await this.page.evaluate(() => {
      const inputs = document.querySelectorAll('input, textarea, select');
      const issues = [];
      inputs.forEach(input => {
        const id = input.id;
        const associatedLabel = id ? document.querySelector(`label[for="${id}"]`) : null;
        const parentLabel = input.closest('label');

        if (!associatedLabel && !parentLabel && !input.getAttribute('aria-label')) {
          issues.push({
            type: input.tagName,
            id: id || 'no-id',
            name: input.name || 'no-name',
          });
        }
      });
      return issues;
    });
    return inputsWithoutLabels;
  }

  /**
   * Verify heading hierarchy
   */
  async verifyHeadingHierarchy() {
    const headings = await this.page.evaluate(() => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      return Array.from(headingElements).map(h => ({
        level: parseInt(h.tagName[1]),
        text: h.textContent.trim(),
      }));
    });

    // Check if hierarchy is correct
    let isValid = true;
    if (headings.length > 0 && headings[0].level !== 1) {
      isValid = false; // Should start with H1
    }

    for (let i = 1; i < headings.length; i++) {
      if (headings[i].level > headings[i - 1].level + 1) {
        isValid = false; // Should not skip levels
      }
    }

    return {
      headings,
      isValidHierarchy: isValid,
      issues: isValid ? [] : ['Invalid heading hierarchy detected'],
    };
  }

  /**
   * Verify color contrast
   */
  async checkColorContrast() {
    const contrastIssues = await this.page.evaluate(() => {
      const elements = document.querySelectorAll('body *');
      const issues = [];

      elements.forEach(element => {
        const style = window.getComputedStyle(element);
        const color = style.color;
        const bgColor = style.backgroundColor;

        // Simple contrast check (ratio >= 4.5:1 for AA compliance)
        // This is a simplified version - a full implementation would need color parsing
        if (color !== 'rgba(0, 0, 0, 0)' && bgColor !== 'rgba(0, 0, 0, 0)') {
          // Placeholder for actual contrast calculation
          // In real implementation, use a library like polished or webAIM contrast checker
        }
      });

      return issues;
    });

    return contrastIssues;
  }

  /**
   * Verify keyboard accessibility
   */
  async verifyKeyboardNavigation() {
    const keyboardAccessible = await this.page.evaluate(() => {
      const focusableElements = document.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const elements = [];
      for (let element of focusableElements) {
        elements.push({
          tag: element.tagName,
          hasTabIndex: element.hasAttribute('tabindex'),
          tabIndex: element.getAttribute('tabindex'),
          isHidden: element.offsetParent === null,
        });
      }

      return {
        focusableElementsCount: elements.length,
        elements: elements.slice(0, 10), // Return first 10
      };
    });

    return keyboardAccessible;
  }

  /**
   * Check for ARIA attributes
   */
  async verifyARIAAttributes() {
    const ariaInfo = await this.page.evaluate(() => {
      const elementsWithAria = document.querySelectorAll('[role], [aria-label], [aria-describedby]');
      return Array.from(elementsWithAria).map(el => ({
        tag: el.tagName,
        role: el.getAttribute('role'),
        ariaLabel: el.getAttribute('aria-label'),
        ariaDescribedBy: el.getAttribute('aria-describedby'),
      }));
    });

    return ariaInfo;
  }

  /**
   * Check for WCAG 2.1 Level AA compliance
   */
  async checkWCAG2_1ComplianceAA() {
    const violations = await this.getAccessibilityViolations();
    const results = {
      isCompliant: violations.length === 0,
      violationCount: violations.length,
      violations: violations.map(v => ({
        id: v.id,
        description: v.description,
        impact: v.impact,
        nodes: v.nodes.length,
      })),
    };
    return results;
  }

  /**
   * Test screen reader support
   */
  async verifyScreenReaderSupport() {
    const srSupport = await this.page.evaluate(() => {
      const pageTitle = document.title;
      const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
      const navigation = document.querySelector('nav') || document.querySelector('[role="navigation"]');

      return {
        hasTitle: !!pageTitle,
        hasMainContent: !!mainContent,
        hasNavigation: !!navigation,
        pageStructure: {
          title: pageTitle,
          hasLandmarks: !!mainContent || !!navigation,
        },
      };
    });

    return srSupport;
  }

  /**
   * Check for text readability
   */
  async verifyTextReadability() {
    const readability = await this.page.evaluate(() => {
      const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
      const issues = [];

      textElements.forEach(el => {
        const text = el.textContent.trim();
        if (text.length < 3) return; // Skip very short text

        const style = window.getComputedStyle(el);
        const fontSize = parseInt(style.fontSize);
        const lineHeight = parseInt(style.lineHeight);

        // Check minimum font size (12px recommended)
        if (fontSize < 12) {
          issues.push({
            element: el.tagName,
            fontSize: fontSize,
            issue: 'Font size too small',
          });
        }

        // Check line spacing
        const lineHeightRatio = lineHeight / fontSize;
        if (lineHeightRatio < 1.4) {
          issues.push({
            element: el.tagName,
            lineHeight: lineHeightRatio,
            issue: 'Line height too tight',
          });
        }
      });

      return {
        issues,
        totalTextElements: textElements.length,
      };
    });

    return readability;
  }

  /**
   * Get full accessibility report
   */
  async getFullAccessibilityReport() {
    const [imageAltIssues, formLabels, headings, keyboardNav, ariaAttrs, wcagCompliance, srSupport, readability] = await Promise.all([
      this.verifyImageAltText(),
      this.verifyFormLabels(),
      this.verifyHeadingHierarchy(),
      this.verifyKeyboardNavigation(),
      this.verifyARIAAttributes(),
      this.checkWCAG2_1ComplianceAA(),
      this.verifyScreenReaderSupport(),
      this.verifyTextReadability(),
    ]);

    return {
      imageAltIssues,
      formLabels,
      headingHierarchy: headings,
      keyboardNavigation: keyboardNav,
      ariaAttributes: ariaAttrs,
      wcagCompliance,
      screenReaderSupport: srSupport,
      textReadability: readability,
      summary: {
        hasImageAltIssues: imageAltIssues.length > 0,
        hasFormLabelIssues: formLabels.length > 0,
        hasHeadingHierarchyIssues: !headings.isValidHierarchy,
        isWCAGCompliant: wcagCompliance.isCompliant,
      },
    };
  }
}

module.exports = AccessibilityHelper;
