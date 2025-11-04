import { Page } from '@playwright/test';
import { WebActions } from "../common/lib/WebActions";

let webActions: WebActions;

export class NaukriPage {
readonly page: Page;

protected static loginLink = `#login_Layer`;
protected static usernameTextBox = `input[placeholder = 'Enter your active Email ID / Username']`;
protected static passwordTextBox = `input[placeholder = 'Enter your password']`;
protected static loginButton = `button[type = 'submit']`;
protected static editResumeHeadlineIcon = `(//span[text() = 'Resume headline'])[2]/following-sibling::span`;
protected static resumeHeadlineTextArea = `#resumeHeadlineTxt`;
protected static clickSaveButton = `//button[text() = 'Save']`;




constructor(page: Page) {
this.page = page;
 webActions = new WebActions(this.page);
}





/**
* Clicks the login layer element
*/
async clickLoginLink(): Promise<void> {
await webActions.clickElement(NaukriPage.loginLink)
}

async enterUserEmailId(email:string)
{
    await webActions.enterElementText(NaukriPage.usernameTextBox , email)
}

async enterPassword(password:string)
{
    await webActions.enterElementText(NaukriPage.passwordTextBox , password)
}

async clickLoginButton()
{
    await webActions.clickElement(NaukriPage.loginButton);
}

async clickEditResumeHeadlineIcon()
{
    await webActions.clickElement(NaukriPage.editResumeHeadlineIcon);
}

async setResumeHeadLineData(content: string)
{
    await webActions.clearAndEnterElementText(NaukriPage.resumeHeadlineTextArea,content)
}

async clickSaveButton()
{
     await webActions.clickElement(NaukriPage.clickSaveButton);
     await webActions.delay(10000)
}

}