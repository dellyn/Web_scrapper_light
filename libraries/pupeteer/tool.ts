import { Browser } from 'puppeteer'
import { launch } from './'

let browsers = [] as Browser[]
const poolSize = 2

async function initPuppeteerPool() {
    for (let i = 0; i < poolSize; i++) {
        const browser = await launch()
        browsers.push(browser)
    }
}

function getBrowser(): Browser {
    const browser = browsers.shift()
    if (browser) {
        browsers.push(browser) // Rotate the browser to the end of the array
    }
    return browser
}

async function closeBrowsers() {
    await Promise.all(browsers.map((browser) => browser.close()))
    browsers = []
}

export { initPuppeteerPool, getBrowser, closeBrowsers }
