import { scrapePagesContent } from '#modules/contentScrapper/services/scrapper'
import { extractUrlParts } from '#libraries/url/extractUrlParts'
import { updateArticleContentInFile } from '#modules/contentManager'
import { Payload } from './types'
import { ScrappedContent } from '../scrapper/types'

let isScraping = false

export async function scrapeResourcesContent(
    payload: Payload
): Promise<ScrappedContent[]> {
    const { pagesToScrape, resourceUrl } = payload

    const { hostname: feedHostname } = extractUrlParts(resourceUrl)

    try {
        if (isScraping) {
            throw new Error(
                'Scraping of ${resourceUrl} is already in progress.'
            )
        }

        isScraping = true
        const scrappedContent = await scrapePagesContent(
            pagesToScrape,
            (url = '', content = '') =>
                updateArticleContentInFile(url, content, feedHostname)
        )

        return scrappedContent
    } finally {
        isScraping = false
    }
}
