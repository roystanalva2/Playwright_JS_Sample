
const { test, expect } = require('@playwright/test');
import {ai} from '@zerostep/playwright';

test('has title', async ({ page }) => {
    const aiArgs = {page,test}
    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/offers');
    const title = await ai("What is the title of this page?",aiArgs);
    const discount = await ai("What is the discounted price of Tomato",aiArgs);
    expect(discount).toEqual("26");

});

test('has Discount', async ({ page }) => {
    const aiArgs = {page,test}
    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/offers');
    //const title = await ai("What is the title of this page?",aiArgs);
    const discount = await ai("What is the discounted price of Tomato",aiArgs);
    expect(discount).toEqual("26");
    const price = await ai("What is the actual price of Tomato",aiArgs);
    expect(price).toEqual("37");
    const difference = await ai("What is the difference in actual price and discounted price of Tomato",aiArgs);
    expect(difference).toEqual("11");


    await page.goto('https://rahulshettyacademy.com/dropdownsPractise/');
    const text = await ai("Get the blinking text on top right corner",aiArgs);
    expect(text).toEqual("Free Access to InterviewQues/ResumeAssistance/Material");
    console.log(text);
    const firstval = await ai(`Split ${text} with "/" and give 0th index value`,aiArgs);
    expect(firstval).toEqual("Free Access to InterviewQues");
    console.log(firstval);


});


