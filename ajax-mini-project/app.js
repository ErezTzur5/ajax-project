const baseURL = 'http://localhost:8001';
let pageNum = 1; // Start with page 1
let bookPerPage = 12;
let booksNumInPage;


const booksContainer = document.querySelector('#booksContainer');

const displayBookImages = (books) => {
    // Clear existing content
    booksContainer.innerHTML = '';

    // Create a new row div for every 4 books
    let rowDiv;
    books.forEach((book, index) => {
        // Start a new row after every 4 books
        if (index % 4 === 0) {
            rowDiv = document.createElement('div');
            rowDiv.classList.add('row');
            booksContainer.appendChild(rowDiv);
        }

        // Create book card div
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book-card');

        // Create image element
        const img = document.createElement('img');
        img.src = book.image;
        img.alt = book.book_name;

        // Append image to book card div
        bookDiv.appendChild(img);

        // Append book card div to current row
        rowDiv.appendChild(bookDiv);
    });
};

function fetchBooks() {
  let url = `${baseURL}/books?_page=${pageNum}&_per_page=${bookPerPage}`;
  axios
    .get(url)
    .then((response) => {
      const books = response.data;
      booksNumInPage = books.data.length;
      displayBookImages(books.data); // Call displayBookImages function to display the books
    })
    .catch((err) => console.error(err));
}

function nextHandler() {
    if (bookPerPage === booksNumInPage) {
        pageNum++; // Increment the page number
        fetchBooks(pageNum); 
    }
    else {
        console.log("not enough books");
    }
}

function prevHandler() {
  if (pageNum > 1) {
    pageNum--; // Decrement the page number
    fetchBooks(pageNum);
  }
}

function search(event) {
    event.preventDefault(); // Prevents the default form submission behavior
    var searchInput = document.getElementById('searchBookName').value.toLowerCase();    
    console.log(searchInput);

    axios.get(`${baseURL}/books`)
        .then((response) => {
            const allBooks = response.data;
            console.log('ALL', allBooks);
            
            // Filter books based on search input
            filteredBooks = allBooks.filter(book => book.book_name.toLowerCase().includes(searchInput));
            console.log('Filtered Books:', filteredBooks);
            
            // Reset the page number to 1
            pageNum = 1;

            // Display the first page of the filtered books
            displayBookImages(filteredBooks);
        })
        .catch((err) => console.error(err));
}

// Call the function to display book images when the page loads
window.onload = () => fetchBooks(pageNum);
