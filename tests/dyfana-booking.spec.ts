import { test, expect, Page } from '@playwright/test';

test.describe.configure({ retries: 1 });

const blockChatWidgets = async (page: Page) => {
  await page.route(/hubspot|hs-scripts|hs-banner|hbspt|chatflow/i, (route) => route.abort());
};

const dismissChatWidgets = async (page: Page) => {
  await page.evaluate(() => {
    document.querySelectorAll('iframe').forEach((f) => {
      const src = f.src || f.name || '';
      if (/chat|hubspot|widget/i.test(src) || f.title === '') {
        f.remove();
      }
    });
  });
};

const fillStripe = async (page: Page) => {
  const stripe = page.frameLocator('iframe[title*="Secure card payment"]');
  await stripe.getByRole('textbox', { name: 'Credit or debit card number' }).fill('4242 4242 4242 4242');
  await stripe.getByRole('textbox', { name: 'Credit or debit card expiration date' }).fill('02 / 34');
  await stripe.getByRole('textbox', { name: 'Credit or debit card CVC/CVV' }).fill('215');
  await stripe.getByRole('textbox', { name: /ZIP|Postcode/ }).fill('36125');
};

const clickPayNow = async (page: Page) => {
  await page.waitForTimeout(2000);
  const payBtn = page.getByRole('button', { name: 'Pay Now' });
  await payBtn.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForTimeout(500);
  await payBtn.click();
};

const reloadIfBlank = async (page: Page, marker: string) => {
  const field = page.getByRole('textbox', { name: marker });
  for (let attempt = 0; attempt < 3; attempt++) {
    if (await field.isVisible({ timeout: 10000 }).catch(() => false)) return;
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
  }
};

const waitForLoader = async (page: Page) => {
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    document.querySelectorAll('.loader').forEach((el) => el.remove());
  });
};

test.beforeEach(async ({ page }) => {
  await blockChatWidgets(page);
  await page.goto('https://dev.dyfana.com/', { waitUntil: 'domcontentloaded' });
  await waitForLoader(page);
});

test('Umrah booking', async ({ page }) => {
  await page.getByRole('link', { name: 'Umrah Umrah' }).click();
  await waitForLoader(page);
  await page.getByRole('link', { name: 'Join' }).click();
  await page.getByRole('button', { name: 'View Details' }).click();

  await page.locator('input[name="name"]').fill('anam');
  await page.locator('input[name="email"]').fill('anam@gmail.com');
  await page.locator('input[name="phone"]').fill('43535345');
  await page.getByRole('button', { name: 'Book Now' }).click();

  await reloadIfBlank(page, '* First Name');
  await page.getByRole('textbox', { name: '* First Name' }).fill('anam');
  await page.getByRole('textbox', { name: '* Last Name' }).fill('saeed');
  await page.getByRole('textbox', { name: '* Email Address' }).fill('anam@gmail.com');
  await page.getByRole('textbox', { name: 'Enter Phone Number' }).fill('342342342342');
  await page.getByRole('textbox', { name: "Cardholder's Name" }).fill('anam');
  await fillStripe(page);
  await page.getByRole('checkbox', { name: 'By completing this booking' }).check();
  await clickPayNow(page);
  await expect(page.getByText(/Successfully book umrah/i).first()).toBeVisible({ timeout: 30000 });
});

