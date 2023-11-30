import React, { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { TableProps } from './types'

const Table: React.FC<TableProps> = ({ data, loading }) => {
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>(
        {}
    )
    const isEmpty = !data.length

    const toggleRow = (id: number) => {
        const updatedList = { ...expandedRows }
        const isExpanded = !!expandedRows[id]

        if (isExpanded) {
            delete updatedList[id]
        } else {
            updatedList[id] = true
        }
        setExpandedRows(updatedList)
    }

    function resetExpandedRows() {
        setExpandedRows([])
    }

    useEffect(() => {
        resetExpandedRows()
    }, [data])

    return (
        <table className={`${styles.table} ${isEmpty ? '' : styles.empty}`}>
            <thead className={styles.thead}>
                <tr>
                    <th>Title</th>
                    <th>Content</th>
                    <th>URL</th>
                    <th>Published</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody className={styles.tbody}>
                {(loading || isEmpty) && (
                    <tr className={`${styles.tableRow} ${styles.statusRow}`}>
                        <td colSpan={5}>
                            {loading ? 'Loading...' : ''}
                            {!loading && isEmpty ? 'No data' : ''}
                        </td>
                    </tr>
                )}
                {!isEmpty &&
                    data.map((item, index) => (
                        <tr key={index} className={styles.tableRow}>
                            <td>{item.title}</td>
                            <td className={styles.contentCell}>
                                <div
                                    className={
                                        expandedRows[index]
                                            ? `${styles.contentCell} ${styles.contentCellExpanded}`
                                            : styles.contentCell
                                    }
                                >
                                    <div className={styles.text}>
                                        {item.content}
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleRow(index)}
                                    // should use unicode characters instead
                                    className={styles.expandBtn}
                                >
                                    {
                                        <span>
                                            {expandedRows[index] ? '×' : '⋯'}
                                        </span>
                                    }
                                </button>
                            </td>
                            <td>
                                <a
                                    className={styles.linkButton}
                                    href={item.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {item.url}
                                </a>
                            </td>
                            <td>{item.publishedAt}</td>
                            <td className={styles.contentCell}>
                                <div
                                    className={
                                        expandedRows[index]
                                            ? `${styles.contentCell} ${styles.contentCellExpanded}`
                                            : styles.contentCell
                                    }
                                >
                                    <div className={styles.text}>
                                        {item.description}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table>
    )
}

export { Table }
