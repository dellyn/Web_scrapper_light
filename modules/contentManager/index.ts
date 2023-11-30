import fs from 'fs'
import path from 'path'
import { extractUrlParts } from '#libraries/http/fetch/url/extractUrlParts'
import { Article } from '#logic/data/types'

function getFilePath(fileName = 'default') {
    const id = 'v0'
    return path.join(
        process.cwd(),
        `modules/contentManager/store/${id}_${fileName}.json`
    )
}

export function saveArticlesData(articles: Article[], feedHostname: string) {
    articles.forEach((article) => {
        const { hostname } = extractUrlParts(article.url)
        if (!hostname) return
        const filePath = getFilePath(feedHostname)
        let updatedArticles = []

        if (fs.existsSync(filePath)) {
            updatedArticles =
                JSON.parse(fs.readFileSync(filePath, 'utf8')) || []
        }

        const existingArticle = updatedArticles.find(
            (existingArticle: Article) => existingArticle.url === article.url
        )

        if (!existingArticle) {
            updatedArticles.push(article)
        }

        fs.writeFileSync(filePath, JSON.stringify(articles, null, 2), 'utf8')
    })
}

export function updateArticleContent(
    url = '',
    content = '',
    feedHostname: string
) {
    const filePath = getFilePath(feedHostname)
    if (!fs.existsSync(filePath)) return

    let articles = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const existingArticle = articles.find(
        (article: Article) => article.url === url
    )

    if (existingArticle) {
        existingArticle.content = content
        fs.writeFileSync(filePath, JSON.stringify(articles, null, 2), 'utf8')
    }
}
