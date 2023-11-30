import { Article } from '#logic/data/types'
import { ScrappedContent } from '#modules/contentScrapper/services/scrapper/types'
import { Table } from '#modules/rss/components/Table'
import { useEffect, useState } from 'react'

export default function Home() {
    const [feedResourceUrl, setFeedResourceUrl] = useState(
        'https://www.michigandaily.com/feed'
    )
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(false)
    const [articlesContent, setArticlesContent] = useState<ScrappedContent[]>(
        []
    )

    const fetchArticles = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/rss?url=${feedResourceUrl}`)
            const data = await response.json()
            if (Array.isArray(data)) {
                setArticles(data)
            } else {
                setArticles([])
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    async function scrapeArticlesContent() {
        const response = await fetch(`/api/scrapeContent`, {
            method: 'POST',
            body: JSON.stringify({ data: articles, feedResourceUrl }),
        })
        const data = await response.json()
        if (data) {
            setArticlesContent(data)
        }
    }

    useEffect(() => {
        const urls = articles.map((article) => article.url)
    }, [articles])

    const mergedArticles = articlesContent.length
        ? articles.map((article) => {
              const correspondingArticleContent = articlesContent.find(
                  (articleContent) => articleContent.url === article.url
              )
              return {
                  ...article,
                  content:
                      correspondingArticleContent?.content || article.content,
                  description:
                      correspondingArticleContent?.content ||
                      article.description,
              }
          })
        : articles

    return (
        <div>
            <input
                type="text"
                value={feedResourceUrl}
                onChange={(e) => setFeedResourceUrl(e.target.value)}
            />
            <button onClick={fetchArticles}>Fetch RSS</button>
            <button onClick={scrapeArticlesContent}>Scrape content</button>
            <Table data={mergedArticles} loading={loading} error={null} />
        </div>
    )
}
