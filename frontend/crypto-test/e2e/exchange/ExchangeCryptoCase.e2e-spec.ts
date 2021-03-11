import { browser, by, element, Key, logging, ExpectedConditions as EC } from 'protractor';

describe('ExchangeCryptoCase', () => {

	beforeAll(async () => { });
	beforeEach(async () => { });

	it('should Exchange Cryptocurrency', async () => {
		await browser.get('http://localhost:4200/');


	// WARNING: unsupported command focusAndWait. Object= {"command":"focusAndWait","target":"//div[@id='mat-tab-label-0-0']/div","value":""}

		await element(by.xpath("//div[@id='mat-tab-label-0-0']/div")).click();
		await element(by.xpath("//mat-select[@id='mat-select-0']/div/div[2]/div")).click();
		await element(by.xpath("//mat-option[@id='mat-option-0']/span")).click();
		await element(by.xpath("//mat-select[@id='mat-select-2']/div/div[2]/div")).click();
		await element(by.xpath("//mat-option[@id='mat-option-1889']/span")).click();
		await element(by.id("mat-input-0")).click();
		await element(by.id("mat-input-0")).sendKeys('5');
		await element(by.xpath("//mat-tab-body[@id='mat-tab-content-0-0']/div/app-exchange-form/div/form/button[2]/span")).click();
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