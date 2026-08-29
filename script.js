// ======================================================
// JOHN MART - COMPLETE SCRIPT.JS
// Products + Cart + Login + Register + Orders
// ======================================================


// ======================================================
// 1. PRODUCTS
// ======================================================

const products = [
    {
        id: 1,
        name: "Laptop",
        price: 45000,
        category: "Electronics",
        icon: "💻"
    },
    {
        id: 2,
        name: "Headphone",
        price: 1500,
        category: "Audio",
        icon: "🎧"
    },
    {
        id: 3,
        name: "Shoes",
        price: 2500,
        category: "Fashion",
        icon: "👟"
    },
    {
        id: 4,
        name: "Bag",
        price: 1200,
        category: "Accessories",
        icon: "👜"
    },
    {
        id: 5,
        name: "Smartphone",
        price: 25000,
        category: "Electronics",
        icon: "📱"
    },
    {
        id: 6,
        name: "Smart Watch",
        price: 5000,
        category: "Electronics",
        icon: "⌚"
    },
    {
        id: 7,
        name: "Keyboard",
        price: 1200,
        category: "Accessories",
        icon: "⌨️"
    },
    {
        id: 8,
        name: "Mouse",
        price: 800,
        category: "Accessories",
        icon: "🖱️"
    },
    {
        id: 9,
        name: "Monitor",
        price: 12000,
        category: "Electronics",
        icon: "🖥️"
    },
    {
        id: 10,
        name: "Printer",
        price: 9000,
        category: "Electronics",
        icon: "🖨️"
    },
    {
        id: 11,
        name: "Power Bank",
        price: 1800,
        category: "Electronics",
        icon: "🔋"
    },
    {
        id: 12,
        name: "USB Pen Drive",
        price: 700,
        category: "Accessories",
        icon: "💾"
    },
    {
        id: 13,
        name: "Bluetooth Speaker",
        price: 2200,
        category: "Audio",
        icon: "🔊"
    },
    {
        id: 14,
        name: "Gaming Chair",
        price: 15000,
        category: "Furniture",
        icon: "🪑"
    },
    {
        id: 15,
        name: "Office Table",
        price: 7000,
        category: "Furniture",
        icon: "🗄️"
    },
    {
        id: 16,
        name: "Water Bottle",
        price: 300,
        category: "Lifestyle",
        icon: "🍶"
    },
    {
        id: 17,
        name: "Backpack",
        price: 1800,
        category: "Accessories",
        icon: "🎒"
    },
    {
        id: 18,
        name: "T-Shirt",
        price: 600,
        category: "Fashion",
        icon: "👕"
    },
    {
        id: 19,
        name: "Jeans",
        price: 1500,
        category: "Fashion",
        icon: "👖"
    },
    {
        id: 20,
        name: "Sports Shoes",
        price: 3200,
        category: "Fashion",
        icon: "👟"
    },
    {
        id: 21,
        name: "Notebook",
        price: 80,
        category: "Stationery",
        icon: "📓"
    },
    {
        id: 22,
        name: "Pen",
        price: 20,
        category: "Stationery",
        icon: "🖊️"
    },
    {
        id: 23,
        name: "Calculator",
        price: 600,
        category: "Stationery",
        icon: "🧮"
    },
    {
        id: 24,
        name: "Fan",
        price: 2500,
        category: "Home Appliances",
        icon: "🌀"
    },
    {
        id: 25,
        name: "Mixer Grinder",
        price: 4500,
        category: "Home Appliances",
        icon: "🥤"
    },
    {
        id: 26,
        name: "Rice Cooker",
        price: 3500,
        category: "Home Appliances",
        icon: "🍚"
    },
    {
        id: 27,
        name: "Electric Kettle",
        price: 1800,
        category: "Home Appliances",
        icon: "🫖"
    },
    {
        id: 28,
        name: "LED TV",
        price: 35000,
        category: "Electronics",
        icon: "📺"
    },
    {
        id: 29,
        name: "Refrigerator",
        price: 28000,
        category: "Home Appliances",
        icon: "🧊"
    },
    {
        id: 30,
        name: "Washing Machine",
        price: 24000,
        category: "Home Appliances",
        icon: "🧺"
    }
];


