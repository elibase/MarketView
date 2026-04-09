import { useState } from "react";
import "../assets/stocks.css";
import "../services/api.js";
import { useEffect } from "react";
import { getStocks } from "../services/api.js";

export default function StocksView(){

    const [stocks, setStocks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadStocks(){
            try{
                const data = await getStocks();
                setStocks(data.data || data);
            }catch (error){
                setError(error.message);
            }finally{
                setLoading(false);
            }
        }

        loadStocks();
    }, []);

    const filteredStocks = stocks.filter((stock) => 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Temporary cases
    if(error) return <p>{error}</p>

    return(
        <div class="page">
            <div class="stock-database-card">
                <div class="card-header">
                <h1>Stock Database</h1>
            </div>

            <div class="toolbar">
                <div class="search-wrapper">
                <input
                    type="text"
                    class="search-input"
                    placeholder="Search stock ticker or company name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button class="portfolio-button">Add to Portfolio</button>
            </div>

            <div class="table-wrapper">
                <table class="stock-table">
                    <thead>
                        <tr>
                        <th class="checkbox-col"></th>
                        <th>Symbol</th>
                        <th>Last</th>
                        <th>Vol</th>
                        <th>Change</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="stock-symbol">Loading...</td>
                            </tr>
                        ) : (
                            filteredStocks.map((stock) => (
                                <tr key={stock.symbol}>
                                    <td><input type="checkbox" /></td>
                                    <td>
                                        <div className="stock-symbol">{stock.symbol}</div>
                                        <div className="stock-name">{stock.name}</div>
                                    </td>
                                    <td>{stock.price}</td>
                                    <td>{stock.volume}</td>
                                    <td className={stock.changePercent > 0 ? "positive" : "negative"}>
                                        {stock.changePercent}%
                                    </td>
                                    <td><button className="news-button">News</button></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
}