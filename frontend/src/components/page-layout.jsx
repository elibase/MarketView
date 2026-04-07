import "../App.css"

export default function Layout ({ children }){
    return(
        <div class="container">
            <div class="sidebar">
                <a href="/home">Home</a>
                <a href="/stocks">Stocks</a>
                <a href="/news">News</a>
                <a href="/analyzer">Analyzer</a>
            </div>
            <main>
            {children}
            </main>
        </div>
    );
}