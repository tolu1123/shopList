// const { updateWatchlist } = require("@alpacahq/alpaca-trade-api/dist/resources/watchlist");

const list = document.querySelector('ul');
const input = document.querySelector('input');
const priority = document.querySelector('#priority');
const button = document.querySelector('.button');


// Get the counter elements
const counterDiv = document.querySelector('.counterDiv');
const counter = document.querySelector('#counter');


//Get the deleteDialogue elements
let deleteDialogue = document.querySelector('.deleteDialogue');
let deletePermBtn = document.querySelector('.deletePermBtn');
let cancelDelBtn = document.querySelector('.cancelDelBtn'); 

// Adding shortcut for the input and the priority element
input.addEventListener('input', (e) => {
    if(e.key === 'Enter' && priority.value === '') {
        priority.focus();
    } else if(e.key === 'Enter' && priority.value !== ''){
        button.click();
    }
})
priority.addEventListener('input', (e) => {
    if(e.key === 'Enter' && input.value !== '') {
        button.click();
    } else if(e.key === 'Enter' && input.value === '') {
        input.focus();
    }
})


// Declare the shopping array that stores the values
let shoppingArray;

// Get data from localStorage if it exists
function getStorage() {
    if(localStorage.getItem('shoppingArray')) {
        // Get the data
        let rawData = localStorage.getItem('shoppingArray');
        //Parse the raw data
        let data = JSON.parse(rawData);
        
        // Initialize the shoppingArray
        shoppingArray = [...data];

        //Sort the list in the order of priority
        shoppingArray.sort((a,b) => {
            return a.priority - b.priority;
        }); 
    } else {
        // Initialize the shoppingArray to an empty array
        shoppingArray = [];
    }
}
getStorage();


// Declare the save to Storage functionality
function saveToStorage() {
    //Sort the list in the order of priority
    shoppingArray.sort((a,b) => {
        return a.priority - b.priority;
    }); 
    
    // Stringify the shoppingArray (to prepare for storage)
    let data = JSON.stringify(shoppingArray);

    //Store the data
    localStorage.setItem('shoppingArray', data);
}

// Declare the constructor that will be used to create the specific item Data
function Data(name, priority) {
    this.name = name;
    this.priority = priority;
}

// The event listener that collects the value from the input and displays it
button.addEventListener('click', () => {
    if(input.value !== '' && priority.value !== '') {
        // get the raw data
        const myItem = input.value;
        input.value = '';

        const level = priority.value;
        priority.value = '';

        // create the item data 
        let itemData = new Data(myItem, level);

        //Store the added name
        shoppingArray.push(itemData);

        // SAVE to Storage
        saveToStorage();

        //Sort the list in the order of priority
        shoppingArray.sort((a,b) => {
            return a.priority - b.priority;
        }); 

        // Run the counterFunction
        counterFunction();

        // run the function that displays the list
        updateList();

        // Focus on the input after every entry   
        input.focus();
    }
});


function counterFunction() {
    let data = shoppingArray.length;
    if (shoppingArray.length >= 1) {
        counterDiv.classList.remove('hidden');
        counter.classList.add('counter');
        counter.textContent = `${data}`;
    } else {
        counterDiv.classList.add('hidden');
        counter.classList.remove('counter');
    }   
}
counterFunction();

function updateList() {
    // Clear the contents of the ul element
    list.innerHTML = '';

    shoppingArray.forEach((item, index) => {
        // Create the li element
        const listItem = document.createElement('li');
        if(index === 0) {
            listItem.classList.add('border-t-[1px]');
        }
        listItem.classList.add('border-b-[1px]');
        list.appendChild(listItem);

        //The priority mark
        const mark = document.createElement('span');
        listItem.appendChild(mark);
        if (item.priority === '1') {
            mark.classList.add('bg-red-500');
        } else if(item.priority === '2') {
            mark.classList.add('bg-yellow-500');
        } else if(item.priority === '3') {
            mark.classList.add('bg-green-500');
        }

        // Create the div that houses the editable input
        const divInput = document.createElement('div');
        listItem.appendChild(divInput);

        //create the editable input
        const editableInput = document.createElement('input');
        input.type = 'text';
        // Set the value of the editable Input
        editableInput.value = item.name;
        // Disable the input Element
        disableInput();
        divInput.appendChild(editableInput);



        // Create the div element that houses the editBtn and deleteBtn
        const metaDiv = document.createElement('div');
        metaDiv.setAttribute('class', 'metaDiv');
        // append the metaDiv to the listItem Element
        listItem.appendChild(metaDiv);

        // Create the editBtn and the deleteBtn
        const editBtn = document.createElement('button');
        editBtn.classList.add('bg-green-500')
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('bg-red-500')
        
        // set a flag that controls when the editable Field is active
        let editFlag = false

        // set the text-content of the edit and deleteBtn
        editBtn.textContent = 'Edit';
        deleteBtn.textContent = 'Delete';
        // Append the buttons to the metaDiv element
        metaDiv.appendChild(editBtn);
        metaDiv.appendChild(deleteBtn); 

        // THE EDIT FUNCTIONALITY
        // Adding the eventListener for the editBtn
        editBtn.addEventListener('click', () => {
            if(editFlag) {
                // if the editableField has been edited and the user wants to save
                editBtn.textContent = 'Edit';
                // disable the editable field;
                disableInput();
                // change the state of the editFlag
                editFlag = !editFlag;

                //Store the edited Data
                item.name = editableInput.value;

                // Save to Storage
                saveToStorage();

            } else {
                // if the user wants to edit the editableField 
                editBtn.textContent = 'Save';
                // enable the editable field
                enableInput();
                // change the state of the editFlag
                editFlag = !editFlag;
            }
        })


        // THE DELETE FUNCTIONALITY
        // Adding the eventListener for the deleteBtn
        // display the deleteDialogue that confirms you want to delete
        deleteBtn.addEventListener('click', () => {
            // display the delete confirmation box
            deleteDialogue.classList.remove('hidden');
        });

        // Adding the eventListener to permanently delete
        deletePermBtn.addEventListener('click', () => {
            // remove the delete confirmation box from being displayed
            deleteDialogue.classList.add('hidden');

            // remove the item from the shopping Array
            shoppingArray.splice(index, 1);

            // Run the counterFunction
            counterFunction();

            // Run the saveToStorage function
            saveToStorage();

            // Run the update List
            updateList();
        })

        // THE CANCEL FUNCTIONALITY
        // Adding the eventListener to cancel the delete operation
        cancelDelBtn.addEventListener('click', () => {
            // remove the delete confirmation box from being displayed
            deleteDialogue.classList.add('hidden');    
        })
        
        // The enableInput function
        function enableInput() {
            editableInput.disabled = false;
            // Adding the active style
            editableInput.classList.remove('bg-[transparent]');
            editableInput.classList.add('bg-white');
            editableInput.classList.add('px-1');
            editableInput.classList.add('py-1');
        }  
        // The disableInput function
        function disableInput() {
            editableInput.disabled = true;
            // Adding the active style
            editableInput.classList.add('bg-[transparent]');
            editableInput.classList.remove('bg-white');
            editableInput.classList.remove('px-1');
            editableInput.classList.remove('py-1');
        }     
    })   
}

updateList();