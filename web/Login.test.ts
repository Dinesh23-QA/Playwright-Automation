import { BrowserContext, chromium, expect, Page, test } from '@playwright/test';
import { NaukriPage } from "../pageFactory/pageRepository/NaukriPage";
import { WebActions } from "../../Playwright-Automation/pageFactory/common/lib/WebActions";






test.describe('Naukri login test',()=>{

    let context;
    let page: Page;
    let webActions: WebActions;
    let naukriPage: NaukriPage;

    const profiles = [
  "Automation Expert - AI Automation (GitHub Copilot + MCP), UI Automation (Playwright - TypeScript, Selenium - Java), API Automation (Rest Assured, Playwright Request API) | CI/CD | Agile | Manual & DB Testing",
  
  "Automation Expert Specialist in AI-driven automation (MCP, GitHub Copilot), robust UI automation (Playwright with TypeScript, Selenium with Java), and API frameworks (Rest Assured, Playwright Request API) | Proficient in CI/CD, Agile, Manual & Database Testing",
  
  "AI & Automation Specialist - Skilled in GitHub Copilot, MCP, Playwright (TypeScript), Selenium (Java), and API automation tools (Rest Assured, Playwright API) | Experienced in CI/CD pipelines, Agile practices, Manual & Database Testing"
];
function getRandomProfile(): string {
  const idx = Math.floor(Math.random() * profiles.length);
  console.log(profiles[idx])
  return profiles[idx];
}

test.beforeEach(async ({ browser }) => {
        
        context = await browser.newContext();

        
        page = await context.newPage();

        webActions =  new WebActions(page);

        naukriPage = new NaukriPage(page);
         });    


test('Login with Excel @new',async()=>{

   await webActions.navigateToURL("https://www.naukri.com/");
   await naukriPage.clickLoginLink();
   await naukriPage.enterUserEmailId('dineshkumarjd04@gmail.com');
   await naukriPage.enterPassword('Sandy@123A');
   await naukriPage.clickLoginButton();

   await webActions.delay(10000)
   await webActions.navigateToURL('https://www.naukri.com/mnjuser/profile?id=&altresid')

   await webActions.delay(10000)
   await naukriPage.clickEditResumeHeadlineIcon();
   await naukriPage.setResumeHeadLineData(getRandomProfile());
   await naukriPage.clickSaveButton();
   await webActions.delay(5000)
    
})
})