test('Transport booking', async ({ page }) => {
  await page.getByRole('link', { name: 'Transport Transport' }).click();
  await waitForLoader(page);

  await page.getByRole('combobox').first().click();
  await page.getByText('Makkah Hotel to Makkah Ziyarat').first().click();

  await page.getByRole('textbox', { name: 'Select Date and Time' }).click();
  await page.getByRole('button', { name: 'Next year' }).click();
  await page.getByRole('cell', { name: '30', exact: true }).last().click();
  await page.getByRole('button', { name: 'OK' }).click();

  await page.locator('.ant-select').filter({ hasText: /Transport Type|Select/ }).locator('input').click();
  await page.getByText('Small Size').click();
  await page.getByRole('button', { name: 'Next Step' }).click();

  await reloadIfBlank(page, '* First Name');
  await page.getByRole('textbox', { name: '* First Name' }).fill('anam');
  await page.getByRole('textbox', { name: '* Last Name' }).fill('test');
  await page.getByRole('textbox', { name: '* Email Address' }).fill('anam@gmail.com');
  await page.getByRole('textbox', { name: 'Enter Phone Number' }).fill('342342342342');
  await page.getByRole('textbox', { name: "Cardholder's Name" }).fill('anam');
  await fillStripe(page);
  await page.getByRole('checkbox', { name: /By completing this booking/ }).check();
  await clickPayNow(page);
  await expect(page.getByText(/Successfully book transport/i).first()).toBeVisible({ timeout: 30000 });
});

test('Guide booking', async ({ page }) => {
  await page.getByRole('link', { name: 'Guide Guides' }).click();
  await waitForLoader(page);
  await page.getByRole('button', { name: 'Book Now' }).first().click();

  // Date: pick a day in next year via Ant Design picker
  await page.locator('.ant-picker-input').first().click();
  await page.getByRole('button', { name: 'Next year (Control + right)' }).click();
  const nextYear = new Date().getFullYear() + 1;
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  await page.getByTitle(`${nextYear}-${month}-25`).click();

  // Time: open time picker, pick "03" hour, confirm with OK
  await page.getByRole('textbox', { name: '* Select Available Time' }).click();
  await page.getByText('03').nth(2).click();
  await page.getByRole('button', { name: 'OK', exact: true }).click();

  // People + confirm-add (the Add button is icon-only — no accessible name)
  await page.getByRole('spinbutton', { name: '* Number of People' }).fill('2');
  await page.locator('.ant-form-item-control-input-content > .ant-row > .ant-col > .ant-space > .ant-space-item > .ant-btn').click();

  await reloadIfBlank(page, '* First Name');
  await page.getByRole('textbox', { name: '* First Name' }).fill('anam');
  await page.getByRole('textbox', { name: '* Last Name' }).fill('saeed');
  await page.getByRole('textbox', { name: '* Email Address' }).fill('anam@gmail.com');
  await page.getByRole('textbox', { name: 'Enter Phone Number' }).fill('342342342342');
  await page.getByRole('textbox', { name: "Cardholder's Name" }).fill('anam');
  await fillStripe(page);
  await page.getByRole('checkbox', { name: /By completing this booking/ }).check();
  await clickPayNow(page);
  await expect(page.getByText(/Successfully book|Booking successful/i).first()).toBeVisible({ timeout: 30000 });
});

test('Explore Saudi booking', async ({ page }) => {
  await page.getByRole('link', { name: 'Explore Saudi Explore' }).click();
  await waitForLoader(page);
  await page.getByRole('button', { name: 'Book Now' }).first().click();

  await page.getByRole('textbox', { name: 'Full Name *' }).fill('anam');
  await page.getByRole('textbox', { name: 'Email Address *' }).fill('anam@gmail.com');
  await page.getByRole('textbox', { name: 'Phone Number *' }).fill('72532757');
  await page.getByRole('button', { name: /Book Now/ }).click();

  await reloadIfBlank(page, '* First Name');
  await page.getByRole('textbox', { name: '* First Name' }).fill('anam');
  await page.getByRole('textbox', { name: '* Last Name' }).fill('test');
  await page.getByRole('textbox', { name: '* Email Address' }).fill('anam@gmail.com');
  await page.getByRole('textbox', { name: 'Enter Phone Number' }).fill('324234');
  await page.getByRole('textbox', { name: "Cardholder's Name" }).fill('anam');
  await fillStripe(page);
  await page.getByRole('checkbox', { name: /By completing this booking/ }).check();
  await clickPayNow(page);

  await expect(page.getByText(/Successfully book|Booking successful/i).first()).toBeVisible({ timeout: 30000 });
});

