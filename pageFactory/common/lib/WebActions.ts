import * as fs from 'fs'
import * as CryptoJS from 'crypto-js';
import type { JSHandle, Locator, Page } from '@playwright/test';
import { BrowserContext, expect } from '@playwright/test';
import { Workbook } from 'exceljs';
import * as path from 'path';
import { logger } from '../BaseUtils';
import { stringify } from 'querystring';


export class WebActions {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToURL(url: string) {
        
        await this.page.goto(url);
        await this.waitForPageLoad()
    }

    async setBrowserCookie(cookie){


        let values=cookie.split(';');
        const cookie_final:any[]=[];
        for (let i =0;i<values.length;i++){
            let key = values[i].split('=')[0].trim();
            if(key == 'authorization' || key == 'f.session' || key =='anonymous_id'){
                const json_cookie={}; 
                let value = values[i].split('=')[1];
                json_cookie['name'] = key;
                json_cookie['value'] = value;
                json_cookie['url'] = process.env.baseURL;
                cookie_final.push(json_cookie);
            }
        }

        await this.page.context().addCookies(cookie_final);

        // await this.page.context().addCookies([
        //     {  
        //     name: 'authorization', // Change this to your desired cookie name
        //     value: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyTG9naW4iOiJKTTMwMTAwMDQxIiwiZmlyc3ROYW1lIjoicGF2YW4iLCJsYXN0TmFtZSI6ImJhbmRyZWRkeSIsInN1YiI6Ijk5ODU5MzkyOTEiLCJkZXBhcnRtZW50TnVtYmVyIjoiUjMiLCJtb2JpbGUiOiI5MTk5ODU5MzkyOTEiLCJwcm1JZCI6IkpNMzAxMDAwNDEiLCJhcHByb3ZlZEF0IjoiMjAyMy0wNy0xMVQxNToxODoyNiIsInR5cGUiOiJSZXRhaWxlciIsImV4cCI6MTY5MDA4ODMxNCwiaWF0IjoxNjkwMDUyMzE0LCJzdG9yZUNvZGUiOiJKTTMwMTAwMDQxIn0.cHciZddiryn6OXwfbTQqc7QWHRqn2VKPHd33c_7SwTw', // Change this to your desired cookie value
        //     url : 'https://jmd-b2b.jiox5.de/'
        // },
        //     {
        //     name: 'f.session', // Change this to your desired cookie name
        //     value: 's%3Ad_YhD_p9AL96h2O6Pm2viCPb4eiSD3QW.icMK4lFHZ5SSxteYi9PkxyrfDNVHQVPFHTq3o7dnEuE',
        //     url : 'https://jmd-b2b.jiox5.de/'
        //     },
        //     {
        //     name: 'anonymous_id', // Change this to your desired cookie name
        //     value: 'ef48884c3d7745d3866fb272b5a6646c',
        //     url : 'https://jmd-b2b.jiox5.de/'
        //     }
        // ]);
    }

    async getBrowserCookies(){
        let cookies =await this.page.context().cookies();
        logger.log('info', 'cookies are ----> ' + cookies);

    }


    

    // async decipherPassword(): Promise<string> {
    //     const key = SECRET;
    //     //ENCRYPT
    //     // const cipher = CryptoJS.AES.encrypt('demouat',key);
    //     // console.log(cipher.toString());
    //     return CryptoJS.AES.decrypt(testConfig.otp, key).toString(CryptoJS.enc.Utf8);
    // }

    // async waitForPageNavigation(event: string): Promise<void> {
    //     switch (event.toLowerCase()) {
    //         case networkidle:
    //             await this.page.waitForNavigation({ waitUntil: networkidle, timeout: waitForElement });
    //             break;
    //         case load:
    //             await this.page.waitForNavigation({ waitUntil: load, timeout: waitForElement });
    //             break;
    //         case domcontentloaded:
    //             await this.page.waitForNavigation({ waitUntil: domcontentloaded, timeout: waitForElement });
    //     }
    // }

    async waitForPageLoad( timeout = 30000) {
    await this.page.waitForLoadState('domcontentloaded', { timeout });
    console.log('✅ Page load complete');
    }

    async waitForTheDOMToLoad(){
        await this.page.waitForLoadState('domcontentloaded');
    }

    async delay(time: number): Promise<void> {
        return new Promise(function (resolve) {
            setTimeout(resolve, time);
        });
    }

