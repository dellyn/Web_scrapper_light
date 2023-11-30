// Define the structure of your RSS feed items
import { Article } from '#logic/data/types'
import { Output as RSSOutput } from 'rss-parser'

interface ArticleRSSItem {
    'content:encoded'?: Article['content']
    pubDate?: Article['publishedAt']
    link?: Article['url']
    title?: Article['title']
    description?: Article['description']
}

export interface RSSFeed extends RSSOutput<ArticleRSSItem> {
    items: ArticleRSSItem[]
}
