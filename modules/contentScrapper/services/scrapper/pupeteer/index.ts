import puppeteer, { Browser } from 'puppeteer'

export async function launchWithProxy(): Promise<Browser> {
    const browser = await puppeteer.launch({
        headless: 'new',
        ignoreHTTPSErrors: true,
        args: [
            `--proxy-server=http://${process.env.PROXY_SERVER}:${process.env.PROXY_SERVER_PORT}`,
        ],
    })
    return browser
}
