let mlay = [],
    cart = [],
    cartQty = document.getElementById('cart-qty'),           //span Id on .html for cart quantity
    cartTotal = document.getElementById('cart-total'),       //span Id on .html for total to pay 
    addForm1 = document.getElementById('frm1'),              //form Id on .html
    addForm2 = document.getElementById('frm2'),              //form Id on .html
    addForm3 = document.getElementById('frm3'),              //form Id on .html
    InBuy = document.getElementById('inputBuy'),             // Input on form to where user can write how many products to buy
    alert = document.getElementById('alertH1'),              // h1 id in case of any alert to user
    shopList = document.getElementById("shop-list"),         // ul id where the Shop List goes
    alertListDiv = document.getElementById('alertList');

// Creating the HTML
let prodList = document.getElementById('product-list')         //ul Id on .html where the cart list goes

// Shop Mlay
// createItem (Product Name, Barcode, Price, Quantity of product in stock)
createItem('Milk', 1001, 5.5, 10)
createItem('Bread', 1002, 8, 20)
createItem('Pasta', 1003, 5, 30)
createItem('Cotadg', 1004, 6, 40)
createItem('Ice-Cream', 1005, 20, 50)

// Handle Clicks on Shop List
shopList.onclick = function (e) {           // Option to click on ShopList Items to send to Your card
    if (e.target && e.target.id.includes("shopList_li")) {
        let barcode = e.target.className
        let result = {}
        for (i = 0; i < cart.length; i++) {
            if (cart[i].barcode == barcode) {
                addQty(barcode)
                showItems()
                return
            }
        }
        mlay.map(v => v.barcode == barcode && v.qty >= 1 ? (v.qty--, v.amount++) : null)
        mlay.find(v => v.barcode == barcode ? result = v : null)
        cart.push(result)
        showItems()
    }
}

//Clear the Cart list before printing an update
function clearCartList() {
    let lis = document.querySelectorAll('#prodList_li');
    for (i = 0; li = lis[i]; i++) {
        li.parentNode.removeChild(li);
    }
}

//Clear the Shop list before printing an update
function clearShopList() {
    let lis = document.querySelectorAll('#shopList_li');
    for (i = 0; li = lis[i]; i++) {
        li.parentNode.removeChild(li);
    }
}

// Clear a specific Out of Stock Alert 
function clearAlert(barcode) {
    if (document.getElementById("barcode").value != 'Barcode...') {
        barcode = document.getElementById("barcode").value
    }
    if (document.getElementById("barcode1").value != "Barcode...") {
        barcode = document.getElementById("barcode1").value
    }
    if (document.getElementById("barcode2").value != "Barcode...") {
        barcode = document.getElementById("barcode2").value
    }
    let h1s = document.querySelectorAll('#alertH1');
    for (i = 0; h1 = h1s[i]; i++) {
        if (h1.className == barcode) {
            h1.parentNode.removeChild(h1);
        }
    }
}

// Handle Clicks in Cart List
prodList.onclick = function (e) {
    if (e.target && e.target.id.includes("prodList_butt_remove")) {
        let barcode = e.target.className
        removeItem(barcode)
        clearAlert(barcode)
        showItems()
    }
    if (e.target && e.target.id.includes("prodList_butt_plus")) {
        let barcode = e.target.className
        addQty(barcode)
        showItems()
    }
    if (e.target && e.target.id.includes("prodList_butt_minus")) {
        let barcode = e.target.className
        minusQty(barcode)
        clearAlert(barcode)
        showItems()
    }
    if (e.target && e.target.id.includes("prodList_butt_add")) {
        let barcode = e.target.className
        let InBuy = Number(document.getElementById('inputBuy' + barcode).value)
        mlay.find(v => v.barcode == barcode && InBuy > v.qty ? InBuy = v.qty : null)
        removeQty(barcode, InBuy)
        showItems()
    }
}

// // Handle Add Form Submit ------ e.preventDefault() prevent the refresh page
//Form 01 capture info from user to add a new product to Mlay
addForm1.onsubmit = function (e) {
    e.preventDefault()
    let nameX = document.getElementById("name").value;
    let barcodeX = document.getElementById("barcode").value;
    let priceX = Number(document.getElementById("price").value);
    let qtyX = Number(document.getElementById("qty").value);

    createItem(nameX, barcodeX, priceX, qtyX)
}

