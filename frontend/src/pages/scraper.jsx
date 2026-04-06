import "../assets/scraper.css"
import React, { useEffect, useState } from 'react';

export default function ScraperView(){
    const [data, setData] = useState("");

    const callServer = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/message');
            const result = await res.json();
            setData(result.message);
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
                <button onClick={callServer}>Call Node Server</button>
                <p>Reponse: {data}</p>
            </div>
            <div class="header">
                <h1>Financial News Scraper</h1>
            </div>

            <div class="grid-container">
                <div class="grid-container-item">
                    <form action="/submit-scraper-keyword" method="POST">
                        <div class="search">
                            <input
                                id="scraper-keyword" 
                                name="scraper-keyword"
                                type="text" 
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