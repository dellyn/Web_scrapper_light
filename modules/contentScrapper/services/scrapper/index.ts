import { ContentToScrape, HostnameSelectors, ScrappedContent } from './types'
import { extractUrlParts } from '#libraries/http/fetch/url/extractUrlParts'
import { authenticateWithProxy, launchWithProxy } from './pupeteer'

async function scrapeContentFromURL(url: string, selector: string) {
    const browser = await launchWithProxy()

    const page = await browser.newPage()
    await authenticateWithProxy(page)

    try {
        await page.goto(url)
    } catch (error) {
        console.log('error', error)
    }

    const content = await page.evaluate((sel) => {
        const element = document.querySelector(sel)
        return element ? element.innerText : ''
    }, selector)

    await browser.close()
    return content
}

function getCorrespondingHtmlSelector(url: string): string {
    const urlsSelectors: HostnameSelectors = {
        'www.michigandaily.com': '.main-content',
        'fox2now.com': 'body',
    }
    const { hostname } = extractUrlParts(url)

    return urlsSelectors[hostname]
}

export async function scrapeArticlesContent(
    contentToScrape: ContentToScrape[],
    updateContent: Function
): Promise<ScrappedContent[]> {
    const results = await Promise.allSettled(
        contentToScrape.map(async ({ url }) => {
            const htmlSelector = getCorrespondingHtmlSelector(url)
            const content = await scrapeContentFromURL(url, htmlSelector)
            if (updateContent) {
                updateContent(url, content)
            }

            return { url, content }
        })
    )
    return results
        .filter((result) => result.status === 'fulfilled' && result.value)
        .map((result) => result.value)
}
