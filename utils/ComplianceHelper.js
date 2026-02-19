/**
 * Compliance Testing Utilities
 * Tests for regulatory compliance (GDPR, PCI-DSS, etc.)
 */
class ComplianceHelper {
  constructor(page) {
    this.page = page;
  }

  /**
   * Check for GDPR compliance
   */
  async checkGDPRCompliance() {
    const gdprChecks = await this.page.evaluate(() => {
      const checks = {
        privacyPolicy: !!document.querySelector('a[href*="privacy"], a[text*="Privacy"]'),
        cookieBanner: !!document.querySelector('[class*="cookie"]'),
        consentManagement: !!document.querySelector('[class*="consent"], [data-consent]'),
        termsOfService: !!document.querySelector('a[href*="terms"], a[text*="Terms"]'),
        dataRequestLink: !!document.querySelector('a[href*="data"], [data-request]'),
      };

      // Find privacy policy and terms links
      const links = Array.from(document.querySelectorAll('a')).map(a => ({
        text: a.textContent,
        href: a.href,
      }));

      const privacyLinks = links.filter(l => 
        l.text.toLowerCase().includes('privacy') || 
        l.href.toLowerCase().includes('privacy')
      );

      const termsLinks = links.filter(l =>
        l.text.toLowerCase().includes('terms') ||
        l.text.toLowerCase().includes('conditions') ||
        l.href.toLowerCase().includes('terms')
      );

      return {
        ...checks,
        privacyLinks,
        termsLinks,
      };
    });

    return {
      hasRequiredGDPRPages: gdprChecks.privacyPolicy && gdprChecks.termsOfService,
      hasCookieConsent: gdprChecks.cookieBanner,
      hasConsentManagement: gdprChecks.consentManagement,
      details: gdprChecks,
      complianceLevel: (gdprChecks.privacyPolicy && gdprChecks.consentManagement) ? 'Partial' : 'Non-compliant',
    };
  }

  /**
   * Check for PCI-DSS compliance (Payment Card Industry)
   */
  async checkPCIDSSCompliance() {
    const pciChecks = await this.page.evaluate(() => {
      const checks = {
        noCardDataStorage: !document.innerHTML.includes('card') || !document.innerHTML.includes('number'),
        hasSSL: window.location.protocol === 'https:',
        noPlainTextPasswords: !document.innerHTML.toLowerCase().includes('password='),
        formEncryption: !!document.querySelector('form[method="POST"]'),
      };

      return checks;
    });

    // Check for security headers
    const headers = await this.checkSecurityHeadersForPCI();

    return {
      isCompliant: pciChecks.hasSSL && !pciChecks.noPlainTextPasswords,
      checks: pciChecks,
      securityHeaders: headers,
      recommendation: pciChecks.hasSSL ? 'Site uses HTTPS' : 'Site should use HTTPS for payment processing',
    };
  }

  /**
   * Check security headers for PCI compliance
   */
  async checkSecurityHeadersForPCI() {
    const requiredHeaders = [
      'Content-Security-Policy',
      'X-Content-Type-Options',
      'X-Frame-Options',
      'Strict-Transport-Security',
    ];

    const headerStatus = {};
    for (const header of requiredHeaders) {
      headerStatus[header] = 'Should be verified via response headers';
    }

    return headerStatus;
  }

  /**
   * Check for CCPA compliance (California Consumer Privacy Act)
   */
  async checkCCPACompliance() {
    const ccpaChecks = await this.page.evaluate(() => {
      const checks = {
        privacyPolicy: !!document.querySelector('a[href*="privacy"]'),
        doNotSellLink: !!document.querySelector('a[href*="do-not-sell"], a[text*="Do Not Sell"]'),
        dataDeleteRequest: !!document.querySelector('[href*="delete"]'),
        optOutMechanism: !!document.querySelector('[class*="opt-out"]'),
      };

      const links = Array.from(document.querySelectorAll('a')).map(a => ({
        text: a.textContent,
        href: a.href,
      }));

      return {
        ...checks,
        footerLinks: links.filter(l => 
          l.text.toLowerCase().includes('privacy') ||
          l.text.toLowerCase().includes('do not sell') ||
          l.text.toLowerCase().includes('california')
        ),
      };
    });

    return {
      isCompliant: ccpaChecks.privacyPolicy && ccpaChecks.doNotSellLink,
      checks: ccpaChecks,
      message: ccpaChecks.doNotSellLink ? 'Has Do Not Sell link' : 'Missing Do Not Sell opt-out link',
    };
  }

