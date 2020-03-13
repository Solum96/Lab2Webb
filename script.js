//window.localStorage.clear();

async function main(){
    let myStorage = window.localStorage;
    let key = await fetchKey();
    if(myStorage.getItem('key') == null){
        myStorage.setItem('key', key.key);
        console.log('New key created.');
    }

    let addBookButton = document.getElementById('addBookButton');
    let searchButton = document.getElementById('searchButton');
    let updateButton = document.getElementById('updateButton');
    let deleteButton = document.getElementById('deleteButton');
    let searchBar = document.getElementById('searchBar');
    addBookButton.addEventListener('click', insertItemAsync);
    searchButton.addEventListener('click', getItemAsync);
    updateButton.addEventListener('click', updateItemAsync);
    deleteButton.addEventListener('click', deleteItemAsync);
    searchBar.addEventListener('input', filterResultsAsync);
}
main();
const baseUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=' + window.localStorage.getItem('key');
/*
let JsonArray = getJsonArray();

async function getJsonArray(){
    for (let i = 0; i < 10; i++) {
        let jsonItem = await fetch(baseUrl + '&op=select')
        .then(response => response)
        .then(function(response){
            let item = response.json();
            if(item.status == 'success'){
                console.log('array fetched successfully');
                return response;
            }
        })
        .catch(function(){
            console.log('Error fetching from db.');
        });
        return jsonItem;
    }     
}
*/

async function filterResultsAsync(){
    let searchRequest = document.querySelector('#searchBar').value;
    let request = baseUrl + '&op=select'
    document.querySelector('#resultDiv').innerHTML = '';

    for(let i = 0; i < 10; i++){
        let jsonItem = await fetch(request).then(resp => resp.json());
        if(jsonItem.status == 'success')
        {
            jsonItem = jsonItem.data.filter(item => item.title.includes(searchRequest) || item.author.includes(searchRequest));

            for(let i = 0; i < jsonItem.length; i++){
                let ul = document.createElement('UL');
                document.querySelector('#resultDiv').appendChild(ul);

                let li1 = document.createElement('LI');      
                let li2 = document.createElement('LI');                
                let li3 = document.createElement('LI');

                li1.innerHTML = jsonItem[i].title;
                li2.innerHTML = jsonItem[i].author;            // Create a <p> element
                li3.innerHTML = jsonItem[i].id;

                ul.appendChild(li1);
                ul.appendChild(li2);                                     // Append <p> to <div> with id="myDIV" 
                ul.appendChild(li3);                                     // Append <p> to <div> with id="myDIV" 
            }
            console.log('Search Successful');
            return jsonItem;
        }
    }
    document.querySelector('#resultDiv').textContent = 'Request Failed';
    console.log(`This is so sad. Can we find item? no.`);
}

async function fetchKey(){
    return fetch('https://www.forverkliga.se/JavaScript/api/crud.php?requestKey')
    .then(resp => resp.json());
}

async function deleteItemAsync(){
    let bookId = document.querySelector('#bookId').value;
    let request = baseUrl + `&op=delete&id=${bookId}`;

    for(let i = 0; i < 10; i++){
        let jsonItem = await fetch(request).then(resp => resp.json());
        if(jsonItem.status == 'success'){
            console.log(jsonItem.status);
            document.querySelector('#updateStatus').innerHTML = 'Item Deleted';
            // JsonArray = getJsonArray();
            return jsonItem;
        }
    }
}

async function updateItemAsync(){
    let newTitle = document.querySelector('#newTitle').value;
    let newAuthor = document.querySelector('#newAuthor').value;
    let bookId = document.querySelector('#bookId').value;

    let request = baseUrl + `&op=update&title=${newTitle}&author=${newAuthor}&id=${bookId}`;
    for(let i = 0; i < 10; i++){
        let jsonItem = await fetch(request).then(resp => resp.json());
        if(jsonItem.status == 'success'){
            console.log('status: ' + jsonItem.status);
            document.querySelector('#updateStatus').innerHTML = 'Item Updated';
            //JsonArray = getJsonArray();
            return jsonItem;
        }
    }
}

async function getItemAsync(){
    let request = baseUrl + `&op=select`;
    document.querySelector('#resultDiv').innerHTML = '';

    for(let i = 0; i < 10; i++){
        let jsonItem = await fetch(request).then(resp => resp.json());
        if(jsonItem.status == 'success')
        {
            for(let i = 0; i < jsonItem.data.length; i++){
                let ul = document.createElement('UL');
                document.querySelector('#resultDiv').appendChild(ul);

                let li1 = document.createElement('LI');      
                let li2 = document.createElement('LI');                
                let li3 = document.createElement('LI');

                li1.innerHTML = jsonItem.data[i].title;
                li2.innerHTML = jsonItem.data[i].author;            // Create a <p> element
                li3.innerHTML = jsonItem.data[i].id;

                ul.appendChild(li1);
                ul.appendChild(li2);                                     // Append <p> to <div> with id="myDIV" 
                ul.appendChild(li3);                                     // Append <p> to <div> with id="myDIV" 
            }
            console.log('Search Successful');
            //JsonArray = getJsonArray();
            return jsonItem;
        }
    }
    document.querySelector('#resultDiv').textContent = 'Request Failed';
    console.log(`This is so sad. Can we find item? no.`);
}

async function insertItemAsync(){
    let bookTitle = document.querySelector('#bookTitle').value;
    let bookAuthor = document.querySelector('#bookAuthor').value;
    let request = baseUrl + `&op=insert&title=${bookTitle}&author=${bookAuthor}`;

    for(let i = 0; i < 10; i++){
        let item = await fetch(request).then(resp => resp.json());
        if(item.status == 'success'){
            document.querySelector('#addStatus').textContent = 'Success';
            console.log('status: ' + item.status + ' id: ' + item.id);
            //JsonArray = getJsonArray();
            return item;
        }
    }
    
    console.log('Insert Failed. Try again, daddy <3 xoxo');
    document.querySelector('#addStatus').textContent = 'Insert Failed';
}