test('Hotel booking', async ({ page }) => {
  const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const checkIn = fmt(new Date(Date.now() + 86400000 * 2));
  const checkOut = fmt(new Date(Date.now() + 86400000 * 3));
  const filterUrl = `https://dev.dyfana.com/filter?checkInOut=${checkIn}_${checkOut}&travelers=2&city=Makkah&adults=2&rooms=1&lat=21.3891&lng=39.8579&place=Makkah%20Saudi%20Arabia&placeId=ChIJjRUoRRyZwxURcFyTsR6oPZQ&name=Makkah&breadcrumb=Makkah%2C%20Saudi%20Arabia`;
  await page.goto(filterUrl, { waitUntil: 'domcontentloaded' });


  const viewDetailsBtn = page.getByRole('button', { name: 'View Details' }).first();
  for (let attempt = 0; attempt < 3; attempt++) {
    if (await viewDetailsBtn.isVisible({ timeout: 30000 }).catch(() => false)) break;
    await page.reload({ waitUntil: 'domcontentloaded' });
  }
  await viewDetailsBtn.click({ timeout: 60000 });

  await page.getByRole('button', { name: '+' }).first().click({ timeout: 30000 });
  await page.getByRole('button', { name: 'Book Now' }).click();

  await reloadIfBlank(page, 'First Name *');
  await page.getByRole('textbox', { name: 'First Name *' }).fill('anam');
  await page.getByRole('textbox', { name: 'Last Name *' }).fill('saeed');
  await page.getByRole('textbox', { name: 'Email Address *' }).fill('anam@gmail.com');
  await page.getByRole('textbox', { name: 'Enter Phone Number' }).fill('234234234');
  await page.getByRole('textbox', { name: "Cardholder's Name" }).fill('anam');

  await page.getByRole('textbox', { name: 'Please Select' }).click();
  await page.getByText('06').first().click();
  await page.getByText('Now', { exact: true }).click();

  await fillStripe(page);
  await page.getByRole('checkbox', { name: /By completing this booking/ }).check();
  await page.getByRole('checkbox', { name: /complimentary airport transfer/i }).check();
  await clickPayNow(page);

  await expect(page.getByText(/Successfully book|Booking successful/i).first()).toBeVisible({ timeout: 30000 });
});

test('Offers booking', async ({ page }) => {
  const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const checkIn = fmt(new Date(Date.now() + 86400000 * 2));
  const checkOut = fmt(new Date(Date.now() + 86400000 * 3));
  await page.goto(`https://dev.dyfana.com/hotel/186?checkInOut=${checkIn}_${checkOut}&adults=2&children=0&rooms=1`, { waitUntil: 'domcontentloaded' });


  const alert = page.locator('.ant-alert');
  if (await alert.isVisible({ timeout: 5000 }).catch(() => false)) {
    await alert.evaluate((el) => el.remove());
  }

  await page.getByRole('button', { name: '+' }).first().click({ timeout: 30000 });
  await page.getByRole('button', { name: 'Book Now' }).click();

  await reloadIfBlank(page, 'First Name *');
  await page.getByRole('textbox', { name: 'First Name *' }).fill('anam');
  await page.getByRole('textbox', { name: 'Last Name *' }).fill('test');
  await page.getByRole('textbox', { name: 'Email Address *' }).fill('anam@gmail.com');
  await page.getByRole('textbox', { name: 'Enter Phone Number' }).fill('27653612536');
  await page.getByRole('textbox', { name: "Cardholder's Name" }).fill('anam');

  await page.getByRole('textbox', { name: 'Please Select' }).click();
  await page.getByText('04').first().click();
  await page.getByRole('button', { name: 'OK' }).click();

  await fillStripe(page);
  await page.getByRole('checkbox', { name: /By completing this booking/ }).check();
  await page.getByRole('checkbox', { name: /complimentary airport transfer/i }).check();
  await clickPayNow(page);

  await expect(page.getByText(/Successfully book|Booking successful/i).first()).toBeVisible({ timeout: 30000 });
});

