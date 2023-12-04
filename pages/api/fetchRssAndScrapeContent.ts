import { StatusCodes } from 'http-status-codes'
import { getRssFeedArticles } from '#modules/rss/services/api'
import { scrapeResourcesContent } from '#modules/contentScrapper/services/api'
import { ScrappedContent } from '#modules/contentScrapper/services/scrapper/types'
import { mergeArticlesContent } from '#modules/contentManager'
import { Article } from '#logic/data/types'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Article[] | { message: string }>
) {
    const { url } = req.query
    let pagesToScrape: Article[] = []
    let scrappedContent: ScrappedContent[] = []

    if (typeof url !== 'string') {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'URL must be a valid string.' })
    }

    try {
        pagesToScrape = await getRssFeedArticles(url)

        if (!pagesToScrape) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'No content were scraped',
            })
        }
        const pagesToScrapeWithoutContent = pagesToScrape.filter(
            ({ content }) => !content
        )
        if (pagesToScrapeWithoutContent.length) {
            scrappedContent = await scrapeResourcesContent({
                pagesToScrape: pagesToScrapeWithoutContent,
                resourceUrl: url,
            })

            if (scrappedContent) {
                return res
                    .status(StatusCodes.OK)
                    .json(mergeArticlesContent(pagesToScrape, scrappedContent))
            }
        } else {
            res.status(StatusCodes.OK).json(pagesToScrape)
        }

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Oops, Something went wrong',
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
            error || { message: 'Ooops. Something went wrong' }
        )
    }
}
