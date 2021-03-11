import { browser, by, element, Key, logging, ExpectedConditions as EC } from 'protractor';

describe('SwapFieldsCase', () => {

	beforeAll(async () => { });
	beforeEach(async () => { });

	it('should swap exchange currency', async () => {
		await browser.get('http://localhost:4200/');


	// WARNING: unsupported command focusAndWait. Object= {"command":"focusAndWait","target":"//mat-select[@id='mat-select-0']/div","value":""}

		await element(by.xpath("//mat-select[@id='mat-select-0']/div")).click();
		await element(by.xpath("//mat-option[@id='mat-option-0']/span")).click();


	// WARNING: unsupported command storeText. Object= {"command":"storeText","target":"//div[@id='mat-select-value-1']/span/span","value":"selected1"}

		await element(by.xpath("//mat-select[@id='mat-select-2']/div/div[2]")).click();
		await element(by.xpath("//mat-option[@id='mat-option-1890']/span")).click();

		var selected1 = await element(by.xpath("//div[@id='mat-select-value-1']/span/span")).getText();
		var selected2 = await element(by.xpath("//div[@id='mat-select-value-3']/span/span")).getText();

	// WARNING: unsupported command storeText. Object= {"command":"storeText","target":"//div[@id='mat-select-value-3']/span/span","value":"selected2"}
		await browser.sleep(1000);
		expect(await element(by.xpath("//div[@id='mat-select-value-1']/span/span")).getText()).toContain(`${selected1}`);
		expect(await element(by.xpath("//div[@id='mat-select-value-3']/span/span")).getText()).toContain(`${selected2}`);
		await element(by.xpath("//mat-tab-body[@id='mat-tab-content-0-0']/div/app-exchange-form/div/form/button/span/mat-icon")).click();
		await browser.sleep(1000);
		expect(await element(by.xpath("//div[@id='mat-select-value-1']/span/span")).getText()).toContain(`${selected2}`);
		expect(await element(by.xpath("//div[@id='mat-select-value-3']/span/span")).getText()).toContain(`${selected1}`);
		await element(by.xpath("//mat-tab-body[@id='mat-tab-content-0-0']/div/app-exchange-form/div/form/button/span/mat-icon")).click();
		await browser.sleep(2000);
		expect(await element(by.xpath("//div[@id='mat-select-value-1']/span/span")).getText()).toContain(`${selected1}`);
		expect(await element(by.xpath("//div[@id='mat-select-value-3']/span/span")).getText()).toContain(`${selected2}`);


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