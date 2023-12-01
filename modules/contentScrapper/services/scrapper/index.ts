import { HostnameSelectors, PageToScrape, ScrappedContent } from './types'
import {
    closeBrowsers,
    getBrowser,
    initPuppeteerPool,
} from '#libraries/pupeteer/tool'
import pLimit from 'p-limit'
import { extractUrlParts } from '#libraries/url/extractUrlParts'
import { scrapeContentFromURL } from '#libraries/scrapper'

const concurrentScrapersLimit = 15

const defaultContentHTMLSelector = 'body'

function getContentHTMLSelector(url: string): string {
    const { hostname } = extractUrlParts(url)
    const urlSelectors: HostnameSelectors = {
        'www.michigandaily.com': '.main-content .entry-content',
        'www.unian.ua': '.article-text',
        'sport.unian.ua': '.article-text',
    }

    return urlSelectors[hostname] || defaultContentHTMLSelector
}

export async function scrapePageContent(
    url: string,
    updateContent: Function
): Promise<ScrappedContent> {
    const contentHTMLSelector = getContentHTMLSelector(url)
    const browser = await getBrowser()
    const page = await browser.newPage()
    const content = await scrapeContentFromURL(url, contentHTMLSelector, page)

    if (updateContent && content) {
        updateContent(url, content)
    }

    return { url, content }
}

export async function scrapePagesContent(
    pagesToScrape: PageToScrape[],
    updateContent: Function
): Promise<ScrappedContent[]> {
    await initPuppeteerPool()
    const limit = pLimit(concurrentScrapersLimit)

    const promises = pagesToScrape.map(({ url }) =>
        limit(() => scrapePageContent(url, updateContent))
    )

    const results = await Promise.allSettled(promises)
    closeBrowsers()

    return results
        .filter((result) => result.status === 'fulfilled' && result.value)
        .map((result) => result.value)
}
