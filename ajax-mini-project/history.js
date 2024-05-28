async function fetchHistory() {
    try {
        const response = await axios.get('http://localhost:8001/history');
        console.log(response);
        const data = response.data;
        console.log(data);
        displayHistory(data);
    } catch (error) {
        console.error('Failed to fetch history:', error);
    }
}

function displayHistory(history) {
    const historyContainer = document.getElementById('history-container');
    historyContainer.innerHTML = '';

    history.forEach(item => {
        const time = item.time.replace("T", " ").replace("Z", "").split('.')[0];
        const paragraph = document.createElement('p');
        paragraph.classList.add('history-p');

        let operationClass = '';
        switch (item.operation) {
            case 'DELETE':
                operationClass = 'history-p-operation-delete';
                break;
            case 'PUT':
                operationClass = 'history-p-operation-put';
                break;
            case 'POST':
                operationClass = 'history-p-operation-post';
                break;
            default:
                operationClass = 'history-p-operation-default';
                break;
        }

        paragraph.innerHTML = `<span class="${operationClass}">${item.operation}</span> <span class="history-p-time">Time:</span> ${time} <span class="history-p-bookname">Book Name:</span> ${item.book_name}`;
        historyContainer.appendChild(paragraph);
    });
}

fetchHistory();