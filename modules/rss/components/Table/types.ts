import { Article } from '#logic/data/types'

export interface TableProps {
    data: Article[]
    loading: boolean
    error: any
}
