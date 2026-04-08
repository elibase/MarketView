import "../assets/news.css"
import React, { useEffect, useState } from 'react';

export default function NewsView() {
    const [refresh, setRefresh] = useState(0);
    const [symbols, setSymbols] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [input, setInput] = useState("");
    const [keywords, setKeywords] = useState([""]);
    const [articles, setArticles] = useState([]);

    const handleRetrieveKeywords = async (event) => {
        try {
            const response = await fetch('http://localhost:3000/api/retrieveKeywords', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            const retrievedKeywords = result.message.sort();
            //console.log("Keywords retrieved: ", retrievedKeywords);
            setKeywords(retrievedKeywords);
        } catch (error) {
            console.error("Error calling server: ", error)
        }
    };

    const addKeyword = async (enteredInput) => {
        event.preventDefault(); // Needed to prevent page reload.

        const inputInSuggestions = suggestions.includes(enteredInput);

        const keywordToAdd = enteredInput.split("-").map(identifier => identifier.trim())[0].toUpperCase();
        if (keywordToAdd) {
            try {
                const response = await fetch('http://localhost:3000/api/addKeyword', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: keywordToAdd }) // Your parameters
                });
                const result = await response.json();
                //console.log("Adding keyword was successful: ", result.successful);
                if (result.successful) {
                    setKeywords([...keywords, keywordToAdd].sort());
                }
                setRefresh(prev => prev + 1);

            } catch (error) {
                console.error("Error calling server: ", error)
            }
        }
    };

    const getArticles = async (articleKeyword) => {
        try {
            const response = await fetch('http://localhost:3000/api/getArticles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: articleKeyword }) // Your parameters
            });
            const result = await response.json();
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
        const removeKeyword = async (keywordName) => {
            if (keywordName) {
                try {
                    const response = await fetch('http://localhost:3000/api/removeKeyword', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: keywordName }) // Your parameters
                    });
                    const result = await response.json();
                    console.log("Removal of keyword was successful: ", result.successful)
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
                                <td><button class="btn" onClick={() => getArticles(keyword)}>Gather Articles</button></td>
                                <td><button class="btn" onClick={() => removeKeyword(keyword)}>Remove</button></td>
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
        handleRetrieveKeywords(); // Retrieve any articles from server (in theory it would use user ID, in practice it retrieves a hardcoded list)

        fetch('../../suggestions.txt') // Ensure file is in the public folder
            .then(response => response.text())
            .then(text => {
                // Split by newline and remove empty strings
                const lines = text.split('\n').filter(line => line.trim() !== "").map(line => line.substring(0, line.length-2));
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
                    {/* <form onSubmit={handleAddKeyword}> */}
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
                        <button class="btn" onClick={() => addKeyword(input)}>Add Symbol</button>
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