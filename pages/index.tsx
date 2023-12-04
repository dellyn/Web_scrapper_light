import { Article } from '#logic/data/types'
import { Table } from '#modules/rss/components/Table'
import { useEffect, useState } from 'react'
import './global.scss'
import './styles.scss'

export default function Home() {
    const [feedResourceUrl, setFeedResourceUrl] = useState(
        'https://fox2now.com/feed'
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
        <div className="home-page">
            <header className="sticky-header">
                <input
                    type="text"
                    value={feedResourceUrl}
                    onChange={(e) => setFeedResourceUrl(e.target.value)}
                    className="url-input"
                />
                <button
                    className="action-button"
                    onClick={fetchArticles}
                    disabled={loading}
                >
                    Scrape Articles
                </button>
            </header>
            <Table data={articles} loading={loading} error={null} />
        </div>
    )
}
