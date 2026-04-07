import { Routes, Route } from "react-router"
import Layout from "./components/page-layout.jsx"
import DashboardView from "./pages/dashboard.jsx"
import AnalyzerView from "./pages/analyzer.jsx"
import NewsView from "./pages/news.jsx"
import StocksView from "./pages/stocks.jsx"
import './App.css'

export default function App() {
  return (
      <Layout>
        {/* All the routes will go below here */}
        <Routes>
          <Route path='/home' element={<DashboardView />} />
          <Route path='/analyzer' element={<AnalyzerView />} />
          <Route path='/news' element={<NewsView />} />
          <Route path='/stocks' element={<StocksView />} />
        </Routes>
      </Layout>
  );
}
