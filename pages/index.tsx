import { Article } from '#logic/data/types'
import { Table } from '#modules/rss/components/Table'
import { useEffect, useState } from 'react'
export default function Home() {
    const [feedResourceUrl, setFeedResourceUrl] = useState(
        'https://www.michigandaily.com/feed'
    )
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(false)

    const fetchArticles = async () => {
        setLoading(true)
        try {
            const response = await fetch(
                `/api/fetchRssAndScrapeContent?url=${feedResourceUrl}`
            )
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

    useEffect(() => {
        const urls = articles.map((article) => article.url)
    }, [articles])

    return (
        <div>
            <input
                type="text"
                value={feedResourceUrl}
                onChange={(e) => setFeedResourceUrl(e.target.value)}
            />
            <button onClick={fetchArticles} disabled={loading}>
                Scrape Articles
            </button>

            <Table data={articles} loading={loading} error={null} />
        </div>
    )
}
