import { Page } from './types'

let activePages = 0

export async function scrapeContentFromURL(
    url: string,
    selector: string,
    page: Page
) {
    activePages++
    let content = ''
    try {
        await page.goto(url)
        await page.waitForSelector(selector, { timeout: 5000 })
        content = await page.evaluate((sel) => {
            const element = document.querySelector(sel)
            return element ? element.innerText : ''
        }, selector)
    } catch (error) {
        console.log('error', error)
    } finally {
        await page.close()
        activePages--
        console.log(`Active pages: ${activePages}`)
    }

    return content
}
