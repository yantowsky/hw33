const data = {
    'Fruits': ['Apples', 'Bananas', 'Oranges'],
    'Vegetables': ['Tomato', 'Cucumbers', 'Carrots'],
    'Berries': ['Strawberries', 'Grapes', 'Cherry'],
    'Drinks': ['Coffee', 'Tea', 'Juice']
}

const prices = {
    'Apples': 10,
    'Bananas': 15,
    'Oranges': 12,
    'Tomato': 8,
    'Cucumbers': 6,
    'Carrots': 4,
    'Strawberries': 2,
    'Grapes': 16,
    'Cherry': 10,
    'Coffee': 20,
    'Tea': 5,
    'Juice': 7
}

const leftSideBar = document.getElementById('left-sidebar');
const categoriesSection = document.getElementById('categories-section');
const categoryList = document.getElementsByClassName('category');
const productList = document.getElementById('product-list');
const productDetails = document.getElementById('product-details');
const buyButton = document.getElementById('buy-button');
const productsSection = document.getElementById('products-section');
const productsInfo = document.getElementById('products-info');
const orderForm = document.getElementById('order-form');
const ordersButton = document.getElementById('orders-button');
const shoppingCart = document.getElementById('shopping-cart-section');
const orderDetails = document.getElementById('order-details');
let selectedProduct;

function showProducts(category) {
    const products = data[category];
    productList.innerHTML = '';

    products.forEach((product, index) => {
        const listItem = document.createElement('li');
        listItem.id = 'product-list-item-' + product.toLowerCase();
        listItem.innerText = product;
        listItem.setAttribute('product-item-index', index);
        productList.appendChild(listItem);
    });
}

Array.from(categoryList).forEach((element) => {
    element.addEventListener('click', (event) => {
        const category = event.target.textContent;
        showProducts(category);
        productsSection.style.display = 'block';
        productsInfo.style.display = 'none';
        orderDetails.style.display = 'none';
        orderForm.reset();
    });
});

productList.addEventListener('click', (event) => {
    const product = event.target.textContent;
    productDetails.style.display = 'block';
    productDetails.textContent = 'You choose: ' + product.toLowerCase();
    orderForm.style.display = 'none';
    productsInfo.style.display = 'block';
    orderForm.reset();
    selectedProduct = product;
});

buyButton.addEventListener('click', () => {
    orderForm.style.display = 'block';
});

function fillingForm() {
    const fullName = document.getElementById('full-name').value;
    const city = document.getElementById('city').value;
    const deliveryBranch = document.getElementById('delivery-branch').value;
    const cashOnDelivery = document.getElementById('cash-on-delivery');
    const cardPayment = document.getElementById('card-payment');
    const quantity = document.getElementById('quantity').value;
    const comment = document.getElementById('comment').value;
    const price = prices[selectedProduct] * quantity;

    const orderNum = () => {
        const arrOrders = getOrders();
        const objLastOrder = arrOrders[arrOrders.length - 1];
        return (!arrOrders.length) ? 1 : objLastOrder.orderNum + 1;
    }

    let selectedPaymentMethod;

    if (cashOnDelivery.checked) {
        selectedPaymentMethod = cashOnDelivery.value;
    }

    if (cardPayment.checked) {
        selectedPaymentMethod = cardPayment.value;
    }

    const order = {
        product: selectedProduct.toLowerCase(),
        price: price,
        orderTime: new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' }),
        city: city,
        deliveryBranch: deliveryBranch,
        cardPayment: selectedPaymentMethod,
        quantity: quantity,
        comment: comment,
        fullName: fullName,
        orderNum: orderNum()
    }
    return order;
}

orderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (orderForm.checkValidity()) {
        const order = fillingForm();
        saveOrder(order);

        alert(`You choose: ${order.product}: ${order.quantity} piece. \n City: ${order.city}. \n System of payment: ${order.cardPayment} \n Branch delivery: ${order.deliveryBranch}. \n Thank you ${order.fullName} for your order!`);

        orderForm.reset();
        productDetails.innerText = '';
        productsInfo.style.display = 'none';
        productsSection.style.display = 'none';
        orderForm.style.display = 'none';
    }
});

function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

function getOrders() {
    return JSON.parse(localStorage.getItem('orders')) || [];
}

ordersButton.addEventListener('click', () => {
    categoriesSection.style.display = 'none';
    shoppingCart.style.display = 'block';
    productsInfo.style.display = 'none';
    productsSection.style.display = 'none';
    productDetails.style.display = 'none';
    orderForm.style.display = 'none';
    showUserOrders();
});

function showUserOrders() {
    shoppingCart.innerHTML = '';
    const storedObjects = getOrders();
    const shoppingCartTitle = document.createElement('h2');
    shoppingCartTitle.id = "shopping-cart-title";
    shoppingCartTitle.textContent = "Your orders:";
    shoppingCart.appendChild(shoppingCartTitle);
    shoppingCartTitle.style.display = 'block';
    const shoppingCartList = document.createElement('ul');
    shoppingCartList.className = "orders-list";
    shoppingCart.appendChild(shoppingCartList);
    shoppingCartList.style.display = 'block';
    shoppingCartList.innerHTML = renderListOrders();
    const orderListsItem = document.getElementsByClassName('orders-list__item');
    const orderDeleteBtn = document.getElementById('order-delete');


    function ordersListSelect() {
        Array.from(orderListsItem).forEach((element, index) => {
            element.addEventListener('click', () => {
                orderDetails.style.display = 'block';
                const orderList = document.getElementById('order-list');
                orderList.innerHTML = renderOrderDetails(index);
                orderDeleteBtn.value = index;
            });
        });
    }
    ordersListSelect();

    function orderDelete() {
        orderDeleteBtn.addEventListener('click', () => {
            storedObjects.splice(orderDeleteBtn.value, 1);
            localStorage.clear();
            localStorage.setItem('orders', JSON.stringify(storedObjects));
            shoppingCartList.innerHTML = renderListOrders();
            ordersListSelect();
            orderDetails.style.display = 'none';
        });
    }
    orderDelete();

    function renderOrderDetails(index) {
        const orderDetails = [];
        orderDetails.push(`
        <ul class="order-details">
            <li><span>Order:</span> #${storedObjects[index].orderNum}</li>
            <li><span>Product:</span> ${storedObjects[index].product}</li>
            <li><span>Quantity:</span> ${storedObjects[index].quantity}</li>
            <li><span>Price:</span> ${storedObjects[index].price}</li>
            <li><span>Name:</span> ${storedObjects[index].fullName}</li>
            <li><span>City:</span> ${storedObjects[index].city}</li>
            <li><span>Delivery Branch:</span> ${storedObjects[index].deliveryBranch}</li>
            <li><span>Type of Payment:</span> ${storedObjects[index].cardPayment}</li>
            <li><span>Comment:</span> ${storedObjects[index].comment}</li>
            </ul>
            <li><span>Order Time:</span> ${storedObjects[index].orderTime}</li>
        </ul>`);
        return orderDetails.join('');
    }

    function renderListOrders() {
        const ordersList = [];
        storedObjects.forEach(element => {
            ordersList.push(
                `<li class="orders-list__item"><span>Order:</span> #${element.orderNum} <span>Time:</span> ${element.orderTime} <span>Price:</span> ${element.price}</li>`
            );
        });
        return ordersList.join("");
    }

    const updatePageButton = document.createElement('button');
    updatePageButton.textContent = "Back";
    updatePageButton.id = 'back-button';
    shoppingCart.appendChild(updatePageButton);

    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', () => {
        categoriesSection.style.display = 'block';
        shoppingCart.style.display = 'none';
        orderDetails.style.display = 'none';
    });
}