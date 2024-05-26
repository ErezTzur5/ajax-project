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
const buttonsDiv = document.getElementById('buttons');
const deleteButton = document.createElement('button');
//for edit/update
const editButton = document.createElement('button');
const updateModal = document.getElementById('updateBookModal');
const closeUpdateModal = document.getElementById('closeUpdateModal');
const updateButton = document.getElementById('updateBookBtn');


const displayBookImages = (books) => {
    // Clear existing content
    booksContainer.innerHTML = '';

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
            // catching the buttons div

            //delete
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', (event) => {
                deleteBook(book.id);
            });
            buttonsDiv.appendChild(deleteButton);

            //update
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', (event) => {
                updateModal.style.display = 'block';

                // Populate update modal with current book data
                document.getElementById('updateBookName').value = book.book_name;
                document.getElementById('updateAuthorsName').value = book.authors_name[0];
                document.getElementById('updateNumPages').value = book.num_pages;
                document.getElementById('updateShortDescription').value = book.short_description;
                document.getElementById('updateImage').value = book.image;
                document.getElementById('updateNumCopies').value = book.num_copies;
                document.getElementById('updateCategories').value = book.categories[0];
                document.getElementById('updateISBN').value = book.ISBN;

                updateButton.addEventListener('click', (event) => {
                    updateBook(book.id);
                });
            });
            buttonsDiv.appendChild(editButton);
        });

        // Append book card div to current row
        rowDiv.appendChild(bookDiv);
    });
};

// event listener for closing the book popup and reset 
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
    buttonsDiv.innerHTML = '';
});

// event listener for closing the post popup and reset 
closeUpdateModal.addEventListener('click', () => {
    // Hide the modal
    updateModal.style.display = 'none';
    bookModal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // clear content

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

function deleteBook(bookId) {
    const url = `http://localhost:8001/books/${bookId}`;

    axios.delete(url)
        .then(response => {
            console.log(`Book with ID ${bookId} deleted successfully.`);
            location.reload();


        })
        .catch(error => {
            console.error(`There was an error deleting the book with ID ${bookId}:`, error);
        });

}

function updateBook(bookId) {
    const url = `http://localhost:8001/books/${bookId}`;


    const updatedBook = {
        book_name: document.getElementById('updateBookName').value,
        authors_name: [document.getElementById('updateAuthorsName').value],
        num_pages: parseInt(document.getElementById('updateNumPages').value),
        short_description: document.getElementById('updateShortDescription').value,
        image: document.getElementById('updateImage').value,
        num_copies: parseInt(document.getElementById('updateNumCopies').value),
        categories: [document.getElementById('updateCategories').value],
        ISBN: document.getElementById('updateISBN').value
    };

    axios.put(url, updatedBook)
        .then(response => {
            console.log(`Book with ID ${bookId} updated successfully.`);
            console.log(response.data);
            updateModal.style.display = 'none'
            window.location.reload();

        })
        .catch(error => {
            console.error(`There was an error updating the book with ID ${bookId}:`, error);
        });
}


// Call the function to display book images when the page loads
window.onload = () => fetchBooks(pageNum);
