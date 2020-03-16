//window.localStorage.clear();

async function main(){
    let myStorage = window.localStorage;
    let key = await fetchKey();
    if(myStorage.getItem('key') == null){
        myStorage.setItem('key', key.key);
        console.log('New key created.');
    }

    await updateLocalStorage();
    changeInputMethod();
    
    let searchBar = document.getElementById('searchBar');
    let selectList = document.getElementById('dropDown');
    
    searchBar.addEventListener('input', filterResultsAsync);
    selectList.addEventListener('change', changeInputMethod);
}
main();
const baseUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=' + window.localStorage.getItem('key');

async function changeInputMethod(){
    let dropDown = document.querySelector('#dropDown');
    let inputFields = document.querySelector('#inputFields');
    inputFields.innerHTML = '';

    let titleField = document.createElement('input');
    let authorField = document.createElement('input');
    let idField = document.createElement('input');
    let button = document.createElement('button');

    titleField.id = 'titleField';
    authorField.id = 'authorField';
    idField.id = 'idField';
    button.id = 'opButton';

    switch(dropDown.value){
        case 'insert':
            button.textContent = 'Add';

            inputFields.appendChild(titleField);
            inputFields.appendChild(authorField);
            inputFields.appendChild(button);

            button.addEventListener('click', insertItemAsync);
            break;
        
        case 'update':
            button.textContent = 'Update';

            inputFields.appendChild(titleField);
            inputFields.appendChild(authorField);
            inputFields.appendChild(idField);
            inputFields.appendChild(button);

            button.addEventListener('click', updateItemAsync);
            break;

        case 'delete':
            button.textContent = 'Delete';

            inputFields.appendChild(idField);
            inputFields.appendChild(button);

            button.addEventListener('click', deleteItemAsync);
            break;
    }
}

async function updateLocalStorage(){
    const request = 'https://www.forverkliga.se/JavaScript/api/crud.php?key='
                    + window.localStorage.getItem('key') + 
                    '&op=select';
    for(let i = 0; i < 10; i++){
        let jsonItem = await fetch(request).then(resp => resp.json()).catch(console.log('An error has occured'));
        if(jsonItem.status == 'success'){
            jsonItem = JSON.stringify(jsonItem.data); // deserialize data so it can be stored in localStorage
            window.localStorage.setItem('data', jsonItem);
            return;
        }
    }
    console.log('Could not fetch data');
}

async function filterResultsAsync(){
    if(window.localStorage.getItem('data') == null){
        return console.log('Could not fetch data from storage')
    }
    let searchRequest = document.querySelector('#searchBar').value;
    document.querySelector('#resultDiv').innerHTML = '';

    let jsonItem = window.localStorage.getItem('data');
    jsonItem = JSON.parse(jsonItem); // data in localStorage is saved as string and thus needs to be pared back into json
    jsonItem = jsonItem.filter(item => item.title.includes(searchRequest) || item.author.includes(searchRequest));

    for(let i = 0; i < jsonItem.length; i++){
        let ul = document.createElement('UL');
        document.querySelector('#resultDiv').appendChild(ul);

        let li1 = document.createElement('LI');      
        let li2 = document.createElement('LI');                
        let li3 = document.createElement('LI');

        li1.innerHTML = jsonItem[i].title;
        li2.innerHTML = jsonItem[i].author;
        li3.innerHTML = jsonItem[i].id;

        ul.appendChild(li1);
        ul.appendChild(li2);
        ul.appendChild(li3);
    }
    console.log('Search Successful');
}

async function fetchKey(){
    return fetch('https://www.forverkliga.se/JavaScript/api/crud.php?requestKey')
    .then(resp => resp.json());
}

async function deleteItemAsync(){
    let id = document.querySelector('#idField').value;
    let request = baseUrl + `&op=delete&id=${id}`;

    for(let i = 0; i < 10; i++){
        let jsonItem = await fetch(request).then(resp => resp.json());
        if(jsonItem.status == 'success'){
            console.log(jsonItem.status);
            document.querySelector('#status').innerHTML = 'Item Deleted';
            await updateLocalStorage();
            return jsonItem;
        }
    }
}

async function updateItemAsync(){
    let title = document.querySelector('#titleField').value;
    let author = document.querySelector('#authorField').value;
    let id = document.querySelector('#idField').value;

    let request = baseUrl + `&op=update&title=${title}&author=${author}&id=${id}`;
    for(let i = 0; i < 10; i++){
        let jsonItem = await fetch(request).then(resp => resp.json());
        if(jsonItem.status == 'success'){
            console.log('status: ' + jsonItem.status);
            document.querySelector('#status').innerHTML = 'Item Updated';
            await updateLocalStorage();
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
            return jsonItem;
        }
    }
    document.querySelector('#resultDiv').textContent = 'Request Failed';
    console.log(`This is so sad. Can we find item? no.`);
}

async function insertItemAsync(){
    let title = document.querySelector('#titleField').value;
    let author = document.querySelector('#authorField').value;
    let request = baseUrl + `&op=insert&title=${title}&author=${author}`;

    for(let i = 0; i < 10; i++){
        let item = await fetch(request).then(resp => resp.json());
        if(item.status == 'success'){
            document.querySelector('#status').textContent = 'Item Inserted';
            console.log('status: ' + item.status + ' id: ' + item.id);
            await updateLocalStorage();
            return item;
        }
    }
    
    console.log('Insert Failed. Try again, daddy <3 xoxo');
    document.querySelector('#addStatus').textContent = 'Insert Failed';
}