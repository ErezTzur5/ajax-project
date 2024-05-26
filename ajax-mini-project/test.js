updateModal.addEventListener('click', (event) => {
    updateBookName.textContent = book.book_name
    updateAuthorsName.textContent = book.authors_name
    updateNumPages.textContent = book.num_pages
    updateShortDescription.textContent = book.short_description
    updateImage.src = book.image
    updateNumCopies.textContent = book.num_copies
    updateCategories.textContent = book.categories
    updateISBN.textContent = book.ISBN
});



//
const updateBookName = document.getElementById('updateBookName').value;
const updateAuthorsName = document.getElementById('updateAuthorsName').value;
const updateNumPages = document.getElementById('updateNumPages').value;
const updateShortDescription = document.getElementById('updateShortDescription').value;
const updateImage = document.getElementById('updateImage').value;
const updateNumCopies = document.getElementById('updateNumCopies').value;
const updateCategories = document.getElementById('updateCategories').value;
const updateISBN = document.getElementById('updateISBN').value;
