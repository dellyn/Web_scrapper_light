export interface PageToScrape {
    url: string
}

export interface ScrappedContent {
    url: string
    content: string
}

export interface HostnameSelectors {
    [key: string]: string
}
