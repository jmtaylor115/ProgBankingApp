var dBase;
const request = indexedDB.open('budget', 1);

request.onupgradeneeded = function(event) {
    const dBase = event.target.result;
    dBase.createObjectStore('new_transaction', { autoIncrement: true} );
};

request.onsuccess = function(event) {
    dBase = event.target.result;
    if(navigator.onLine) {
        uploadTransaction();
    }
};

request.onerror =function(event) {
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    const trasaction = dBase.trasaction(['new_transaction'], 'readwrite');
    const transactionStore = trasaction.objectStore('new_transition');
    transactionStore.add(record);
}

function uploadTransaction() {
    const transaction = dBase.transaction(['new_transaction'], readwrite);
    const transactionStore = transaction.objectStore('new_transaction');
    const grabAll = transactionStore.getAll();
    getAll.onsuccess = function() {
        if(getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                             'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if(serverResponse.message) {
                    throw new Error(serverResponse);
                }
                const transition = dBase.transaction(['new_transaction'], 'readwrite');
                const transactionStore = transaction.objectStore('newtransaction');
                transactionStore.clear();
                alert('All transaction saved and submitted!');
            })
            .catch(err => {
                console.log(err);
            });
        }
    };
}

window.addEventListener('online', uploadTransaction);