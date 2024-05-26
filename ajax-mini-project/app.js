const baseURL = 'http://localhost:8001';
let pageNum = 1; // Start with page 1

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

function fetchBooks(pageNum) {
  let url = `${baseURL}/books?_page=${pageNum}&_per_page=12`;
  axios
    .get(url)
    .then((response) => {
      const books = response.data;
      console.log(books.data);
      console.log(pageNum);
      displayBookImages(books.data); // Call displayBookImages function to display the books
    })
    .catch((err) => console.error(err));
}

function nextHandler() {
  pageNum++; // Increment the page number
  fetchBooks(pageNum);
}

function prevHandler() {
  if (pageNum > 1) {
    pageNum--; // Decrement the page number
    fetchBooks(pageNum);
  }
}

// Call the function to display book images when the page loads
window.onload = () => fetchBooks(pageNum);
