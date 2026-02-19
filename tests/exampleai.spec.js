import { test,expect } from '@playwright/test'
import { ai } from '@zerostep/playwright' 

test('zerostep example', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

  // An object with page and test must be passed into every call
  const aiArgs = { page, test };
  await ai('Enter "rahulshettyacademy" as Username', aiArgs);
  await ai('Enter "Learning@830$3mK2" as Password', aiArgs);
  await ai('Click Sign In', aiArgs);
  await page.waitForTimeout(8_000);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await ai('click Add button associated with "iphone X"',aiArgs);
  await ai('Go to the checkout page',aiArgs);
  await ai('click checkout button',aiArgs);
  await ai('Enter ind in input',aiArgs);
  //await page.waitForTimeout(8_000);
  //await ai('Click India link',aiArgs);
  await ai('Select the checkbox',aiArgs);
  await ai('Click Purchase button', aiArgs);
  const text = await ai('Confirm that success confirmation text is displayed', aiArgs);
  expect(text).toEqual(true);

});