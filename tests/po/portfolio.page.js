import Page from "./page";

export default class PortfolioPage extends Page {
  get portfolioContainer() {
    return this.app.client.element("#portfolio-container");
  }

  get emptyStateTitle() {
    return this.app.client.element("#portfolio-empty-state-add-account-title");
  }

  get emptyStateDesc() {
    return this.app.client.element("#portfolio-empty-state-account-desc");
  }

  get emptyStateAddAccountButton() {
    return this.app.client.element("#accounts-empty-state-add-account-button");
  }

  get emptyStateManagerButton() {
    return this.app.client.element("#empty-state-install-app");
  }

  get dashboardGraph() {
    return this.app.client.element("#dashboard-graph");
  }

  get assetDistributionTitle() {
    return this.app.client.element("#dashboard-asset-distribution-title");
  }

  get assetDistribution() {
    return this.app.client.element("#dashboard-assets-distribution-list");
  }

  get lastOperationsTitle() {
    return this.app.client.element("#dashboard-last-ops-title");
  }

  get operationsHistoryList() {
    return this.app.client.element("#operations-list");
  }

  async isVisible(reverse = false) {
    const visible = reverse
      ? await !this.app.client.waitForVisible("#portfolio-container", 3000, reverse)
      : await this.app.client.waitForVisible("#portfolio-container");

    return visible;
  }
}
