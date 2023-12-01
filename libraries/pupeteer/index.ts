import puppeteer, { Browser, Page, PuppeteerLaunchOptions } from 'puppeteer'

export async function launch(withProxy = false): Promise<Browser> {
    const commonOptions = {
        headless: 'new',
    }
    const options = withProxy
        ? {
              ...commonOptions,
              ignoreHTTPSErrors: true,
              args: [
                  `--proxy-server=http://${process.env.PROXY_SERVER}:${process.env.PROXY_SERVER_PORT}`,
              ],
          }
        : { ...commonOptions }

    const browser = await puppeteer.launch(options as PuppeteerLaunchOptions)
    return browser
}

export async function authenticate(page: Page, withProxy = false) {
    if (withProxy) {
        await page.authenticate({
            username: process.env.PROXY_USERNAME || '',
            password: process.env.PROXY_PASSWORD || '',
        })
    }
}