//Capture info from user to add Product quantity to stock by barcode
addForm2.onsubmit = function (e) {
    e.preventDefault()
    let barcode1X = document.getElementById("barcode1").value;
    let qty1X = Number(document.getElementById("qty1").value);

    addStock(barcode1X, qty1X)
}

addForm3.onsubmit = function (e) {
    e.preventDefault()
    let barcode2X = document.getElementById("barcode2").value;
    let qty2X = Number(document.getElementById("qty2").value);

    removeStock(barcode2X, qty2X)
}

// Create a Item to be added to mlay[] -----------------------------
// create a prod to send to addNewProd to push into mlay array
// amount is the amount os product in the cart
function createItem(name, barcode, price, qty, amount = 0) {
    prod = {
        name, barcode, price, qty, amount,
    }
    addNewItem(prod)
}

// Add New Item to the mlay[] ------------------------
function addNewItem(prod) {
    mlay.every(v => v.barcode != prod.barcode)
        ? (mlay.push(prod), createShopList(prod))
        : (createAlertListDiv(`Barcore alredy in the system!!!`, prod.barcode), setTimeout(clearAlert, 5000)) // In case of the product already exist in the system
}

// Get Quantity of products on card ---------------------
function getAmount() {
    let amount = 0
    cart.map(v => amount += v.amount)
    return amount
}

// Get Total Value of Buy -----------------------------------------
function getTotal() {
    let total = 0
    cart.map(v => total += v.amount * v.price)
    return total.toFixed(2)
}

// Remove Item by Barcode -----------------------
function removeItem(barcode) {
    let result01 = []
    cart.map(v => v.barcode != barcode ? result01.push(v) : null)
    cart = result01
}

// Add Cart Prod Quantity to a product by barcode
// if clicked at shop list or + button will add only 1. if Input is used will add the number in the box
function addQty(barcode, qty = 1) {
    let item = getItemById(barcode)
    item != undefined && item.qty != 0 ? item.amount += qty : null;
    mlay.find(v => v.barcode == barcode && v.qty <= 0 ? createAlertListDiv(`There is not enought ${item.name} in stock`, barcode) : null)
    mlay.find(v => v.barcode == barcode && v.qty >= qty ? (v.qty -= qty) : null)
}

// Add a Product Quantity to stock
function addStock(barcode1X, qty1X) {
    for (i in mlay) {
        if (mlay[i].barcode == barcode1X) {
            mlay[i].qty += qty1X
            clearShopList()
            createShopListMlay(mlay)
            return
        }
    }
    (createAlertListDiv(`This Barcode doesn't exist in the system!!!`, barcode1X), setTimeout(clearAlert, 5000))
}

function removeStock(barcode2X, qty2X) {
    for (i in mlay) {
        if (mlay[i].barcode == barcode2X && mlay[i].qty >= qty2X) {
            mlay[i].qty -= qty2X
            clearShopList()
            createShopListMlay(mlay)
            return
        }
        if (mlay[i].barcode == barcode2X && mlay[i].qty < qty2X) {
            (createAlertListDiv(`There are not enought product in stock`, barcode2X), setTimeout(clearAlert, 5000))
            return
        }
    }
    (createAlertListDiv(`This Barcode doesn't exist in the system!!!`, barcode2X), setTimeout(clearAlert, 5000))
}

// Take out Quantity from a product by Barcode
function minusQty(barcode, qty = 1) {
    let item = getItemById(barcode)
    item != undefined ? item.amount-- | item.qty++ : null;
    if (item.amount == 0) {
        removeItem(barcode)
    }
}

//Remove Quantity from Item -----------------
function removeQty(barcode, qty = 1) {
    if (!getItemById(barcode)) {
        return alert.innerHTML = `There is no product with this Barcode`
    }
    addQty(barcode, qty)
}

// Function thats find a specific product by barcode
function getItemById(barcode) {
    return mlay.find(v => v.barcode == barcode)
}

