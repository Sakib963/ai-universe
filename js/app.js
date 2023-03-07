/* 
    API Links: 
        All data: https://openapi.programming-hero.com/api/ai/tools

        Single data details: https://openapi.programming-hero.com/api/ai/tool/${id}

        Single data Example: https://openapi.programming-hero.com/api/ai/tool/01
*/

// Fetching All AI Tools
const getAI = async(dataLimit) => {
    try {
        const spinner = document.getElementById('spinner')
        spinner.classList.remove('hidden')
        const url = `https://openapi.programming-hero.com/api/ai/tools`;
        const res = await fetch(url);
        const data = await res.json();
    
        // Checking whether Progress bar is showing or not
        // setTimeout(displayCards, 1000, data.data.tools, dataLimit)
        displayCards(data.data.tools, dataLimit)
    } catch (error) {
        const spinner = document.getElementById('spinner')
        spinner.classList.add('hidden')
        const errorMessage = document.getElementById('no-found-message');
        errorMessage.classList.remove('hidden');
        document.getElementById('see-more-button').classList.add('hidden')
    }
}

// Calling Function With Data Limit 6
getAI(6)


// Displaying Cards
const displayCards = (items, dataLimit) => {
    const container = document.getElementById('card-container');
    const seeMore = document.getElementById('see-more');
    container.innerHTML = ''
    const errorMessage = document.getElementById('no-found-message');
    errorMessage.classList.add('hidden');
    
    // Display 6 Cards only
    if(dataLimit){
        items = items.slice(0, 6);
        seeMore.classList.remove('hidden');
    }
    else{
        seeMore.classList.add('hidden');
    }
    
    for(const item of items){

        const div = document.createElement('div');
        div.classList.add('card', 'bg-base-100', 'shadow-xl', 'border', 'transform', 'transition', 'duration-500', 'hover:scale-105');

        // Item Values
        const imageURL = item.image;

        const ul = document.createElement('ul');
        ul.classList.add('list-decimal', 'pl-4')
        for(const feature of item.features){
            const li = document.createElement('li');
            li.innerText = feature;
            ul.appendChild(li);
        }

        const name = item.name;
        const date = item.published_in;
        
        // Formatting Date, From 11/1/2022 to 11/01/2022
        let newDate = new Date(date);
        let month = newDate.getMonth() + 1;
        let day = newDate.getDate();
        let year = newDate.getFullYear();

        if (month < 10) {
            month = "0" + month;
        }

        if (day < 10) { 
            day = "0" + day;
        }
        let formattedDate = month + "/" + day + "/" + year;


        const id = item.id;

        // Creating Cards for each item
        div.innerHTML = `
            <figure class="px-10 pt-10">
                <img src="${imageURL}" alt="Shoes" class="rounded-xl md:h-36 lg:h-48 w-fit" />
            </figure>
            <div class="card-body">
                <h2 class="card-title">Features</h2>
                ${ul.innerHTML}
                <hr class="my-6">
                <div class="card-actions flex justify-between items-center">
                    <div>
                        <h1 class="card-title mb-2">${name}</h1>
                        <p><i class="fa-regular fa-calendar-days pr-2"></i>${formattedDate}</p>
                    </div>
                    <div> 
                    <label onclick="loadDetails('${id}')" for="my-modal-5" class="cursor-pointer"><i class="fa-solid fa-arrow-right text-[#EB5757] bg-[#FEF7F7] p-4 rounded-full"></i></label>
                    </div>
                </div>
            </div>
        `
        container.appendChild(div)
        
    }
    const spinner = document.getElementById('spinner')
    spinner.classList.add('hidden')
}

// See More Button Handler
document.getElementById('see-more-button').addEventListener('click', function(){
    if(isSorted){
        getAiForSort();
    }
    else{
        getAI();
    }
})


// Handling Progress Bar
const toggleSpinner = isLoading => {
    const spinner = document.getElementById('spinner');
    if(isLoading){
        spinner.classList.remove('hidden')
    }
    else
    {
        spinner.classList.add('hidden')
    }
}

