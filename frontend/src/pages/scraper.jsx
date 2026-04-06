import "../assets/scraper.css"
import React, { useEffect, useState } from 'react';

export default function ScraperView(){
    const [data, setData] = useState("");
    const [keyword, SetKeyword] = useState("");
    const [keywords, SetKeywords] = useState("");
    const [articles, setArticles] = useState("");

    const demoCallServer = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/message');
            const result = await res.json();
            setData(result.message);
        } catch (error) {
            console.error("Error calling server: ", error)
        }
    }

    const handleAddKeyword = async (event) => {
        event.preventDefault();
        if (keyword){
            console.log(keyword)
        }

        if (keyword) {
            try {
                const response = await fetch('http://localhost:3000/api/addKeyword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: keyword }) // Your parameters
                });
                const result = await response.json();
                console.log("Adding keyword was successful: ", result.successful)
            } catch (error) {
                console.error("Error calling server: ", error)
            }
        }

        

    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const exampleKeywords = ["AMZN", "Amazon"];
        
        try {
            const response = await fetch('http://localhost:3000/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(exampleKeywords) // Your parameters
            });
            const result = await response.json();
            console.log(result)
            setArticles(result.kwl)
        } catch (error) {
            console.error("Error calling server: ", error)
        }
        
    }

    

    useEffect(() => {
        console.log("Page loaded!");
        myAutoFunction();
    },    []);

    const myAutoFunction = () => {

    };
    
    return(
        <div class="main">
            <div>
                <button onClick={demoCallServer}>Call Node Server</button>
                <p>Response: {data}</p>
            </div>

            <div>
                <button onClick={handleSubmit}>Call Node Server 2</button>
                <p>Response: {articles}</p>
            </div>
            <div class="header">
                <h1>Financial News Scraper</h1>
            </div>

            <div class="grid-container">
                <div class="grid-container-item">
                    <form onSubmit={handleAddKeyword}>
                        <div class="search">
                            <input
                                id="keyword" 
                                type="text"
                                value={keyword}
                                onChange={(e) => SetKeyword(e.target.value)}
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
                        <table class="keyword-table">
                            <tr>
                                <th></th>
                                <th></th>
                            </tr>
                            <tr>
                                <form action="/remove-scraper-keyword" method="POST">
                                    <td>AMZN</td>
                                    <td><button class="btn" type="submit">Remove</button></td>
                                </form>
                            </tr>
                        </table>
                    </div>
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