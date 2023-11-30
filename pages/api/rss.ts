import type { NextApiRequest, NextApiResponse } from 'next'
import { Article } from '#logic/data/types'
import { getFeedArticles } from '#modules/rss/services/rssFeed'
import { saveArticlesData } from '#modules/contentManager'
import { extractUrlParts } from '#libraries/http/fetch/url/extractUrlParts'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Article[] | { message: string }>
) {
    const { url } = req.query
    console.log('url', url)

    if (typeof url !== 'string') {
        return res.status(400).json({ message: 'URL must be a valid string.' })
    }

    try {
        const articles = await getFeedArticles(url)

        res.status(200).json(articles)
        const { hostname: feedHostname } = extractUrlParts(url)
        saveArticlesData(articles, feedHostname)
    } catch (error) {
        res.status(500).json(new Error('message'))
    }
}