// Loading Details for Specific Item
const loadDetails = async(id) => {
    const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`
    const res = await fetch(url);
    const data = await res.json()
    displayDetails(data.data);
}

// Displaying Details for Single Item
const displayDetails = (item) => {
    console.log(item)
    const modalContainer = document.getElementById('modal-container');

    const image = item.image_link[0];
    const description = item.description ? item.description : 'No Data Found';
    
    // Handling Accuracy
    const accuracy = document.createElement('div');
    if(item.accuracy.score){
        accuracy.innerHTML = `
            <h1 class="bg-red-600 px-2 md:px-4 py-2 rounded-xl absolute top-1 md:top-2 right-1 md:right-2 text-white text-xs md:text-base" id="accuracy-text">${item.accuracy.score*100}% Accuracy</h1>
        `
    }
    else{
        accuracy.classList.add('hidden')
    }

    // Input Output Example
    const exampleContainer = document.createElement('div');

    if(item.input_output_examples){
        exampleContainer.innerHTML = `
        <h1 class="md:text-2xl font-bold">${item.input_output_examples[0].input}</h1>
        <h1 class="text-sm md:text-xl">${item.input_output_examples[0].output}</h1>
        `
    }
    else{
        exampleContainer.innerHTML = `
        <h1 class="md:text-2xl font-bold">Can you give any example?</h1>
        <h1 class="text-sm md:text-xl">No! Not Yet! Take a break!!!</h1>
        `
    }

    // Pricing Section
    const priceContainer = document.createElement('div');
    priceContainer.classList.add('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-4', 'mb-6')
    if(item.pricing){
        let count = 0;
        for(const price of item.pricing){
            const div = document.createElement('div');
            if(count == 0){
                div.classList.add('bg-white', 'p-3', 'md:p-5', 'rounded-xl', 'font-bold', 'text-[#03A30A]')
            }
            else if(count == 1){
                div.classList.add('bg-white', 'p-3', 'md:p-5', 'rounded-xl', 'font-bold', 'text-[#F28927]')
            }
            else{
                div.classList.add('bg-white', 'p-3', 'md:p-5', 'rounded-xl', 'font-bold', 'text-[#EB5757]')
            }
            div.innerHTML = `
                <h1>${price.price}</h1>
                <h1>${price.plan}</h1>
            `
            count++;
            priceContainer.appendChild(div);
        }
    }
    else{
        console.log('No Data Found')
        for(let i = 0; i < 3; i++){
            const div = document.createElement('div');
            if(i == 0){
                div.classList.add('bg-white', 'p-3', 'md:p-5', 'rounded-xl', 'font-bold', 'text-[#03A30A]')
                div.innerHTML = `
                    <h1>Free of Cost/Basic</h1>
                `
            }
            else if(i == 1){
                div.classList.add('bg-white', 'p-3', 'md:p-5', 'rounded-xl', 'font-bold', 'text-[#F28927]')
                div.innerHTML = `
                    <h1>Free Of Cost/Pro</h1>
                `
            }
            else{
                div.classList.add('bg-white', 'p-3', 'md:p-5', 'rounded-xl', 'font-bold', 'text-[#EB5757]')
                div.innerHTML = `
                    <h1>Free of Cost /Enterprise</h1>
                `
            }
            priceContainer.appendChild(div);
        }
    }

    

    // Getting Features and Set it to an UL
    const featureUL = document.createElement('ul');
    featureUL.classList.add('text-[#585858]', 'list-disc', 'pl-4')
    for(const feature in item.features){
        const li = document.createElement('li');
        li.innerText = `${item.features[feature]['feature_name']}`
        featureUL.appendChild(li)
    }

    // Getting Integration List and Set it to an UL
    const integrateDiv = document.createElement('div');
    if(item.integrations){
        const integrationUL = document.createElement('ul');
        integrationUL.classList.add('text-[#585858]', 'list-disc', 'pl-4')
        for(const integrate of item.integrations){
            const li = document.createElement('li');
            li.innerText = integrate;
            integrationUL.appendChild(li)
        }
        integrateDiv.appendChild(integrationUL);
    }
    else{
        const errorMessage = document.createElement('h1');
        errorMessage.innerText = 'No Data Found'
        integrateDiv.appendChild(errorMessage);
    }

    modalContainer.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 md:w-3/4 mx-auto mb-10 gap-4">
    <div class="bg-[#eb57570d] p-7 rounded-lg border border-[#EB5757]">
        <h3 class="text-sm md:text-lg font-bold md:w-3/4 mb-2 md:mb-6">${description}</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        ${priceContainer.innerHTML}
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
                <h1 class="text-lg font-bold mb-3">Features</h1>
                ${featureUL.innerHTML}
            </div>
            <div>
                <h1 class="text-lg font-bold mb-3">Integrations</h1>
                ${integrateDiv.innerHTML}
            </div>
        </div>
    </div>
    <div class="border rounded-lg p-5">
        <div class=" relative">
            <img src="${image}" alt="" class="w-full rounded-xl mb-4">
            ${accuracy.innerHTML}
        </div>
        <div class="text-center space-y-2">
            ${exampleContainer.innerHTML}
        </div>

    </div>
</div>
    `
    
}

// Sorting By Dates
let isSorted = false;
const sortButton = document.getElementById('sort-button');
sortButton.addEventListener('click', function(){
    sortButton.disabled = true;
    isSorted = true;
    getAiForSort(6);
})

// Fetching data and send them for sorting
const getAiForSort = async(dataLimit) => {
    try {
        const url = `https://openapi.programming-hero.com/api/ai/tools`;
        const res = await fetch(url);
        const data = await res.json();
        toggleSpinner(true)
        const sortedMessage = document.getElementById('sorted-message');
        sortedMessage.classList.remove('hidden');
        // setTimeout(getSortedArray, 1000, data.data.tools, dataLimit)
        getSortedArray(data.data.tools, dataLimit)
    } catch (error) {
        const errorMessage = document.getElementById('no-found-message');
        errorMessage.classList.remove('hidden');
        const container = document.getElementById('card-container');
        container.innerHTML = '';
        const sortedMessage = document.getElementById('sorted-message');
        sortedMessage.classList.add('hidden');
        document.getElementById('see-more-button').classList.add('hidden')
        toggleSpinner(false)
    }
}

// Sorting Array of Objects
const getSortedArray = (tools, dataLimit) => {
    tools.sort((x, y) => {
        x = new Date(x.published_in),
         y = new Date(y.published_in);
       return x - y;
   });
   displayCards(tools, dataLimit)
}