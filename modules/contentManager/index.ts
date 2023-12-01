import fs from 'fs'
import path from 'path'
import { extractUrlParts } from '#libraries/url/extractUrlParts'
import { Article } from '#logic/data/types'
import { ScrappedContent } from '#modules/contentScrapper/services/scrapper/types'

function getFilePath(fileName = 'default') {
    const id = 'v0'
    return path.join(
        process.cwd(),
        `modules/contentManager/store/${id}_${fileName}.json`
    )
}

export function writeArticlesDataToFile(
    articles: Article[],
    feedHostname: string
) {
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

        fs.writeFileSync(
            filePath,
            JSON.stringify(updatedArticles, null, 2),
            'utf8'
        )
    })
}

export function updateArticleContentInFile(
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

export function mergeArticlesContent(
    articles: Article[],
    articlesContent: ScrappedContent[]
) {
    const mergedArticles = articlesContent.length
        ? articles.map((article) => {
              const correspondingArticleContent = articlesContent.find(
                  (articleContent) => articleContent.url === article.url
              )
              return {
                  ...article,
                  content:
                      correspondingArticleContent?.content || article.content,
              }
          })
        : articles

    return mergedArticles
}
