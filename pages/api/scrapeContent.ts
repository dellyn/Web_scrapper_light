import type { NextApiRequest, NextApiResponse } from 'next'
import { scrapeArticlesContent } from '#modules/contentScrapper/services/scrapper'
import {
    ContentToScrape,
    ScrappedContent,
} from '#modules/contentScrapper/services/scrapper/types'
import { extractUrlParts } from '#libraries/http/fetch/url/extractUrlParts'
import { updateArticleContent } from '#modules/contentManager'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ScrappedContent[] | { message: string }>
) {
    const { data, feedResourceUrl } = JSON.parse(req.body)

    if (typeof feedResourceUrl !== 'string' || !feedResourceUrl) {
        return res.status(400).json({ message: 'URL must be a valid string.' })
    }
    const { hostname: feedHostname } = extractUrlParts(feedResourceUrl)

    try {
        const scrappedContent = await scrapeArticlesContent(
            data as ContentToScrape[],
            (contentUrl: string, content: string) =>
                updateArticleContent(contentUrl, content, feedHostname)
        )
        res.status(200).json(scrappedContent)
    } catch (error) {
        res.status(500).json()
    }
}
