const baseURL = 'http://localhost:8001';
let pageNum = 1; // Start with page 1
let bookPerPage = 12;
let booksNumInPage;

const booksContainer = document.querySelector('#booksContainer');

const bookModal = document.getElementById('bookModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalDescription = document.getElementById('modalDescription');
const modalAuthor = document.getElementById('modalAuthor');
const modalPageNumber = document.getElementById('modalPageNum');
const modalCopyNumber = document.getElementById('modalCopysNum');
const modalCategory = document.getElementById('modalCategory');
const modalISBN = document.getElementById('modalISBN');

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

        // Add event listener to book card div
        bookDiv.addEventListener('click', () => {
            // Populate modal with book details
            modalTitle.textContent = `Book Name: ${book.book_name}`;
            modalImage.src = book.image;
            modalImage.alt = book.book_name;
            modalAuthor.textContent = `Author: ${book.authors_name}`;
            modalDescription.textContent = `Description: ${book.short_description}`;
            modalPageNumber.textContent = `Page Number: ${book.num_pages}`;
            modalCopyNumber.textContent = `Copies: ${book.num_copies}`;
            modalCategory.textContent = `Category: ${book.categories}`;
            modalISBN.textContent = `ISBN: ${book.ISBN}`;

            // Display the modal
            bookModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the modal from opening when clicking delete
            deleteBook(book.id);
            console.log(book.id);
        });

        // Append delete button to book card div
        bookDiv.appendChild(deleteButton);

        // Append book card div to current row
        rowDiv.appendChild(bookDiv);
    });
};

function deleteBook(bookId) {
    // Confirm deletion
    const confirmation = confirm('Are you sure you want to delete this book?');
    if (!confirmation) return;
  
    // Send DELETE request to backend
    axios
      .delete(`${baseURL}/books?id=${bookId}`)
      .then((response) => {
        console.log(`Book with ID ${bookId} has been deleted.`);
  
        // Optionally, you can remove the deleted book from your local data as well
        // Remove the deleted book from the books array
        const index = books.findIndex((book) => book.id === bookId);
        if (index !== -1) {
          books.splice(index, 1);
          // After deleting the book, you may want to refresh the UI to reflect the changes
          displayBookImages(books);
        } else {
          console.error(`Book with ID ${bookId} not found in local data.`);
        }
      })
      .catch((err) => console.error(`Error deleting book with ID ${bookId}:`, err));
  }

// Event listener for closing the modal
closeModal.addEventListener('click', () => {
    // Hide the modal
    bookModal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Clear modal content
    modalTitle.textContent = '';
    modalImage.src = '';
    modalImage.alt = '';
    modalAuthor.textContent = '';
    modalDescription.textContent = '';
    modalPageNumber.textContent = '';
    modalCopyNumber.textContent = '';
    modalCategory.textContent = '';
    modalISBN.textContent = '';
});

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