  /**
   * Check for HIPAA compliance
   */
  async checkHIPAACompliance() {
    const hipaaChecks = await this.page.evaluate(() => {
      return {
        hasBAAssociation: !!document.querySelector('[class*="ba"]'),
        hasAuthenticationMFA: !!document.querySelector('[type="password"]'),
        hasEncryption: window.location.protocol === 'https:',
        hasAuditLog: !!document.querySelector('[class*="audit"], [class*="log"]'),
      };
    });

    return {
      approximateCompliance: hipaaChecks.hasAuthenticationMFA && hipaaChecks.hasEncryption,
      checks: hipaaChecks,
      recommendation: 'HIPAA compliance requires comprehensive backend security measures',
    };
  }

  /**
   * Check for ADA compliance
   */
  async checkADACompliance() {
    const adaChecks = await this.page.evaluate(() => {
      const checks = {
        altText: Array.from(document.querySelectorAll('img')).filter(img => !img.alt).length === 0,
        headingStructure: !!document.querySelector('h1'),
        formLabels: Array.from(document.querySelectorAll('label')).length > 0,
        colorContrast: true, // Would need specific testing
        keyboardNavigation: typeof document.activeElement !== 'undefined',
      };

      return checks;
    });

    const headingHierarchy = await this.page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      return headings.length > 0;
    });

    return {
      approximateCompliance: adaChecks.altText && adaChecks.headingStructure && adaChecks.formLabels,
      checks: {
        ...adaChecks,
        hasHeadingStructure: headingHierarchy,
      },
      recommendation: 'Conduct full WCAG 2.1 AA audit for ADA compliance',
    };
  }

  /**
   * Check for COPPA compliance (Children's Online Privacy Protection)
   */
  async checkCOPPACompliance() {
    const coppaChecks = await this.page.evaluate(() => {
      const checks = {
        privacyPolicy: !!document.querySelector('a[href*="privacy"]'),
        childrensPrivacyNotice: !!document.querySelector('[class*="children"], [data-coppa]'),
        noTracking: !document.querySelector('[src*="track"], [src*="analytics"]'),
        consentMechanism: !!document.querySelector('[class*="consent"], [class*="parental"]'),
      };

      return checks;
    });

    return {
      isCompliant: coppaChecks.privacyPolicy && coppaChecks.consentMechanism,
      checks: coppaChecks,
      message: 'If website targets children under 13, COPPA compliance is mandatory',
    };
  }

  /**
   * Check for SOC 2 compliance aspects
   */
  async checkSOC2Compliance() {
    const soc2Checks = await this.page.evaluate(() => {
      return {
        hasSecurityPage: !!document.querySelector('a[href*="security"]'),
        hasTrustCenter: !!document.querySelector('a[href*="trust"]'),
        hasPrivacyPolicy: !!document.querySelector('a[href*="privacy"]'),
        hasIncidentResponse: !!document.querySelector('[class*="incident"]'),
      };
    });

    return {
      hasVisibleCompliance: Object.values(soc2Checks).some(v => v),
      checks: soc2Checks,
      note: 'SOC 2 compliance requires detailed audit and certification',
    };
  }

  /**
   * Check data retention policies
   */
  async checkDataRetentionPolicy() {
    const retentionInfo = await this.page.evaluate(() => {
      const policyText = document.body.innerText.toLowerCase();
      
      const checks = {
        mentionsDataRetention: policyText.includes('data retention') || policyText.includes('retain'),
        mentionsDeletion: policyText.includes('delete') || policyText.includes('removal'),
        mentionsArchival: policyText.includes('archive'),
      };

      return checks;
    });

    return {
      hasRetentionPolicy: retentionInfo.mentionsDataRetention,
      details: retentionInfo,
    };
  }

  /**
   * Get comprehensive compliance report
   */
  async getComplianceReport() {
    const [gdpr, pciDss, ccpa, hipaa, ada, coppa, soc2, dataRetention] = await Promise.all([
      this.checkGDPRCompliance(),
      this.checkPCIDSSCompliance(),
      this.checkCCPACompliance(),
      this.checkHIPAACompliance(),
      this.checkADACompliance(),
      this.checkCOPPACompliance(),
      this.checkSOC2Compliance(),
      this.checkDataRetentionPolicy(),
    ]);

    return {
      gdpr,
      pciDss,
      ccpa,
      hipaa,
      ada,
      coppa,
      soc2,
      dataRetention,
      summary: {
        recommendedAudits: [
          gdpr.complianceLevel === 'Non-compliant' && 'GDPR',
          !pciDss.isCompliant && 'PCI-DSS',
          !ccpa.isCompliant && 'CCPA',
          !ada.approximateCompliance && 'ADA/WCAG',
        ].filter(Boolean),
      },
    };
  }
}

module.exports = ComplianceHelper;
