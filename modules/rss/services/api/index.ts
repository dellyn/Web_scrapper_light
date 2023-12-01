import { getFeedArticles } from '../rssFeed'
import { extractUrlParts } from '#libraries/url/extractUrlParts'
import { writeArticlesDataToFile } from '#modules/contentManager'

export async function getRssFeedArticles(url: string) {
    const articles = await getFeedArticles(url)
    const { hostname: feedHostname } = extractUrlParts(url)
    writeArticlesDataToFile(articles, feedHostname)
    return articles
}
