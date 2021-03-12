import { browser, by, element, Key, logging, ExpectedConditions as EC } from 'protractor';

describe('GetExchangeValueFromListCase', () => {

	beforeAll(async () => { });
	beforeEach(async () => { });

	it('should get the exchange currency from a table', async () => {
		await browser.get('http://localhost:4200/');
		const el_2 = element(by.xpath("//div[@id='mat-tab-label-0-1']/div"));
		await browser.wait(EC.elementToBeClickable(el_2));
		await el_2.click();
		await browser.sleep(2000);
		await element(by.xpath("//mat-tab-body[@id='mat-tab-content-0-1']/div/app-currency-table/div/table/tbody/tr[3]/td[4]/button")).click();
		await browser.sleep(2000);
		await element(by.xpath("//mat-select[@id='mat-select-2']/div")).click();
		await element(by.xpath("//mat-option[@id='mat-option-1889']/span")).click();
		await element(by.id("mat-input-0")).click();
		await element(by.id("mat-input-0")).sendKeys('1');
		await element(by.xpath("//mat-tab-body[@id='mat-tab-content-0-0']/div/app-exchange-form/div/form/button")).click();
		await browser.sleep(1000);
		expect(Number(await element(by.id("mat-input-1")).getAttribute('value'))).toBeGreaterThan(0);


	// WARNING: unsupported command captureEntirePageScreenshot. Object= {"command":"captureEntirePageScreenshot","target":"","value":""}

	});

	afterEach(async () => {
		// Assert that there are no errors emitted from the browser
		const logs = await browser.manage().logs().get(logging.Type.BROWSER);
		expect(logs).not.toContain(jasmine.objectContaining({
			level: logging.Level.SEVERE,
		} as logging.Entry));
	});

});