test('Custom Umrah booking', async ({ page }) => {
  await page.goto('https://dev.dyfana.com/umrah/customize/', { waitUntil: 'domcontentloaded' });
  await waitForLoader(page);
  await page.waitForTimeout(1000);

  // Select city
  const cityCombo = page.getByRole('combobox').first();
  await cityCombo.click();
  await page.waitForTimeout(300);
  await cityCombo.fill('makkah');
  await page.waitForTimeout(500);
  await page.getByText('Makkah Saudi Arabia').click();
  await page.waitForTimeout(500);

  // Pick nearest available dates for hotel availability
  await page.getByRole('textbox', { name: 'Start Date' }).click();
  await page.waitForTimeout(500);
  await page.locator('.ant-picker-cell:not(.ant-picker-cell-disabled)').nth(2).click();
  await page.waitForTimeout(500);
  await page.locator('.ant-picker-cell:not(.ant-picker-cell-disabled)').nth(5).click();
  await page.waitForTimeout(1000);

  // Dismiss chat widgets that may overlay the Proceed button
  await dismissChatWidgets(page);

  // Proceed → wait for navigation to review page
  await page.getByRole('button', { name: 'Proceed', exact: true }).click();
  await page.waitForURL('**/umrah/customize/booking**', { timeout: 60000 });
  await waitForLoader(page);

  // Review page → Continue to payment (handle blank page)
  await dismissChatWidgets(page);
  const continueBtn = page.getByRole('button', { name: 'Continue' });
  for (let attempt = 0; attempt < 3; attempt++) {
    if (await continueBtn.isVisible({ timeout: 10000 }).catch(() => false)) break;
    await page.reload({ waitUntil: 'domcontentloaded' });
    await waitForLoader(page);
  }
  await continueBtn.click({ timeout: 15000 });
  await page.waitForURL('**/umrah/customize/payment**', { timeout: 30000 });
  await waitForLoader(page);

  // Payment page — handle blank page
  await reloadIfBlank(page, '* First Name');
  await page.getByRole('textbox', { name: '* First Name' }).fill('anam');
  await page.getByRole('textbox', { name: '* Last Name' }).fill('saeed');
  await page.getByRole('textbox', { name: '* Email Address' }).fill('anam@gmail.com');
  await page.getByRole('textbox', { name: 'Enter Phone Number' }).fill('121212121');
  await page.getByRole('textbox', { name: "Cardholder's Name" }).fill('anam');
  await fillStripe(page);
  await page.getByRole('checkbox', { name: /By completing this booking/ }).check();
  await clickPayNow(page);

  await expect(page.getByText(/Successfully book|Booking successful/i).first()).toBeVisible({ timeout: 30000 });
});

test('Umrah Badal booking', async ({ page }) => {
  await page.goto('https://dev.dyfana.com/umrah-badal/57', { waitUntil: 'domcontentloaded' });
  await waitForLoader(page);
  const nameField = page.getByRole('textbox', { name: 'Umrah Being Performed on the' });
  if (!(await nameField.isVisible({ timeout: 10000 }).catch(() => false))) {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await waitForLoader(page);
  }
  await nameField.fill('test');
  await page.getByRole('button', { name: 'Book Now - USD' }).click();

  await reloadIfBlank(page, '* First Name');
  await page.getByRole('textbox', { name: '* First Name' }).fill('anam');
  await page.getByRole('textbox', { name: '* Last Name' }).fill('test');
  await page.getByRole('textbox', { name: '* Email Address' }).fill('anam@gmail.com');
  await page.getByRole('textbox', { name: 'Enter Phone Number' }).fill('4234234234');
  await page.getByRole('textbox', { name: "Cardholder's Name" }).fill('anam');
  await fillStripe(page);
  await page.getByRole('checkbox', { name: /By completing this booking/ }).check();
  await clickPayNow(page);

  await expect(page.getByText(/Successfully book|Booking successful/i).first()).toBeVisible({ timeout: 30000 });
});
