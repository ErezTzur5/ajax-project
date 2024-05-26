const axios = require('axios');
const fs = require('fs');

// Your Google Books API key
const API_KEY = 'YOUR_GOOGLE_BOOKS_API_KEY';

// Function to fetch book data from Google Books API
async function fetchBooks(query, maxResults = 5) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResults}&key=${API_KEY}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from Google Books API: ${error}`);
        return null;
    }
}

// Function to format book data
function formatBookData(book) {
    const volumeInfo = book.volumeInfo || {};
    const imageLinks = volumeInfo.imageLinks || {};

    const formattedBook = {
        id: book.id || '',
        'book name': volumeInfo.title || '',
        'authors name': volumeInfo.authors || [],
        'num pages': volumeInfo.pageCount || 0,
        'short description': volumeInfo.description || '',
        image: imageLinks.thumbnail || '',
        'num copies': 1,  // Assuming 1 copy initially
        categories: volumeInfo.categories || [],
        ISBN: null
    };

    // Extract ISBN
    const identifiers = volumeInfo.industryIdentifiers || [];
    for (const identifier of identifiers) {
        if (identifier.type === 'ISBN_10' || identifier.type === 'ISBN_13') {
            formattedBook.ISBN = identifier.identifier;
            break;
        }
    }

    return formattedBook;
}

// Main function to fetch, format, and save book data
async function main(query, maxResults = 5, outputFile = 'db.json') {
    const booksData = await fetchBooks(query, maxResults);
    if (!booksData || !booksData.items) {
        console.error('No book data found.');
        return;
    }

    const formattedBooks = booksData.items.map(formatBookData);

    fs.writeFile(outputFile, JSON.stringify(formattedBooks, null, 4), (err) => {
        if (err) {
            console.error(`Error writing to file: ${err}`);
        } else {
            console.log(`Data successfully written to ${outputFile}`);
        }
    });
}

// Replace 'harry potter' with your desired query and adjust maxResults as needed
main('harry potter', 10);
