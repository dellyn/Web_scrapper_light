import { PageToScrape } from '#modules/contentScrapper/services/scrapper/types'

export interface Payload {
    pagesToScrape: PageToScrape[]
    resourceUrl: string
}