//showItems(mlay) ------------------------
function showItems() {
    clearCartList()
    createNewListProd(cart)
    cartQty.innerHTML = `You have in your card ${getAmount()} items.`
    cartTotal.innerHTML = `On Total of $${getTotal()}`
}

//Creating a Shopping list per product
function createShopList(prod) {
    let elemLi = document.createElement("li")
    elemLi.id = ("shopList_li")
    elemLi.className = (prod.barcode)                   // class name will be = to prod barcode
    elemLi.innerHTML =
        (`${prod.name} Price: $${prod.price}`)          // add a inner text with cards game
    // elemLi.addEventListener('click', showAlert)      //Testing to add a click event to an element
    shopList.appendChild(elemLi)                        //Linking elem Li from shopping list to ul shopList

    let elemSpan = document.createElement('span')
    elemSpan.className = ('tooltiptext')
    elemSpan.innerHTML = (`There are ${prod.qty} units in stock`)
    elemLi.appendChild(elemSpan)
}

//Creating a Shopping list per Mlay List
function createShopListMlay(mlay) {
    for (i in mlay) {
        let elemLi = document.createElement("li")
        elemLi.id = ("shopList_li")
        elemLi.className = (mlay[i].barcode)                // class name will be = to prod barcode
        elemLi.innerHTML =
            (`${mlay[i].name} Price: $${mlay[i].price}`)    // add a inner text with cards game
        // elemLi.addEventListener('click', showAlert)      //Testing to add a click event to an element
        shopList.appendChild(elemLi)                        //Linking elem Li from shopping list to ul shopList

        let elemSpan = document.createElement('span')
        elemSpan.className = ('tooltiptext')
        elemSpan.innerHTML = (`There are ${mlay[i].qty} units in stock`)
        elemLi.appendChild(elemSpan)
    }
}

//Create a List Li under Ul
function createNewListProd(cart) {
    for (i in cart) {
        let elemLi = document.createElement("li")
        elemLi.id = ("prodList_li")
        elemLi.className = ("li" + cart[i].barcode)
        elemLi.innerHTML =
            (`${cart[i].name} Price: $${cart[i].price} Qty: ${cart[i].amount} = ${cart[i].price * cart[i].amount}`)
        // add a inner text with cards game
        prodList.appendChild(elemLi)

        let elemButRemove = document.createElement('button')
        elemButRemove.id = ("prodList_butt_remove")
        elemButRemove.className = (cart[i].barcode)
        elemButRemove.dataset = cart[i].barcode
        elemButRemove.innerText = ("Remove")
        elemLi.appendChild(elemButRemove)

        let elemButPlus = document.createElement('button')
        elemButPlus.id = ("prodList_butt_plus")
        elemButPlus.className = (cart[i].barcode)
        elemButPlus.innerText = ("+")
        elemLi.appendChild(elemButPlus)

        let elemButMinus = document.createElement('button')
        elemButMinus.id = ("prodList_butt_minus")
        elemButMinus.className = (cart[i].barcode)
        elemButMinus.innerText = ("-")
        elemLi.appendChild(elemButMinus)

        let inputBuyQty = document.createElement('input');
        inputBuyQty.id = ('inputBuy');
        inputBuyQty.className = (cart[i].barcode);
        inputBuyQty.type = "Number";
        inputBuyQty.step = 1;
        inputBuyQty.min = 0;
        inputBuyQty.max = cart[i].qty;
        elemLi.appendChild(inputBuyQty);

        let elemBut = document.createElement('button')
        elemBut.id = ("prodList_butt_add")
        elemBut.className = (cart[i].barcode)
        elemBut.innerText = ("Add to Cart")
        elemLi.appendChild(elemBut)
    }
}

function createAlertListDiv(text, barcode) {
    let elemH1 = document.createElement('h1')
    elemH1.id = ('alertH1')
    elemH1.className = (barcode)
    elemH1.innerHTML = text
    alertListDiv.appendChild(elemH1)
}

// //Function test for element event on createShopList(prod)
// function showAlert() {
//     console.log('click!!!')
// }