    async clickElement(locator: string): Promise<void> {
        await this.page.waitForLoadState('load')
        await this.page.waitForSelector(locator,{state: 'visible' ,timeout: 20000 })
        await this.page.click(locator, { timeout: 10000 });
    }
    async scrollUptoBottom(locator: string): Promise<void> {
        await this.page.waitForSelector(locator)
        await this.page.keyboard.down('End')
    }
    async clickElementJS(locator: string): Promise<void> {
        await this.page.$eval(locator, (element: HTMLElement) => element.click());
    }

    async boundingBoxClickElement(locator: string): Promise<void> {
        await this.delay(1000);
        const elementHandle = await this.page.$(locator);
        const box = await elementHandle?.boundingBox();
        if(box != undefined)
            await this.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    }

    async enterElementText(locator: string, text: string): Promise<void> {
        await this.page.waitForSelector(locator , {state: 'visible' , timeout: 10000})
        await this.page.fill(locator, text)
        await this.delay(500)
    }

    async clearAndEnterElementText(locator: string, text: string): Promise<void> {
        await this.page.waitForSelector(locator,{timeout: 30000});
        await this.page.fill(locator,'');
        await this.delay(1000)
        await this.page.fill(locator, text);
        await this.delay(300)
    }

    async enterElementTextAndPressEnter(locator: string, text: string): Promise<void> {
        await this.delay(5000);
        await this.page.waitForSelector(locator);
        let textField = await this.page.$(locator);
        if(textField!=null){
            await  textField.fill(text);
            await this.delay(5000);
            await textField.press('Enter');
        }
    }

    async clearElementText(locator: string): Promise<void> {
        await this.page.fill(locator, '');
        // await this.page.locator(locator).clear();
        await this.delay(300);
    }
    async chooseFilesForUpload(filesPath): Promise<void> {
        await this.page.once("filechooser", async (filechooser) => {
            await filechooser.setFiles(filesPath)
        })
        // await this.page.off("filechooser", async (filechooser) => {
        //     await filechooser.setFiles(filesPath)
        // })
    }

    async dragAndDrop(dragElementLocator: string, dropElementLocator: string): Promise<void> {
        await this.page.dragAndDrop(dragElementLocator, dropElementLocator);
    }



    async selectOptionFromDropdown(locator: string, option: string): Promise<void> {
        const selectDropDownLocator = await this.page.$(locator);
        selectDropDownLocator?.type(option);
    }

    async getTextFromWebElements(locator: string): Promise<any[]> {
        await this.page.waitForSelector(locator);
        return await this.page.$$eval(locator, elements => elements.map(item => item?.textContent?.trim()));
        
    }

    async setElementValueInLocalStorage(locator: string,key_node: string){
        await this.page.waitForSelector(locator);
        let text = await this.page.textContent(locator);


        let data = {
            key: key_node,
            value: text
          };
          let x = 'test';
        
          await this.page.evaluate(async(data) => {
             localStorage.setItem(data.key,data.value!);
          },data);

        
    }

    async getValueFromLocalStorage(key_node: string):Promise<any>{
        
        
        const value = await this.page.evaluate((key_node) => {
            return localStorage.getItem(key_node);
          },key_node);


        return value;
    }

    async getTextFromWebElement(locator: string): Promise<any> {
        await this.page.waitForSelector(locator,{
  state: 'visible',   // default → wait until element is visible
  // state: 'attached' // wait until in DOM, regardless of visibility
  // state: 'hidden'   // wait until not visible / removed
  // state: 'detached' // wait until removed from DOM
   timeout: 20000     // max wait in ms (default 30s)
});
        let text = await this.page.innerText(locator , {timeout: 10000});
        return text;
    }

    // async downloadFile(locator: string): Promise<string> {
    //     const [download] = await Promise.all([
    //         this.page.waitForEvent(download),
    //         this.page.click(locator)
    //     ]);
    //     await download.saveAs(path.join(__dirname, ../Downloads, download.suggestedFilename()));
    //     return download.suggestedFilename();
    // }

    async keyPress(locator: string, key: string): Promise<void> {
        this.page.press(locator, key);
    }

    // async readDataFromExcel(fileName: string, sheetName: string, rowNum: number, cellNum: number): Promise<string> {
    //     const workbook = new Workbook();
    //     return workbook.xlsx.readFile(./Downloads/${fileName}).then(function () {
    //         const sheet = workbook.getWorksheet(sheetName);
    //         return sheet.getRow(rowNum).getCell(cellNum).toString();
    //     });
    // }

