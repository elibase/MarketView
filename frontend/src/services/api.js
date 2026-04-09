const API_URL  = import.meta.env.VITE_API_URL;

export async function getStocks(){
    const response = await fetch(`${API_URL}/api/stocks`);

    if(!response.ok){
        throw new Error(`Failed to fetch stocks from backend API` )
    }

    return response.json();
}