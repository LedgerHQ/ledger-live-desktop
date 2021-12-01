import { Page, Locator, Handle, expect } from "@playwright/test";

export class SidebarMenu {
    readonly page: Page;
    readonly portfolioGlobal: Locator;
    readonly portfolioContainer: Locator;
    readonly accountsGlobal: Locator;
    readonly accountsPageTitle: Locator;
    readonly discoverGlobal: Locator;
    readonly discoverPageTitle: Locator;
    readonly sendGlobal: Locator;
    readonly receiveGlobal: Locator;
    readonly modalTitle: Locator;
    readonly buyGlobal: Locator;
    readonly buyPageTitle: Locator;
    readonly swapGlobal: Locator;
    readonly swapPageTitle: Locator;
    readonly managerGlobal: Locator;

    constructor(page:Page) {
        this.page = page;
        this.portfolioGlobal = page.locator('#drawer-dashboard-button');
        this.portfolioContainer = page.locator('#portfolio-container');
        this.accountsGlobal = page.locator('#drawer-accounts-button');
        this.accountsPageTitle = page.locator('#accounts-title');
        this.discoverGlobal = page.locator('#drawer-catalog-button');
        this.discoverPageTitle = page.locator('text=Discover[font-size="7"]');
        this.sendGlobal = page.locator('#drawer-send-button');
        this.receiveGlobal = page.locator('#drawer-receive-button');
        this.modalTitle = page.locator('#modal-title');
        this.buyGlobal = page.locator('#drawer-exchange-button');
        this.buyPageTitle = page.locator('#exchange-title');
        this.swapGlobal = page.locator('#drawer-swap-button');
        this.swapPageTitle = page.locator('text=Swap[font-size="7"]');
        this.managerGlobal = page.locator('#drawer-manager-button');
    }

    async navigate(sidebarItem: string) {
       switch(sidebarItem) {
           case 'portfolio':
               await this.portfolioGlobal.click();
               expect(await this.portfolioContainer.isVisible()).toBe(true);
               break;
            case 'accounts':
                await this.accountsGlobal.click();
                expect(this.accountsPageTitle).toContainText('Accounts');
                break;
            case 'discover':
                await this.discoverGlobal.click();
                expect(this.discoverPageTitle).toContainText('Discover');
                break;
            case 'send':
                await this.sendGlobal.click();
                expect(this.modalTitle).toContainText('Send');
                break;
            case 'receive':
                await this.receiveGlobal.click();
                expect(this.modalTitle).toContainText('Receive');
                break;
            case 'buy':
            case 'sell':
                await this.buyGlobal.click();
                expect(this.buyPageTitle).toContainText('buy crypto')
                break;
            case 'swap':
                await this.swapGlobal.click();
                expect(this.swapPageTitle).toContainText('Swap');
                break;
            case 'manager':
                await this.managerGlobal.click();
                break;
            default:
                console.log("sidebar item missing !!!")
       }
    }
}
