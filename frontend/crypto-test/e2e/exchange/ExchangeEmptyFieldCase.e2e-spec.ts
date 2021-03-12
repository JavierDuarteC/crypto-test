import { browser, by, element, Key, logging, ExpectedConditions as EC } from 'protractor';

describe('ExchangeEmptyFieldCase', () => {

	beforeAll(async () => { });
	beforeEach(async () => { });

	it('should avoid exchange cryptocurrency', async () => {
		await browser.get('http://localhost:4200/');


	// WARNING: unsupported command focusAndWait. Object= {"command":"focusAndWait","target":"//div[@id='mat-tab-label-0-0']/div","value":""}

		await element(by.xpath("//mat-tab-body[@id='mat-tab-content-0-0']/div/app-exchange-form/div/form/mat-form-field[2]/div/div/div[3]")).click();
		await element(by.xpath("//mat-option[@id='mat-option-2']/span")).click();
		await element(by.xpath("//mat-select[@id='mat-select-2']/div")).click();
		await element(by.xpath("//mat-option[@id='mat-option-1892']/span")).click();
		await browser.sleep(1000);
		await element(by.xpath("//mat-tab-body[@id='mat-tab-content-0-0']/div/app-exchange-form/div/form/button")).click();
		await browser.sleep(1000);

	// WARNING: unsupported command assertTextNotPresent. Object= {"command":"assertTextNotPresent","target":"id=mat-input-1","value":"Resultado"}

		expect(await element(by.id("mat-error-0")).getText()).toContain(`La cantidad debe ser mayor que cero`);


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