import "../assets/news.css"
import React, { useEffect, useState } from 'react';

export default function NewsView() {
    const [refresh, setRefresh] = useState(0);
    const [data, setData] = useState("");
    const [keywordLabel, setKeywordLabel] = useState("");
    const [keywords, setKeywords] = useState([""]);
    //const [articles, setArticles] = useState("");
    const [RealArticles, setRealArticles] = useState([]);
    const articles = [
        {
            keyword: "AMZN",
            url: "https://www.bloomberg.com/news/articles/2026-03-12/amazon-plans-to-shift-annual-prime-day-sale-to-june-from-july",
            headline: "Amazon Plans to Shift Annual Prime Day Sale to June From July",
            source: "Bloomberg",
            datetime: "March 12, 2026"
        },
        {
            keyword: "AMZN",
            url: "https://www.cnet.com/tech/services-and-software/amazon-to-increase-the-price-of-ad-free-prime-video-streaming",
            headline: "Amazon to Increase the Price of Ad-Free Prime Video Streaming",
            source: "CNET",
            datetime: "March 13, 2026"
        }
    ];

    const handleRetrieveKeywords = async (event) => {
        try {
            const response = await fetch('http://localhost:3000/api/retrieveKeywords', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            const retrievedKeywords = result.message.sort();
            console.log("Keywords retrieved: ", retrievedKeywords);
            setKeywords(retrievedKeywords);
        } catch (error) {
            console.error("Error calling server: ", error)
        }
    }

    const addKeyword = async (keywordToAdd) => {
        event.preventDefault(); // Needed to prevent page reload.
        if (keywordToAdd) {
            try {
                const response = await fetch('http://localhost:3000/api/addKeyword', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: keywordToAdd }) // Your parameters
                });
                const result = await response.json();
                console.log("Adding keyword was successful: ", result.successful);
                if (result.successful) {
                    setKeywords([...keywords, keywordToAdd].sort());
                }
                setRefresh(prev => prev + 1);

            } catch (error) {
                console.error("Error calling server: ", error)
            }
        }
    }

    const handleGetArticles = async (event) => {
        try {
            const response = await fetch('http://localhost:3000/api/getArticles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            console.log("Articles retrieved: ", result.message);
        } catch (error) {
            console.error("Error calling server: ", error)
        }
    }

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
                    </tr>
                </thead>
                <tbody>
                    {keywords.length > 0 ? (
                        keywords.map((keyword) => (
                            <tr key={keyword}>
                                <td>{keyword}</td>
                                <td><button onClick={() => removeKeyword(keyword)}>Remove</button></td>
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
    }

    function ArticleTable() {
        const handleArticleAnalysis = async (keywordName) => { // Placeholder, not coded nor implemented yet
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
                        const updatedKeywords = keywords.filter(keyword => keyword !== keywordName);
                        setKeywords(updatedKeywords)
                    }
                    setRefresh(prev => prev + 1);
                } catch (error) {
                    console.error("Error calling server: ", error)
                }
            }
        }

        return (
            <table class="article-table">
                <thead>
                    <tr>
                        <th>Keyword</th>
                        <th>Article</th>
                        <th>Source</th>
                        <th>Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="articleTableBody">
                    {articles.map((article) => (
                        <tr key={article.url}>
                            <td>{article.keyword}</td>
                            <td><a href={article.url}>{article.headline}</a></td>
                            <td>{article.source}</td>
                            <td>{article.datetime}</td>
                            <td><button class="btn">Analysis</button></td>
                            {/* <td><button onClick={() => handleArticleAnalysis(articleParameter)}>Analysis</button></td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    useEffect(() => {
        console.log("Page loaded!");
        handleRetrieveKeywords();
    }, []);


    let keywordSubtitle;
    if (keywords.length === 0) keywordSubtitle = "0 Keywords";
    else if (keywords.length === 1) keywordSubtitle = "1 Keyword";
    else keywordSubtitle = `${keywords.length} Keywords`;

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
                                id="keywordLabel"
                                type="text"
                                value={keywordLabel}
                                onChange={(e) => setKeywordLabel(e.target.value)}
                                autoComplete="off"
                                placeholder="Enter Keyword..."
                            />
                        </div>
                        <button class="btn" onClick={() => addKeyword(keywordLabel)}>Add Keyword</button>
                    </form>
                </div>

                <div class="grid-container-item">
                    <p>{keywordSubtitle}</p>
                    <div class="table-scroller">
                        {KeywordTable()}
                    </div>
                </div>

                <div class="column-span">
                    <button class="btn" id="gatherArticlesButton" onClick={handleGetArticles}>Gather Articles</button>
                </div>

                <div class="column-span">
                    <div class="table-scroller">
                        {ArticleTable()}
                    </div>
                </div>

            </div>
        </div>
    )
}