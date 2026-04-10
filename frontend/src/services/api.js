const API_URL = import.meta.env.VITE_API_URL;

export async function getStocks() {
    const response = await fetch(`${API_URL}/api/stocks`);

    if (!response.ok) {
        throw new Error(`Failed to fetch stocks from backend API`)
    }

    return response.json();
}

export async function test(keywordToAdd) {
    console.log(keywordToAdd);
    return undefined;
}

export async function addKeyword(keywordToAdd) {
    const response = await fetch(`${API_URL}/api/news/addKeyword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: keywordToAdd }) // Your parameters
    });

    console.log("response = ", response);
    console.log(typeof response);

    if (!response.ok) {
        throw new Error(`Failed to add keyword`)
    }

    return response.json();
}

export async function removeKeyword(keywordToRemove) {
    const response = await fetch(`${API_URL}/api/news/removeKeyword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: keywordToRemove }) // Your parameters
    });

    if (!response.ok) {
        throw new Error(`Failed to remove keyword`)
    }

    return response.json();
}

export async function getKeywords() {
    const response = await fetch(`${API_URL}/api/news/retrieveKeywords`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(`Failed to fetch keywords`)
    }
    return result;
}

export async function getArticles(articleKeyword) {
    const response = await fetch(`${API_URL}/api/news/getArticles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: articleKeyword })
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch articles`)
    }

    return response.json();
}