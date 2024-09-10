const openShopping = document.querySelector('.shopping');
const closeShopping = document.querySelector('.close');
const searchInput = document.querySelector('#search');


const list = document.querySelector('.list');
const listCard = document.querySelector('.listCard');
const totalCount = document.querySelector('.quantity');
const totalAmt = document.querySelector('.totalAmount');

const remove = document.querySelectorAll('.remove');
const productList = document.querySelector('#product-list');

//Retrieves the cart data from localStorage and parses it. If no data is found, initializes an empty array.
const shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

function loadCart() {
    const cartr = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    cartr.forEach(item => {
        addToCart(item.title, item.price, item.id);
    });
}

function updateLocalStorage() {
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
}

openShopping.addEventListener('click', () => {
    document.querySelector('.card').classList.toggle('active');
});

closeShopping.addEventListener('click', () => {
    document.querySelector('.card').classList.remove('active');
});


//Loop through each button and add event listener

remove.forEach(items => {
    items.addEventListener('click', (event) => {
        const productSelected = event.target.parentElement;
        console.log("delted");
        productSelected.remove();
    });
})

productList.addEventListener('click', (event) => {
    if(event.target.classList.contains('add_to_cart')){
        const cardItem = event.target.closest('.card-list');
        const title = cardItem.querySelector('h2').innerText;
        const price = cardItem.querySelector('.price').innerText.replace('Price: $', '');
        console.log("items added");
        addToCart(title, price);
    }
});



function addToCart(title, price) {
    const items = document.createElement('li');
    items.classList.add('list-item');
    items.innerHTML = `
        <p>${title}</p> 
        <p>$${price}</p> 
        <p class="remove"><i class="fas fa-trash"></i></p>
    `;

    listCard.appendChild(items);
    shoppingCart.push({ title, price });
    totalCount.innerText = shoppingCart.length;

    // Attach event listener to the "remove" icon for deletion
    items.querySelector('.remove').addEventListener('click', () => {
        removeFromCart(items);
    });

    
    updateTotal(shoppingCart);
    updateLocalStorage();

}

function removeFromCart(itemElement){
    itemElement.remove();

    //Find the index of the item in the shoppingCart by title
    const itemTitle = itemElement.querySelector('p').innerText;
    const itemIndex = shoppingCart.findIndex(item => item.title === itemTitle);

    if(itemIndex > -1){
        shoppingCart.splice(itemIndex, 1);
    }

    totalCount.innerText = shoppingCart.length;
   
    updateTotal(shoppingCart);
    updateLocalStorage();
}

function updateTotal(shoppingCart){

    //Use map to extract the prices
    const prices = shoppingCart.map(item =>parseFloat(item.price));
 
    const totalSum = prices.reduce((acc, curr) => acc + curr, 0);
    totalAmt.innerText = totalSum;
    // console.log(totalSum);

}


async function getData( searchValue =''){
    try{
    const res = await fetch("https://fakestoreapi.com/products/");
    const products = await res.json();

    productList.innerHTML = ''; // Clear the product list first

    // Filter products based on search value, or show all if searchValue is empty
    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(searchValue.toLowerCase())
    );
     // Display products (filtered or all)
     displayProducts(filteredProducts);
    } 
    catch (err) {
       console.log(err);
    }
}

// Display filtered or all products
function displayProducts(products) {
    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('card-list');

        // Slice title and description for better display
        const shortTitle = product.title.length > 20 ? product.title.slice(0, 20) : product.title;
        const shortDes = product.description.length > 150 ? product.description.slice(0, 150) : product.description;

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}"/>
            <h2>${shortTitle}</h2>
            <p>${shortDes}...</p>
            <p class="price">Price: $${product.price}</p>
            <button class="add_to_cart">Add to Cart</button>`;
        
        productList.appendChild(card);
    });
}

// Event listener for search input
searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.trim();
    getData(searchValue); // Call getData with search value
});

// Initial fetch of all products
getData(); // On page load, show all products
loadCart();