// ======================================================
// 2. LOCAL STORAGE HELPERS
// ======================================================

function getCart() {
    return JSON.parse(localStorage.getItem("johnMartCart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("johnMartCart", JSON.stringify(cart));
}

function getUsers() {
    return JSON.parse(localStorage.getItem("johnMartUsers")) || [];
}

function saveUsers(users) {
    localStorage.setItem("johnMartUsers", JSON.stringify(users));
}

function getOrders() {
    return JSON.parse(localStorage.getItem("johnMartOrders")) || [];
}

function saveOrders(orders) {
    localStorage.setItem("johnMartOrders", JSON.stringify(orders));
}


// ======================================================
// 3. CURRENCY
// ======================================================

function formatPrice(price) {
    return "₹" + Number(price).toLocaleString("en-IN");
}


// ======================================================
// 4. DISPLAY PRODUCTS
// ======================================================

function displayProducts(list = products) {

    const grid = document.getElementById("productsGrid");

    if (!grid) {
        return;
    }

    grid.innerHTML = "";

    if (list.length === 0) {

        grid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:50px;">
                <h2>No products found</h2>
                <p>Try another search.</p>
            </div>
        `;

        return;
    }

    list.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `

            <div class="product-image">
                ${product.icon}
            </div>

            <div class="product-info">

                <span class="category">
                    ${product.category}
                </span>

                <h2>
                    ${product.name}
                </h2>

                <p>
                    Quality ${product.name.toLowerCase()}
                    from JOHN MART.
                </p>

                <div class="product-bottom">

                    <strong>
                        ${formatPrice(product.price)}
                    </strong>

                    <button onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>

                </div>

            </div>
        `;

        grid.appendChild(card);
    });
}


// ======================================================
// 5. ADD TO CART
// ======================================================

function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) {
        return;
    }

    let cart = getCart();

    const existing = cart.find(
        item => item.id === productId
    );

    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            icon: product.icon,
            quantity: 1
        });
    }

    saveCart(cart);

    updateCartCount();

    showMessage(
        product.name + " added to cart! 🛒"
    );
}


// ======================================================
// 6. UPDATE CART COUNT
// ======================================================

function updateCartCount() {

    const cart = getCart();

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const cartLinks = document.querySelectorAll(
        'a[href="cart.html"]'
    );

    cartLinks.forEach(link => {

        link.textContent =
            `Cart 🛒${totalQuantity > 0 ? " (" + totalQuantity + ")" : ""}`;
    });
}


// ======================================================
// 7. DISPLAY CART
// ======================================================

function displayCart() {

    const cartContainer =
        document.getElementById("cartItems");

    if (!cartContainer) {
        return;
    }

    const cart = getCart();

    cartContainer.innerHTML = "";

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div style="text-align:center;padding:40px;">
                <h2>Your cart is empty 🛒</h2>
                <p>Add some products to continue shopping.</p>

                <a href="products.html"
                   class="primary-btn"
                   style="display:inline-block;margin-top:20px;">
                    Shop Now
                </a>
            </div>
        `;

        updateCartSummary();

        return;
    }

    cart.forEach(item => {

        const div = document.createElement("div");

        div.className = "cart-item";

        div.innerHTML = `

            <div class="cart-item-image">
                ${item.icon}
            </div>

            <div class="cart-item-details">

                <h3>${item.name}</h3>

                <p>
                    ${formatPrice(item.price)}
                </p>

                <div class="quantity-controls">

                    <button onclick="changeQuantity(${item.id}, -1)">
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button onclick="changeQuantity(${item.id}, 1)">
                        +
                    </button>

                </div>

            </div>

            <div>

                <strong>
                    ${formatPrice(item.price * item.quantity)}
                </strong>

                <br>

                <button
                    class="remove-btn"
                    onclick="removeFromCart(${item.id})">
                    Remove
                </button>

            </div>
        `;

        cartContainer.appendChild(div);
    });

    updateCartSummary();
}


// ======================================================
// 8. CHANGE QUANTITY
// ======================================================

function changeQuantity(productId, change) {

    let cart = getCart();

    const item = cart.find(
        product => product.id === productId
    );

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {

        cart = cart.filter(
            product => product.id !== productId
        );
    }

    saveCart(cart);

    displayCart();

    updateCartCount();
}


// ======================================================
// 9. REMOVE FROM CART
// ======================================================

function removeFromCart(productId) {

    let cart = getCart();

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart(cart);

    displayCart();

    updateCartCount();

    showMessage("Product removed from cart.");
}


// ======================================================
// 10. CART SUMMARY
// ======================================================

function updateCartSummary() {

    const cart = getCart();

    const subtotal = cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    const shipping =
        subtotal > 0 ? 50 : 0;

    const total =
        subtotal + shipping;


    const subtotalElement =
        document.getElementById("subtotal");

    const shippingElement =
        document.getElementById("shipping");

    const totalElement =
        document.getElementById("total");


    if (subtotalElement) {

        subtotalElement.textContent =
            formatPrice(subtotal);
    }

    if (shippingElement) {

        shippingElement.textContent =
            formatPrice(shipping);
    }

    if (totalElement) {

        totalElement.textContent =
            formatPrice(total);
    }
}


// ======================================================
// 11. CHECKOUT
// ======================================================

function checkout() {

    const cart = getCart();

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

    const currentUser =
        JSON.parse(
            localStorage.getItem("johnMartCurrentUser")
        );

    if (!currentUser) {

        alert(
            "Please login before placing an order."
        );

        window.location.href = "login.html";

        return;
    }

    const subtotal = cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    const shipping = 50;

    const total = subtotal + shipping;

    const order = {

        id:
            "JM" +
            Date.now(),

        date:
            new Date().toLocaleString("en-IN"),

        customer:
            currentUser.name,

        email:
            currentUser.email,

        items:
            cart,

        subtotal:
            subtotal,

        shipping:
            shipping,

        total:
            total,

        status:
            "Placed"
    };


    const orders = getOrders();

    orders.push(order);

    saveOrders(orders);

    localStorage.removeItem(
        "johnMartCart"
    );

    alert(
        "Order placed successfully! 🎉"
    );

    window.location.href =
        "orders.html";
}


// ======================================================
// 12. DISPLAY ORDERS
// ======================================================

function displayOrders() {

    const ordersContainer =
        document.getElementById("ordersList");

    if (!ordersContainer) {
        return;
    }

    const orders = getOrders();

    ordersContainer.innerHTML = "";

    if (orders.length === 0) {

        ordersContainer.innerHTML = `
            <div style="text-align:center;padding:50px;">
                <h2>No orders yet 📦</h2>
                <p>Your placed orders will appear here.</p>

                <a href="products.html"
                   class="primary-btn"
                   style="display:inline-block;margin-top:20px;">
                    Start Shopping
                </a>
            </div>
        `;

        return;
    }


    orders.slice().reverse().forEach(order => {

        const div =
            document.createElement("div");

        div.className = "order-card";

        let itemsHTML = "";

        order.items.forEach(item => {

            itemsHTML += `
                <div style="
                    display:flex;
                    justify-content:space-between;
                    margin:8px 0;
                ">
                    <span>
                        ${item.icon}
                        ${item.name}
                        × ${item.quantity}
                    </span>

                    <strong>
                        ${formatPrice(
                            item.price * item.quantity
                        )}
                    </strong>
                </div>
            `;
        });


        div.innerHTML = `

            <div style="margin-bottom:15px;">

                <h2>
                    Order #${order.id}
                </h2>

                <p>
                    Date: ${order.date}
                </p>

                <p>
                    Status:
                    <strong>${order.status}</strong>
                </p>

            </div>

            <div>
                ${itemsHTML}
            </div>

            <hr>

            <div style="
                display:flex;
                justify-content:space-between;
                margin-top:15px;
            ">

                <strong>
                    Total
                </strong>

                <strong>
                    ${formatPrice(order.total)}
                </strong>

            </div>
        `;

        ordersContainer.appendChild(div);
    });
}


// ======================================================
// 13. REGISTER
// ======================================================

function registerUser(event) {

    if (event) {
        event.preventDefault();
    }

    const name =
        document.getElementById("name")?.value.trim();

    const email =
        document.getElementById("email")?.value.trim();

    const password =
        document.getElementById("password")?.value;

    if (!name || !email || !password) {

        alert(
            "Please fill all fields."
        );

        return false;
    }

    let users = getUsers();

    const exists =
        users.some(
            user =>
                user.email.toLowerCase() ===
                email.toLowerCase()
        );

    if (exists) {

        alert(
            "Email already registered."
        );

        return false;
    }

    users.push({

        name: name,

        email: email,

        password: password
    });

    saveUsers(users);

    alert(
        "Registration successful! 🎉"
    );

    window.location.href =
        "login.html";

    return false;
}


// ======================================================
// 14. LOGIN
// ======================================================

function loginUser(event) {

    if (event) {
        event.preventDefault();
    }

    const email =
        document.getElementById("email")?.value.trim();

    const password =
        document.getElementById("password")?.value;


    if (!email || !password) {

        alert(
            "Please enter email and password."
        );

        return false;
    }


    const users = getUsers();

    const user =
        users.find(
            item =>
                item.email.toLowerCase() ===
                    email.toLowerCase() &&
                item.password === password
        );


    if (!user) {

        alert(
            "Invalid email or password."
        );

        return false;
    }


    localStorage.setItem(
        "johnMartCurrentUser",
        JSON.stringify(user)
    );


    alert(
        "Login successful! Welcome " +
        user.name +
        " 🎉"
    );


    window.location.href =
        "index.html";

    return false;
}


// ======================================================
// 15. LOGOUT
// ======================================================

function logoutUser() {

    localStorage.removeItem(
        "johnMartCurrentUser"
    );

    alert(
        "You have been logged out."
    );

    window.location.href =
        "index.html";
}


// ======================================================
// 16. CURRENT USER
// ======================================================

function updateUserUI() {

    const user =
        JSON.parse(
            localStorage.getItem(
                "johnMartCurrentUser"
            )
        );

    const loginButtons =
        document.querySelectorAll(
            ".login-btn"
        );

    const registerButtons =
        document.querySelectorAll(
            ".register-btn"
        );


    if (user) {

        loginButtons.forEach(button => {

            button.textContent =
                "Hi, " + user.name;

            button.href =
                "#";

            button.onclick =
                function () {
                    logoutUser();
                };
        });


        registerButtons.forEach(button => {

            button.textContent =
                "Logout";

            button.href =
                "#";

            button.onclick =
                function () {
                    logoutUser();
                };
        });

    }
}


// ======================================================
// 17. SEARCH PRODUCTS
// ======================================================

function searchProducts() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    if (!searchInput) {
        return;
    }

    const keyword =
        searchInput.value
            .toLowerCase()
            .trim();


    const filtered =
        products.filter(product =>

            product.name
                .toLowerCase()
                .includes(keyword)

            ||

            product.category
                .toLowerCase()
                .includes(keyword)
        );


    displayProducts(filtered);
}


// ======================================================
// 18. CATEGORY FILTER
// ======================================================

function filterCategory(category) {

    if (
        !category ||
        category === "All"
    ) {

        displayProducts(products);

        return;
    }


    const filtered =
        products.filter(
            product =>
                product.category ===
                category
        );


    displayProducts(filtered);
}


// ======================================================
// 19. MESSAGE
// ======================================================

function showMessage(message) {

    const oldMessage =
        document.getElementById(
            "johnMartMessage"
        );

    if (oldMessage) {
        oldMessage.remove();
    }


    const box =
        document.createElement("div");

    box.id =
        "johnMartMessage";


    box.textContent =
        message;


    box.style.position =
        "fixed";

    box.style.bottom =
        "25px";

    box.style.right =
        "25px";

    box.style.padding =
        "15px 22px";

    box.style.background =
        "#6c3df4";

    box.style.color =
        "white";

    box.style.borderRadius =
        "10px";

    box.style.zIndex =
        "9999";

    box.style.fontWeight =
        "600";

    box.style.boxShadow =
        "0 8px 25px rgba(0,0,0,0.2)";


    document.body.appendChild(box);


    setTimeout(() => {

        box.remove();

    }, 2500);
}


// ======================================================
// 20. INITIALIZE
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayProducts();

        displayCart();

        displayOrders();

        updateCartCount();

        updateUserUI();

    }
);
