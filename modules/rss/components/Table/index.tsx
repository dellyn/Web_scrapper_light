import React, { useEffect, useState } from 'react'
import { TableProps } from './types'
import './styles.scss'
import classNames from 'classnames'

const Table: React.FC<TableProps> = ({ data, loading }) => {
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>(
        {}
    )
    const isEmpty = !data.length
    const containerClassName = classNames('table', { empty: isEmpty })
    const isAnyExpanded = Object.keys(expandedRows).length > 0

    function toggleAllRows() {
        const allIds = isAnyExpanded
            ? {}
            : data.reduce<Record<string, boolean>>((acc, item) => {
                  acc[item.url] = true // Expand all rows
                  return acc
              }, {})

        setExpandedRows(allIds)
    }

    const toggleRow = (id: string) => {
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
        setExpandedRows({})
    }

    useEffect(() => {
        resetExpandedRows()
    }, [data])

    console.log({ expandedRows })

    const renderExpandBtn = (expanded: boolean, onClick: () => void) => (
        <button onClick={onClick} className="expand-btn">
            <span>{expanded ? '×' : '⋯'}</span>
        </button>
    )
    return (
        <table className={containerClassName}>
            <thead className="head">
                <tr>
                    <th>Title</th>
                    <th className="content-cell">
                        <span>Content</span>{' '}
                        {data.length
                            ? renderExpandBtn(isAnyExpanded, toggleAllRows)
                            : ''}
                    </th>
                    <th>URL</th>
                    <th>Published</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody className="body">
                {(loading || isEmpty) && (
                    <tr className={'table-row status-row'}>
                        <td colSpan={5}>
                            {loading ? 'Loading...' : ''}
                            {!loading && isEmpty ? 'No data' : ''}
                        </td>
                    </tr>
                )}
                {!isEmpty &&
                    data.map((item, index) => (
                        <tr key={index} className="table-row">
                            <td>{item.title}</td>
                            <td className="table-cell">
                                <div
                                    className={`content-cell ${
                                        expandedRows[item.url] ? 'expanded' : ''
                                    }`}
                                >
                                    <div className="text">{item.content}</div>
                                </div>
                                {renderExpandBtn(expandedRows[item.url], () =>
                                    toggleRow(item.url)
                                )}
                            </td>
                            <td>
                                <a
                                    className="link-button"
                                    href={item.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {item.url}
                                </a>
                            </td>
                            <td>{item.publishedAt}</td>
                            <td className="table-cell">
                                <div
                                    className={`content-cell ${
                                        expandedRows[item.url] ? 'expanded' : ''
                                    }`}
                                >
                                    <div className="text">
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
