async function main(){
    if(window.localStorage.getItem('key') == null){
        await generateNewKey();
        console.log('New key created.');
    }
    
    await updateLocalStorage(); 

    changeInputMethod(); //loads input fields
    
    let searchButton = document.querySelector('#searchButton');
    let searchBar = document.getElementById('searchBar');
    let selectList = document.getElementById('dropDown');
    let newKeyButton = document.querySelector('#newKey')
    
    searchButton.addEventListener('click', readItemsAsync);
    searchBar.addEventListener('input', filterResultsAsync);
    selectList.addEventListener('change', changeInputMethod);
    newKeyButton.addEventListener('click', generateNewKey);
}
main();
const baseUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=' + window.localStorage.getItem('key');


//FRONT-END FUNCTIONS
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

            button.addEventListener('click', createItemAsync);
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


async function filterResultsAsync(){
    if(window.localStorage.getItem('data') == null){
        return console.log('Could not fetch data from storage')
    }
    let searchRequest = document.querySelector('#searchBar').value;
    document.querySelector('#resultDiv').innerHTML = '';

    let jsonItem = window.localStorage.getItem('data');
    jsonItem = JSON.parse(jsonItem); // data in localStorage is saved as string and thus needs to be parsed back into json
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




//LOCAL STORAGE AND KEY FUNCTIONS
async function fetchKey(){
    return fetch('https://www.forverkliga.se/JavaScript/api/crud.php?requestKey')
    .then(resp => resp.json());
}

async function generateNewKey(){
    let newKey = await fetchKey();
    window.localStorage.setItem('key', newKey.key);
    document.querySelector('#newKeyStatus').innerHTML = newKey.key;

    await updateLocalStorage();

    console.log('New key created')
}

async function updateLocalStorage(){
    const request = 'https://www.forverkliga.se/JavaScript/api/crud.php?key='
                    + window.localStorage.getItem('key') + 
                    '&op=select';
    for(let i = 0; i < 10; i++){
        let jsonItem = await fetch(request).then(resp => resp.json());
        if(jsonItem.status == 'success'){
            jsonItem = JSON.stringify(jsonItem.data); // deserialize data so it can be stored in localStorage
            window.localStorage.setItem('data', jsonItem);
            return;
        }
    }
    let h1 = document.createElement('H1');
    h1.innerHTML = 'Something went wrong. Please reload page.';
    document.querySelector('#body').appendChild(h1);
    console.log('Could not fetch data');
}


//CRUD OPERATIONS
async function createItemAsync(){
    let title = document.querySelector('#titleField').value;
    let author = document.querySelector('#authorField').value;
    let request = baseUrl + `&op=insert&title=${title}&author=${author}`;

    for(let i = 0; i < 10; i++){
        let item = {'status': 'error'} //await fetch(request).then(resp => resp.json());
        if(item.status == 'success'){
            document.querySelector('#status').textContent = 'Item Inserted';
            console.log('status: ' + item.status + ' id: ' + item.id);
            await updateLocalStorage();
            return item;
        }
    }

    console.log('Something went wrong. Could not create item');
    console.log('Insert Failed. Try again, daddy <3 xoxo');
    document.querySelector('#status').innerHTML = 'Insert Failed';
}

async function readItemsAsync(){
    let request = baseUrl + `&op=select`;
    document.querySelector('#resultDiv').innerHTML = '';

    for(let i = 0; i < 10; i++){
        let jsonItem = {'status': 'error'}// await fetch(request).then(resp => resp.json());
        if(jsonItem.status == 'success')
        {
            for(let i = 0; i < jsonItem.data.length; i++){
                let ul = document.createElement('UL');
                document.querySelector('#resultDiv').appendChild(ul);

                let li1 = document.createElement('LI');      
                let li2 = document.createElement('LI');                
                let li3 = document.createElement('LI');

                li1.innerHTML = jsonItem.data[i].title;
                li2.innerHTML = jsonItem.data[i].author;
                li3.innerHTML = jsonItem.data[i].id;

                ul.appendChild(li1);
                ul.appendChild(li2);
                ul.appendChild(li3); 
            }
            console.log('Search Successful');
            return jsonItem;
        }
    }
    document.querySelector('#resultDiv').innerHTML = '<p>Request Failed</p>';
    console.log(`This is so sad. Can we find item? no.`);
}

async function updateItemAsync(){
    let title = document.querySelector('#titleField').value;
    let author = document.querySelector('#authorField').value;
    let id = document.querySelector('#idField').value;

    let request = baseUrl + `&op=update&title=${title}&author=${author}&id=${id}`;
    for(let i = 0; i < 10; i++){
        let jsonItem = {'status': 'error'} //await fetch(request).then(resp => resp.json());
        if(jsonItem.status == 'success'){
            console.log('status: ' + jsonItem.status);
            document.querySelector('#status').innerHTML = 'Item Updated';
            await updateLocalStorage();
            return jsonItem;
        }
    }
    console.log('Update failed');
    document.querySelector('#status').innerHTML = 'Update failed';
}

async function deleteItemAsync(){
    let id = document.querySelector('#idField').value;
    let request = baseUrl + `&op=delete&id=${id}`;

    for(let i = 0; i < 10; i++){
        let jsonItem ={'status': 'error'} // await fetch(request).then(resp => resp.json());
        if(jsonItem.status == 'success'){
            console.log(jsonItem.status);
            document.querySelector('#status').innerHTML = 'Item Deleted';
            await updateLocalStorage();
            return jsonItem;
        }
    }
    console.log('Delete failed');
    document.querySelector('#status').innerHTML = 'Delete failed';
}