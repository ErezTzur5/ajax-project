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
// for creating books
const createButton = document.getElementById('createBook');
const createDiv = document.getElementById('modal-create-content');
const closeCreateButton = document.getElementById('closecreateModal');
const bookModalCreate = document.getElementById('bookModalCreate');

// history
const historyDiv = document.getElementById('history-container');


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

        // Set the width and height of the image
        img.width = 131.59; // Adjust this value as needed
        img.height = 199.25; // Adjust this value as needed

        // Append image to book card div
        bookDiv.appendChild(img);

        // Add event listener to book card div
        bookDiv.addEventListener('click', () => {
            // Populate modal with book details
            modalTitle.innerHTML = `Book Name: ${book.book_name}`;
            modalImage.src = book.image;
            modalImage.alt = book.book_name;
            modalAuthor.innerHTML = `<strong>Author:</strong> ${book.authors_name}`;
            modalDescription.innerHTML = `<strong>Description:</strong> ${book.short_description}`;
            modalPageNumber.innerHTML = `<strong>Page Number:</strong> ${book.num_pages}`;
            modalCopyNumber.innerHTML = `<strong>Copies:</strong> ${book.num_copies}`;
            modalCategory.innerHTML = `<strong>Category:</strong> ${book.categories}`;
            modalISBN.innerHTML = `<strong>ISBN:</strong> ${book.ISBN}`;

            // Display the modal
            bookModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            // catching the buttons div

            //delete
            deleteButton.classList.add('delete-btn');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', (event) => {
                deleteBook(book.id);
            });
        
            buttonsDiv.appendChild(deleteButton);

            //update
            editButton.classList.add('edit-btn');
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

closeCreateButton.addEventListener('click', () => {
    bookModalCreate.style.display = 'none';
    document.body.style.overflow = 'auto';
    createDiv.style.display = 'none';
    createDiv.style.overflow = 'none';
    
    document.getElementById('createBookName').value = "";
    document.getElementById('createAuthorsName').value = "";
    document.getElementById('createNumPages').value = "";
    document.getElementById('createShortDescription').value = "";
    document.getElementById('createImage').value = "";
    document.getElementById('createNumCopies').value = "";
    document.getElementById('createCategories').value = "";
    document.getElementById('createISBN').value = "";
});

createButton.addEventListener('click', () => {
    bookModalCreate.style.display = 'block';
    document.body.style.overflow = 'hidden';
    createDiv.style.display = 'block';
    createDiv.style.overflow = 'scroll';
    
    
});

function createBook() {
    // Get the values from the input fields
    const bookName = document.getElementById('createBookName').value;
    const authorsNameInput = document.getElementById('createAuthorsName').value;
    const authorsName = authorsNameInput.split(',').map(author => author.trim()); // Split authors by comma and trim spaces
    const numPages = parseInt(document.getElementById('createNumPages').value);
    const shortDescription = document.getElementById('createShortDescription').value;
    const image = document.getElementById('createImage').value;
    const numCopies = parseInt(document.getElementById('createNumCopies').value);
    const categoriesInput = document.getElementById('createCategories').value;
    const categories = categoriesInput.split(',').map(category => category.trim()); // Split categories by comma and trim spaces
    const ISBN = document.getElementById('createISBN').value;

    // Check if any of the required fields are empty
    if (!bookName || !authorsName[0] || !numPages || !shortDescription || !image || !numCopies || !categories[0] || !ISBN) {
        // If any field is empty, display a message
        alert('Please fill in all the required fields.');
        return; // Exit the function if any field is empty
    }

    // If all fields are filled, proceed with creating the book
    const newBook = {
        book_name: bookName,
        authors_name: authorsName,
        num_pages: numPages,
        short_description: shortDescription,
        image: image,
        num_copies: numCopies,
        categories: categories,
        ISBN: ISBN
    };

    axios.post(`${baseURL}/books`, newBook)
        .then(response => {
            console.log(`Book '${newBook.book_name}' added successfully.`);
            console.log(response.data);
            window.location.reload(); // Reload the page after adding the book
        })
        .catch(error => {
            console.error('Error adding the book:', error);
        });
}



function fetchBooks(pageNum,filteredBooks) {
    showLoader();
    
    let url = `${baseURL}/books?_page=${pageNum}&_per_page=${bookPerPage}`;
    axios
        .get(url)
        .then((response) => {  
            if (filteredBooks) {
                console.log("in if in fetch",filteredBooks);
                
                displayBookImages(filteredBooks)
                hideLoader();
            }
            else{
                console.log('else');
                const books = response.data;
                booksNumInPage = books.data.length;
                displayBookImages(books.data);}
                hideLoader();
        
        })
        .catch((err) => console.error(err),hideLoader());
        
}

function showLoader() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';
}

// Hide loader function
function hideLoader() {
    const loader = document.getElementById('loader');
    loader.style.display = 'none';
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




async function search(event) {
    event.preventDefault(); 
    const searchInput = document.getElementById('searchBookName').value.toLowerCase();
    const newBooks = await filterBooks(searchInput);
    fetchBooks(pageNum,newBooks);

}

    

async function filterBooks(searchInput) {
    const url = `http://localhost:8001/books?_page=${pageNum}&_per_page=${bookPerPage}`;

    try {
        const response = await axios.get(url);
        console.log(url);

        const allBooks = response.data; // Adjust this line to extract book data
        console.log('ALL', allBooks);

        const filteredBooks = allBooks.filter(book => book.book_name.toLowerCase().includes(searchInput));
        console.log('Filtered Books:', filteredBooks);
        return filteredBooks;
    } catch (err) {
        console.error('Fetch error:', err);
        return [];
    }
}






function deleteBook(bookId) {
    const url = `http://localhost:8001/books/${bookId}`;

    axios.get(url)
    .then(response => {
        const bookName = response.data.book_name;
        
        const currentTime = new Date(); // Get the current time
        updateHistory(bookName, 'DELETE', currentTime, bookId)
        console.log(updateHistory(bookName, 'DELETE', currentTime, bookId)); // Call updateHistory with correct arguments
    })

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
        authors_name: document.getElementById('updateAuthorsName').value.split(',').map(author => author.trim()), // Split authors by comma and trim spaces
        num_pages: parseInt(document.getElementById('updateNumPages').value),
        short_description: document.getElementById('updateShortDescription').value,
        image: document.getElementById('updateImage').value,
        num_copies: parseInt(document.getElementById('updateNumCopies').value),
        categories: document.getElementById('updateCategories').value.split(',').map(category => category.trim()), // Split categories by comma and trim spaces
        ISBN: document.getElementById('updateISBN').value
    };

    axios.put(url, updatedBook)
        .then(response => {
            console.log(`Book with ID ${bookId} updated successfully.`);
            console.log(response.data);
            updateModal.style.display = 'none';
            window.location.reload();
        })
        .catch(error => {
            console.error(`There was an error updating the book with ID ${bookId}:`, error);
        });
}



// Call the function to display book images when the page loads
window.onload = () => fetchBooks(pageNum);
