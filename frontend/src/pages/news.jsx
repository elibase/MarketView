import "../assets/news.css"
import React, { useEffect, useState } from 'react';

export default function NewsView() {
    const [refresh, setRefresh] = useState(0);
    const [data, setData] = useState("");
    const [keyword, setKeyword] = useState("");
    const [keywords, setKeywords] = useState([""]);
    const [articles, setArticles] = useState("");

    const handleRetrieveKeywords = async (event) => {
        try {
            const response = await fetch('http://localhost:3000/api/retrieveKeywords', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            console.log("Keywords retrieved: ", result.message);
            setKeywords(result.message);
        } catch (error) {
            console.error("Error calling server: ", error)
        }
    }

    const handleAddKeyword = async (event) => {
        event.preventDefault();

        if (keyword) {
            try {
                const response = await fetch('http://localhost:3000/api/addKeyword', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: keyword }) // Your parameters
                });
                const result = await response.json();
                console.log("Adding keyword was successful: ", result.successful);
                if (result.successful) {
                    setKeywords([...keywords, keyword])
                }
                setRefresh(prev => prev + 1);

            } catch (error) {
                console.error("Error calling server: ", error)
            }
        }
    }

    function KeywordTable() {
        const handleRemoveKeyword = async (keywordName) => {
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
            <table class="keyword-table">
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {keywords.map((keyword) => (
                        <tr key={keyword}>
                            <td>{keyword}</td>
                            <td><button onClick={() => handleRemoveKeyword(keyword)}>Remove</button></td>
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



    return (
        <div class="main">
            <div class="header">
                <h1>Financial News</h1>
            </div>
            <div class="grid-container">
                <div class="grid-container-item">
                    <form onSubmit={handleAddKeyword}>
                        <div class="search">
                            <input
                                id="keyword"
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                autoComplete="off"
                                placeholder="Enter Keyword..."
                            />
                        </div>
                        <button class="btn" type="submit">Add Keyword</button>
                    </form>
                </div>

                <div class="grid-container-item">
                    <p>Keywords</p>
                    <div class="table-scroller">
                        {KeywordTable()}
                    </div>

                    {/* 
                    <div class="table-scroller">
                        <table class="keyword-table">
                            <tr>
                                <th></th>
                                <th></th>
                            </tr>
                            <tr>
                                <form action="/remove-news-keyword" method="POST">
                                    <td>AMZN</td>
                                    <td><button class="btn" type="submit">Remove</button></td>
                                </form>
                            </tr>
                        </table>
                    </div>
                    */}
                </div>

                <div class="column-span">
                    <button class="btn" id="gatherArticlesButton">Gather Articles</button>
                </div>

                <div class="column-span">
                    <div class="table-scroller">
                        <table id="articleTable" class="article-table">
                            <thead>
                                <tr>
                                    <th>Keyword</th>
                                    <th>Article</th>
                                    <th>Publisher</th>
                                    <th>Publish Date</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody id="articleTableBody">



                                {/* 
                                <tr>
                                    <td>AMZN</td>
                                    <td><a
                                            href="https://www.bloomberg.com/news/articles/2026-03-12/amazon-plans-to-shift-annual-prime-day-sale-to-june-from-july">Amazon
                                            Plans to Shift Annual Prime Day Sale to June From July</a></td>
                                    <td>Bloomberg</td>
                                    <td>March 12, 2026</td>
                                    <td><button class="btn">Analysis</button></td>
                                </tr>

                                <tr>
                                    <td>AMZN</td>
                                    <td><a
                                            href="https://www.cnet.com/tech/services-and-software/amazon-to-increase-the-price-of-ad-free-prime-video-streaming/">Amazon
                                            to Increase the Price of Ad-Free Prime Video Streaming</a></td>
                                    <td>CNET</td>
                                    <td>March 13, 2026</td>
                                    <td><button class="btn">Analysis</button></td>
                                </tr>
                                */}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    )
}