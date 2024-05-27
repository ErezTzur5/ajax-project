
function updateHistory(book_name,operation,time,bookId) {
    const historyDiv = document.getElementById('history-container');
    if (historyDiv) {
        console.log('history-container found');
        const newP = document.createElement('p');
        newP.classList.add('history-content');
        newP.setAttribute('id', 'history-content');
        newP.textContent = `${book_name}${operation}${time}${bookId}`; // Adding some text to see the new element
        historyDiv.appendChild(newP);
        console.log('New paragraph added');
    } else {
        console.error('Element with id "history-container" not found.');
    }
}