    // async readValuesFromTextFile(filePath: string): Promise<string> {
    //     return fs.readFileSync(${filePath}, utf-8);
    // }

    async writeDataIntoTextFile(filePath: number | fs.PathLike, data: string | NodeJS.ArrayBufferView): Promise<void> {
        fs.writeFile(filePath, data, (error) => {
            if (error)
                throw error;
        });
    }

    async verifyElementText(locator: string, text: string): Promise<void> {
        // await this.page.waitForSelector(locator);
        const textValue = await this.page.textContent(locator);
        expect(textValue?.trim()).toBe(text.trim());
    }

    async verifyElementPresence(locator: string): Promise<Boolean> {
       const value =  await this.page.isVisible(locator,{timeout:1000});
       return value;
    }

    async verifyElementTextUsingIndex(locator: string, text: string, index): Promise<void> {
        const textValue = await this.page.locator(locator).nth(index).textContent();
        
        expect(textValue?.trim()).toBe(text.trim());
    }
    async verifyElementTextNotEmpty(locator: string, text: string): Promise<void> {
        const textValue = await this.page.textContent(locator);
        expect(textValue?.trim().length).toBeGreaterThan(1)
    }
    async verifyNewWindowUrlAndClick(context: BrowserContext, newWindowLocator: string, urlText: string, clickOnNewWindowLocator: string): Promise<void> {
        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            this.page.click(newWindowLocator)
        ])
        await newPage.waitForLoadState();
        expect(newPage.url()).toContain(urlText);
        await newPage.click(clickOnNewWindowLocator);
        await newPage.close();
    }

    async verifyElementContainsText(locator: string, text: string): Promise<void> {
        await this.page.locator(locator).scrollIntoViewIfNeeded();
        await expect(this.page.locator(locator)).toContainText(text);
    }

    async returnJSElement(locator: string): Promise<any> {
        const ele = await this.page.$(locator);
        return ele;

    }

    // async getElementNodeValuesUsingJS(locator: string): Promise<any> {

    //     await this.verifyElementIsDisplayed(locator,"Element is not displayed");

    //     // Use the evaluateHandle method to get the NodeList of the element
    //     const nodeListHandle = await this.page.evaluateHandle(async(locator) => {
    //         let value =  document.querySelectorAll(locator);
    //         return value[0]['_value']
    //     },locator);

    //     return nodeListHandle;
    // }

    async getElementAttributesUsingJS(locator: string): Promise<any> {
        const elementAttributes = await this.page.evaluateHandle((locator) => {
            const element = document.querySelector(locator);
            if (!element) return null;
            
            const attributes = {};
            for (const { name, value } of element.attributes) {
              attributes[name] = value;
            }
            return attributes;
          }, locator);
        
          // Get the result as a JSON object
          const attributesJson = await elementAttributes.jsonValue();

    }

    async verifyElementAttribute(locator: string, attribute: string, value: string): Promise<void> {
        const textValue = await this.page.getAttribute(locator, attribute);
        expect(textValue?.trim()).toContain(value);
    }

    // async verifyElementIsDisplayed(locator: string, errorMessage: string): Promise<void> {
    //     await this.page.waitForSelector(locator, { state: visible, timeout: waitForElement })
    //         .catch(() => { throw new Error(${errorMessage}); });
    // }

    async verifyIsElementPresent(locator:string):Promise<boolean>{
        let boolean_flag;
        try {
            await this.page.waitForSelector(locator, { timeout: 1000 });
            console.log('Element is present.');
            boolean_flag = true;
          } catch (error) {
            console.log('Element is not present.');
            boolean_flag = false;
          }

          return boolean_flag;
          
    }


    // async expectToBeTrue(status: boolean, errorMessage: string): Promise<void> {
    //     expect(status, ${errorMessage}).toBe(true);
    // }

    // async expectToBeValue(expectedValue: string, actualValue: string, errorMessage: string): Promise<void> {
    //     expect(expectedValue.trim(), ${errorMessage}).toBe(actualValue);
    // }
    async verifyTitle(expectedValue: string): Promise<void> {
        await expect(this.page).toHaveTitle(expectedValue);
    }
    async verifyCurrentUrl(expectedValue: string): Promise<void> {
        await expect(this.page.url()).toContain(expectedValue);
    }
    async verifyElementVisible(locator: string, count): Promise<void> {
        await this.page.waitForSelector(locator);
        await expect(this.page.locator(locator)).toHaveCount(count)
    }
    async verifyStatusColor(locator) {
        await this.page.waitForSelector(locator);
        const navBar = await this.page.locator(locator);
        const color = await navBar.evaluate((element) =>
            window.getComputedStyle(element).getPropertyValue('color'),
        );
        return color;
    }
    async reloadPage() {
        await this.page.reload();
    }
    async closeBrowser(){
        await this.page.close();
    }

    async getElements(locator: string): Promise<any>{
        await this.page.waitForSelector(locator , {state: 'visible',timeout: 5000})
        return await this.page.locator(locator).all();
    //   let elements =   await this.page.$$eval(locator, elements => elements.map(el => el));
    //   return elements;
    // return this.page.$(locator);
    }

    async getElementsAndClickUsingJS(locator: string): Promise<any>{
        const matchingElements = document.evaluate(
            locator,
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
          );
        
          // Convert XPathResult to an array for easier handling
          const elementsArray:any = [];
          for (let i = 0; i < matchingElements.snapshotLength; i++) {
            let element = matchingElements.snapshotItem(i);
            elementsArray.push(element);
          }
        
          // Click all elements in the array
          elementsArray.forEach((element) => {
            element.click();
          });
    }

    // async getElementsCount(locator: string): Promise<any>{
    //     await this.verifyElementIsDisplayed(locator,"Element is not present");
    //     return await this.page.locator(locator).count();
    // }

    // async getParentElement(locator: string):Promise<Locator>{
    //     await this.verifyElementIsDisplayed(locator, "Element is not present");
    //     return await this.page.locator(locator);
    // }

    async getSubElement(element:Locator , locator: string):Promise<any>{
        let value = await element.locator(locator);
        return value;
    }

    // async getSubElementValueBasedOnParentElement(parent_locator: string, child_locator: string):Promise<any>{
    //     await this.verifyElementIsDisplayed(parent_locator, "Element is not present");
    //     let parent_element = await this.page.$(parent_locator);
    //     let value:string|null|undefined;

    //     if(parent_element!=undefined){

    //         let child_element = await parent_element.$(child_locator);

    //         value = await child_element?.textContent();
    //     }
    //     return value;

    // }

    // async clickElementBasedOnParentElement(parent_locator: string, child_locator: string):Promise<any>{
    //     await this.verifyElementIsDisplayed(parent_locator, "Element is not present");
    //     let parent_element = await this.page.$(parent_locator);

    //     if(parent_element!=undefined){

    //         let child_element = await parent_element.$(child_locator);

    //         await child_element?.click();
    //     }

    // }

    // async waitForElementByRefreshingThePage(locator: string,maxRetryAttempts: number,polling_interval: number){
    //     let retryAttempts = 0;

    //     while (retryAttempts < maxRetryAttempts) {
    //         try {
    //         // Wait for the element to appear with a timeout of 5 seconds
    //         const element = await this.page.waitForSelector(locator, { timeout: 5000 });
    //         console.log('Element found successfully!');
    //         break; // Break out of the loop since the element is found
    //         } catch (error) {
    //         console.log(Element not found, refreshing the page... (Attempt ${retryAttempts + 1}/${maxRetryAttempts}));
    //         await this.page.reload(); // Refresh the page
    //         retryAttempts++;
    //         await this.page.waitForTimeout(polling_interval); // Wait for the specified interval before the next refresh
    //         }
    //     }

    //     if (retryAttempts === maxRetryAttempts) {
    //         console.log('Element not found after maximum retry attempts.');
    //     }

    // }

    async setValueInLocalStorage(key_node: string,value: string){

        let data = {
            key: key_node,
            value: value
          };
          let x = 'test';
        
          await this.page.evaluate(async(data) => {
             localStorage.setItem(data.key,data.value!);
          },data);

        
    }

    async replaceSpecialCharactersInCurrency(currency: string):Promise<string>{
        let value = currency.replace(/[₹,]/g, '');
        value = value.split('.')[0];
        return value;
    }

    async enterTextAsStreamInElementArray(locator : string, otp : string): Promise<void>{

       let elements =  await this.getElements(locator);

       let otp_list = otp.split('');
       let increment =0;
       await this.delay(2000);
        for (const element of elements) {
            await this.delay(1000);
            await element.type(otp_list[increment]);
            await this.delay(500);
            increment++;
          }
    }

    async switchToNewTabOnClick(context:any,locator: string){
        const pagePromise = context.waitForEvent('page');
        await this.page.waitForSelector(locator);
        await this.page.click(locator, { timeout: 90000 });
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        return newPage;
    }

}