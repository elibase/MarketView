import "../assets/news.css"
import "../services/api.js";
import React, { useEffect, useState } from 'react';
import { addKeyword, removeKeyword, getKeywords, getArticles } from "../services/api.js";

export default function NewsView() {
    const [refresh, setRefresh] = useState(0);
    const [symbols, setSymbols] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [input, setInput] = useState("");
    const [keywords, setKeywords] = useState([""]);
    const [articles, setArticles] = useState([]);

    const callGetKeywords = async (event) => {
        try {
            const result = await getKeywords();
            const retrievedKeywords = result.message.sort();
            setKeywords(retrievedKeywords);
        } catch (error) {
            console.error("Error calling server: ", error)
        }
    };

    const callAddKeyword = async (enteredInput) => {
        event.preventDefault(); // Needed to prevent page reload.
        const keywordToAdd = enteredInput.split("-").map(identifier => identifier.trim())[0].toUpperCase();
        if (keywordToAdd) {
            try {
                const result = await addKeyword(keywordToAdd);
                if (result.successful) {
                    setKeywords([...keywords, keywordToAdd].sort());
                }
                setRefresh(prev => prev + 1);

            } catch (error) {
                console.error("Error calling server: ", error)
            }
        }
    };

    const callGetArticles = async (articleKeyword) => {
        try {
            const result = await getArticles(articleKeyword);
            //console.log("Articles received: ", result.message);
            setArticles(result.message);
        } catch (error) {
            console.error("Error calling server: ", error)
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInput(value);

        if (value.length > 0) {
            //const regex = new RegExp(`^${value}`, 'i');
            const regex = new RegExp(value, 'i');
            setFiltered(suggestions.filter(v => regex.test(v)));
        } else {
            setFiltered([]);
        }
    };



    function KeywordTable() {
        const callRemoveKeyword = async (keywordName) => {
            if (keywordName) {
                try {
                    const result = await removeKeyword(keywordName);
                    if (result.successful) {
                        const updatedKeywords = keywords.filter(keyword => keyword !== keywordName).sort();
                        setKeywords(updatedKeywords);
                    }
                    setRefresh(prev => prev + 1);
                } catch (error) {
                    console.error("Error calling server: ", error)
                }
            }
        }

        return (
            <table class="keyword-table">
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {keywords.length > 0 ? (
                        keywords.map((keyword) => (
                            <tr key={keyword}>
                                <td>{keyword}</td>
                                <td><button class="btn" onClick={() => callGetArticles(keyword)}>Gather Articles</button></td>
                                <td><button class="btn" onClick={() => callRemoveKeyword(keyword)}>Remove</button></td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td>No keywords found!</td>
                            <td>Add some!</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    };

    function ArticleTable() {
        const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

        // Sorting logic
        const sortedData = React.useMemo(() => {
            let sortableItems = [...articles];
            if (sortConfig !== null) {
                sortableItems.sort((a, b) => {
                    if (a[sortConfig.key] < b[sortConfig.key]) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (a[sortConfig.key] > b[sortConfig.key]) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                    return 0;
                });
            }
            return sortableItems;
        }, [articles, sortConfig]);

        // Request sort function
        const requestSort = (key) => {
            let direction = 'ascending';
            if (sortConfig.key === key && sortConfig.direction === 'ascending') {
                direction = 'descending';
            }
            setSortConfig({ key, direction });
        };

        return (
            <table>
                <thead>
                    <tr>
                        {/* Form controls (buttons) within headers */}
                        <th onClick={() => requestSort('headline')}>Headline {sortConfig.key === 'headline' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}</th>
                        <th onClick={() => requestSort('source')}>Source {sortConfig.key === 'source' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}</th>
                        <th onClick={() => requestSort('datetime')}>Date {sortConfig.key === 'datetime' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map(article => (
                        <tr key={article.url}>
                            <td><a href={article.url}>{article.headline}</a></td>
                            <td>{article.source}</td>
                            <td>{article.readableDatetime}</td>
                            <td><button class="btn">Analysis</button></td>
                            {/* <td><button onClick={() => handleArticleAnalysis(articleParameter)}>Analysis</button></td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };


    useEffect(() => {
        console.log("Page loaded!");
        callGetKeywords(); // Retrieve any articles from server (in theory it would use user ID, in practice it retrieves a hardcoded list)

        fetch('../../suggestions.txt') // Ensure file is in the public folder
            .then(response => response.text())
            .then(text => {
                // Split by newline and remove empty strings
                const lines = text.split('\n').filter(line => line.trim() !== "").map(line => line.substring(0, line.length - 1));
                setSuggestions(lines);
            });
    }, []);

    let keywordSubtitle;
    if (keywords.length === 0) keywordSubtitle = "0 Symbols";
    else if (keywords.length === 1) keywordSubtitle = "1 Symbol";
    else keywordSubtitle = `${keywords.length} Symbols`;

    return (

        <div class="main">
            <div class="header">
                <h1>Financial News</h1>
            </div>

            <div class="grid-container">
                <div class="grid-container-item">
                    <form>
                        <div class="search">
                            <input
                                id="input"
                                type="text"
                                value={input}
                                onChange={handleInputChange}
                                list="suggestions"
                                placeholder="Enter Keyword..."
                            />
                            <datalist id="suggestions">
                                {filtered.map((item, index) => (
                                    <option key={index} value={item} />
                                ))}
                            </datalist>
                        </div>
                        <button class="btn" onClick={() => callAddKeyword(input)}>Add Symbol</button>
                    </form>
                </div>

                <div class="grid-container-item">
                    <p>{keywordSubtitle}</p>
                    <div class="table-scroller">
                        {KeywordTable()}
                    </div>
                </div>

                {/*<div class="column-span">
                    <button class="btn" id="gatherArticlesButton" onClick={handleGetArticles}>Gather Articles</button>
                </div>*/}



                <div class="column-span">
                    <div class="article-table-scroller">
                        <div>{ArticleTable()}</div>
                    </div>
                </div>

            </div>
        </div>
    )
}