# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dyfana-booking.spec.ts >> Guide booking
- Location: tests\dyfana-booking.spec.ts:73:5

# Error details

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "https://dev.dyfana.com/", waiting until "domcontentloaded"

```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test';
  2   | 
  3   | const fillStripe = async (page: Page) => {
  4   |   const stripe = page.frameLocator('iframe[title*="Secure card payment"]');
  5   |   await stripe.getByRole('textbox', { name: 'Credit or debit card number' }).fill('4242 4242 4242 4242');
  6   |   await stripe.getByRole('textbox', { name: 'Credit or debit card expiration date' }).fill('02 / 34');
  7   |   await stripe.getByRole('textbox', { name: 'Credit or debit card CVC/CVV' }).fill('215');
  8   |   await stripe.getByRole('textbox', { name: /ZIP|Postcode/ }).fill('36125');
  9   | };
  10  | 
  11  | // Stripe Elements validate async, AND the chat widget at bottom-right intercepts
  12  | // clicks at the bottom of the page. Wait briefly, then scroll Pay Now to the top
  13  | // of the viewport so the click lands far from the chat.
  14  | const clickPayNow = async (page: Page) => {
  15  |   await page.waitForTimeout(2000);
  16  |   const payBtn = page.getByRole('button', { name: 'Pay Now' });
  17  |   await payBtn.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  18  |   await page.waitForTimeout(500);
  19  |   await payBtn.click();
  20  | };
  21  | 
  22  | test.beforeEach(async ({ page }) => {
> 23  |   await page.goto('https://dev.dyfana.com/', { waitUntil: 'domcontentloaded' });
      |              ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  24  | });
  25  | 
  26  | test('Umrah booking', async ({ page }) => {
  27  |   await page.getByRole('link', { name: 'Umrah Umrah' }).click();
  28  |   await page.getByRole('link', { name: 'Join' }).click();
  29  |   await page.getByRole('button', { name: 'View Details' }).click();
  30  | 
  31  |   await page.locator('input[name="name"]').fill('anam');
  32  |   await page.locator('input[name="email"]').fill('anam@gmail.com');
  33  |   await page.locator('input[name="phone"]').fill('43535345');
  34  |   await page.getByRole('button', { name: 'Book Now' }).click();
  35  | 
  36  |   await page.getByRole('textbox', { name: '* First Name' }).fill('anam');
  37  |   await page.getByRole('textbox', { name: '* Last Name' }).fill('saeed');
  38  |   await page.getByRole('textbox', { name: '* Email Address' }).fill('anam@gmail.com');
  39  |   await page.getByRole('textbox', { name: 'Enter Phone Number' }).fill('342342342342');
  40  |   await page.getByRole('textbox', { name: "Cardholder's Name" }).fill('anam');
  41  |   await fillStripe(page);
  42  |   await page.getByRole('checkbox', { name: 'By completing this booking' }).check();
  43  |   await clickPayNow(page);
  44  |   await expect(page.getByText(/Successfully book umrah/i).first()).toBeVisible({ timeout: 30000 });
  45  | });
  46  | 
  47  | test('Transport booking', async ({ page }) => {
  48  |   await page.getByRole('link', { name: 'Transport Transport' }).click();
  49  | 
  50  |   await page.locator('#dynamic_form_nest_item_ride_0_pick_up').click();
  51  |   await page.getByText('Makkah Hotel to Makkah Ziyarat').first().click();
  52  | 
  53  |   await page.getByRole('textbox', { name: 'Select Date and Time' }).click();
  54  |   await page.getByRole('button', { name: 'Next year' }).click();
  55  |   await page.getByRole('cell', { name: '30', exact: true }).last().click();
  56  |   await page.getByRole('button', { name: 'OK' }).click();
  57  | 
  58  |   await page.locator('#dynamic_form_nest_item_ride_0_transport_type').click();
  59  |   await page.getByText('Small Size').click();
  60  |   await page.getByRole('button', { name: 'Next Step' }).click();
  61  | 
  62  |   await page.getByRole('textbox', { name: '* First Name' }).fill('anam');
  63  |   await page.getByRole('textbox', { name: '* Last Name' }).fill('test');
  64  |   await page.getByRole('textbox', { name: '* Email Address' }).fill('anam@gmail.com');
  65  |   await page.getByRole('textbox', { name: 'Enter Phone Number' }).fill('342342342342');
  66  |   await page.getByRole('textbox', { name: "Cardholder's Name" }).fill('anam');
  67  |   await fillStripe(page);
  68  |   await page.getByRole('checkbox', { name: /By completing this booking/ }).check();
  69  |   await clickPayNow(page);
  70  |   await expect(page.getByText(/Successfully book transport/i).first()).toBeVisible({ timeout: 30000 });
  71  | });
  72  | 
  73  | test('Guide booking', async ({ page }) => {
  74  |   await page.getByRole('link', { name: 'Guide Guides' }).click();
  75  |   await page.getByRole('button', { name: 'Book Now' }).first().click();
  76  | 
  77  |   // Date: pick a day in next year via Ant Design picker
  78  |   await page.locator('.ant-picker-input').first().click();
  79  |   await page.getByRole('button', { name: 'Next year (Control + right)' }).click();
  80  |   await page.getByTitle('-05-25').click();
  81  | 
  82  |   // Time: open time picker, pick "03" hour, confirm with OK
  83  |   await page.getByRole('textbox', { name: '* Select Available Time' }).click();
  84  |   await page.getByText('03').nth(2).click();
  85  |   await page.getByRole('button', { name: 'OK', exact: true }).click();
  86  | 
  87  |   // People + confirm-add (the Add button is icon-only — no accessible name)
  88  |   await page.getByRole('spinbutton', { name: '* Number of People' }).fill('2');
  89  |   await page.locator('.ant-form-item-control-input-content > .ant-row > .ant-col > .ant-space > .ant-space-item > .ant-btn').click();
  90  | 
  91  |   await page.getByRole('textbox', { name: '* First Name' }).fill('anam');
  92  |   await page.getByRole('textbox', { name: '* Last Name' }).fill('saeed');
  93  |   await page.getByRole('textbox', { name: '* Email Address' }).fill('anam@gmail.com');
  94  |   await page.getByRole('textbox', { name: 'Enter Phone Number' }).fill('342342342342');
  95  |   await page.getByRole('textbox', { name: "Cardholder's Name" }).fill('anam');
  96  |   await fillStripe(page);
  97  |   await page.getByRole('checkbox', { name: /By completing this booking/ }).check();
  98  |   await clickPayNow(page);
  99  |   await expect(page.getByText(/Successfully book|Booking successful/i).first()).toBeVisible({ timeout: 30000 });
  100 | });
  101 | 
  102 | test('Explore Saudi booking', async ({ page }) => {
  103 |   await page.getByRole('link', { name: 'Explore Saudi Explore' }).click();
  104 |   await page.getByRole('button', { name: 'Book Now' }).first().click();
  105 | 
  106 |   await page.getByRole('textbox', { name: 'Full Name *' }).fill('anam');
  107 |   await page.getByRole('textbox', { name: 'Email Address *' }).fill('anam@gmail.com');
  108 |   await page.getByRole('textbox', { name: 'Phone Number *' }).fill('72532757');
  109 |   await page.getByRole('button', { name: /Book Now/ }).click();
  110 | 
  111 |   // Payment form (different page)
  112 |   await page.getByRole('textbox', { name: '* First Name' }).fill('anam');
  113 |   await page.getByRole('textbox', { name: '* Last Name' }).fill('test');
  114 |   await page.getByRole('textbox', { name: '* Email Address' }).fill('anam@gmail.com');
  115 |   await page.getByRole('textbox', { name: 'Enter Phone Number' }).fill('324234');
  116 |   await page.getByRole('textbox', { name: "Cardholder's Name" }).fill('anam');
  117 |   await fillStripe(page);
  118 |   await page.getByRole('checkbox', { name: /By completing this booking/ }).check();
  119 |   await clickPayNow(page);
  120 | 
  121 |   await expect(page.getByText(/Successfully book|Booking successful/i).first()).toBeVisible({ timeout: 30000 });
  122 | });
  123 | 
```