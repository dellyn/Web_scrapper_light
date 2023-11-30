import { IExtractUrlParts } from './types'

export function extractUrlParts(url = ''): IExtractUrlParts {
    if (!url) return { tld: '', domain: '', hostname: '' }
    const urlObj = new URL(url)
    const subdomains = urlObj.hostname.split('.')
    const tld = subdomains[subdomains.length - 1]

    if (subdomains[0] === 'www') {
        subdomains.shift()
    }
    subdomains.pop()
    const domain = subdomains.join('.')

    return { hostname: urlObj.hostname, domain, tld }
}
