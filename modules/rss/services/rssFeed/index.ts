import { Article } from '#logic/data/types'
import { fetchWithRedirect } from '#libraries/http/fetch'
import RSSParser from 'rss-parser'
import { JSDOM } from 'jsdom'
import { RSSFeed } from './types'

async function fetchFeed(url: string): Promise<RSSFeed> {
    const result = await fetchWithRedirect(url)
    const xml = await result?.text()
    const parser = new RSSParser()
    const feed = (await parser.parseString(xml)) as RSSFeed
    return feed
}

export function parseArticlesFromFeed(rssFeed: RSSFeed): Article[] {
    return rssFeed.items.map((item = {}) => {
        const dom = new JSDOM(item['content:encoded'] || '')
        const textContent =
            dom?.window?.document?.body?.textContent?.trim() || ''

        return {
            publishedAt: item.pubDate
                ? new Date(item.pubDate).toISOString()
                : '',
            url: item.link || '',
            title: item.title || '',
            // content: textContent || '',
            content: '',
            description: item.description || '',
        }
    })
}

export async function getFeedArticles(url: string): Promise<Article[]> {
    const rssFeed = await fetchFeed(url)
    return parseArticlesFromFeed(rssFeed)
}
