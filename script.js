```javascript
/* ==========================================
   JOHN MART - JAVASCRIPT
========================================== */

/* ==============================
   PRODUCT DATA
================================ */

const products = [
    {
        id: 0,
        name: "Laptop",
        price: 50000,
        icon: "💻"
    },
    {
        id: 1,
        name: "Smartphone",
        price: 25000,
        icon: "📱"
    },
    {
        id: 2,
        name: "Headphones",
        price: 2000,
        icon: "🎧"
    },
    {
        id: 3,
        name: "Keyboard",
        price: 1500,
        icon: "⌨️"
    },
    {
        id: 4,
        name: "Mouse",
        price: 800,
        icon: "🖱️"
    }
];


/* ==============================
   REGISTER
================================ */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const username =
            document.getElementById("registerUsername").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        let users =
            JSON.parse(localStorage.getItem("johnMartUsers")) || [];

        const existingUser =
            users.find(user => user.username === username);

        if (existingUser) {
            alert("Username already exists!");
            return;
        }

        users.push({
            username: username,
            password: password
        });

        localStorage.setItem(
            "johnMartUsers",
            JSON.stringify(users)
        );

        alert("Registration successful!");

        window.location.href = "login.html";
    });
}


/* ==============================
   LOGIN
================================ */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const username =
            document.getElementById("loginUsername").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        /*
         * Admin login
         * Based on the original Java program
         */
        if (username === "admin" && password === "admin123") {

            localStorage.setItem("johnMartLoggedIn", username);

            alert("Admin login successful!");

            window.location.href = "products.html";

            return;
        }

        let users =
            JSON.parse(localStorage.getItem("johnMartUsers")) || [];

        const user =
            users.find(
                user =>
                    user.username === username &&
                    user.password === password
            );

        if (!user) {
            alert("Invalid username or password!");
            return;
        }

        localStorage.setItem(
            "johnMartLoggedIn",
            username
        );

        alert("Login successful!");

        window.location.href = "products.html";
    });
}


/* ==============================
   ADD TO CART
================================ */

function addToCart(productId) {

    let cart =
        JSON.parse(localStorage.getItem("johnMartCart")) || [];

    const existingItem =
        cart.find(item => item.id === productId);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            id: productId,
            quantity: 1
        });

    }

    localStorage.setItem(
        "johnMartCart",
        JSON.stringify(cart)
    );

    alert(
        products[productId].name +
        " added to cart!"
    );
}


/* ==============================
   DISPLAY CART
================================ */

function displayCart() {

    const cartContainer =
        document.getElementById("cartItems");

    if (!cartContainer) {
        return;
    }

    let cart =
        JSON.parse(localStorage.getItem("johnMartCart")) || [];

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">
                <div>🛒</div>
                <h2>Your cart is empty</h2>
                <p>Add some products to your cart.</p>
                <a href="products.html" class="primary-btn">
                    Browse Products
                </a>
            </div>
        `;

        updateCartTotal();

        return;
    }

    cartContainer.innerHTML = "";

    cart.forEach(item => {

        const product = products[item.id];

        const itemTotal =
            product.price * item.quantity;

        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <div class="cart-item-image">
                ${product.icon}
            </div>

            <div class="cart-item-details">
                <h3>${product.name}</h3>
                <p>₹${product.price.toLocaleString("en-IN")}</p>
            </div>

            <div class="quantity-controls">

                <button onclick="changeQuantity(${item.id}, -1)">
                    −
                </button>

                <strong>${item.quantity}</strong>

                <button onclick="changeQuantity(${item.id}, 1)">
                    +
                </button>

            </div>

            <strong>
                ₹${itemTotal.toLocaleString("en-IN")}
            </strong>

            <button
                class="remove-btn"
                onclick="removeFromCart(${item.id})">
                Remove
            </button>
        `;

        cartContainer.appendChild(cartItem);

    });

    updateCartTotal();
}


/* ==============================
   CHANGE QUANTITY
================================ */

function changeQuantity(productId, change) {

    let cart =
        JSON.parse(localStorage.getItem("johnMartCart")) || [];

    const item =
        cart.find(item => item.id === productId);

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {

        cart =
            cart.filter(item => item.id !== productId);

    }

    localStorage.setItem(
        "johnMartCart",
        JSON.stringify(cart)
    );

    displayCart();
}


/* ==============================
   REMOVE FROM CART
================================ */

function removeFromCart(productId) {

    let cart =
        JSON.parse(localStorage.getItem("johnMartCart")) || [];

    cart =
        cart.filter(item => item.id !== productId);

    localStorage.setItem(
        "johnMartCart",
        JSON.stringify(cart)
    );

    displayCart();
}


/* ==============================
   UPDATE TOTAL
================================ */

function updateCartTotal() {

    let cart =
        JSON.parse(localStorage.getItem("johnMartCart")) || [];

    let total = 0;

    cart.forEach(item => {

        const product = products[item.id];

        total +=
            product.price * item.quantity;

    });

    const subtotal =
        document.getElementById("cartSubtotal");

    const totalElement =
        document.getElementById("cartTotal");

    if (subtotal) {

        subtotal.textContent =
            "₹" + total.toLocaleString("en-IN");

    }

    if (totalElement) {

        totalElement.textContent =
            "₹" + total.toLocaleString("en-IN");

    }
}


/* ==============================
   PLACE ORDER
================================ */

function placeOrder() {

    let cart =
        JSON.parse(localStorage.getItem("johnMartCart")) || [];

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

    const loggedInUser =
        localStorage.getItem("johnMartLoggedIn");

    if (!loggedInUser) {

        alert("Please login before placing an order.");

        window.location.href = "login.html";

        return;
    }

    let total = 0;

    const orderItems = cart.map(item => {

        const product = products[item.id];

        total += product.price * item.quantity;

        return {
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            icon: product.icon
        };

    });

    let orders =
        JSON.parse(localStorage.getItem("johnMartOrders")) || [];

    const newOrder = {

        id: "JM" + Date.now(),

        username: loggedInUser,

        items: orderItems,

        total: total,

        status: "Order Confirmed",

        date: new Date().toLocaleString("en-IN")

    };

    orders.push(newOrder);

    localStorage.setItem(
        "johnMartOrders",
        JSON.stringify(orders)
    );

    localStorage.removeItem("johnMartCart");

    alert("Order placed successfully! 🎉");

    window.location.href = "orders.html";
}


/* ==============================
   DISPLAY ORDERS
================================ */

function displayOrders() {

    const container =
        document.getElementById("ordersContainer");

    if (!container) {
        return;
    }

    const loggedInUser =
        localStorage.getItem("johnMartLoggedIn");

    let orders =
        JSON.parse(localStorage.getItem("johnMartOrders")) || [];

    if (loggedInUser) {

        orders =
            orders.filter(
                order => order.username === loggedInUser
            );

    }

    if (orders.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">
                <div>📦</div>
                <h2>No orders yet</h2>
                <p>Your placed orders will appear here.</p>

                <a href="products.html"
                   class="primary-btn">
                    Start Shopping
                </a>
            </div>
        `;

        return;
    }

    container.innerHTML = "";

    orders.reverse().forEach(order => {

        const orderCard =
            document.createElement("div");

        orderCard.className = "order-card";

        let itemsHTML = "";

        order.items.forEach(item => {

            itemsHTML += `

                <div class="order-product">

                    <div class="order-product-icon">
                        ${item.icon}
                    </div>

                    <div class="order-product-info">

                        <h3>${item.name}</h3>

                        <p>
                            ₹${item.price.toLocaleString("en-IN")}
                            × ${item.quantity}
                        </p>

                    </div>

                    <div class="order-total">

                        ₹${(
                            item.price * item.quantity
                        ).toLocaleString("en-IN")}

                    </div>

                </div>
            `;

        });

        orderCard.innerHTML = `

            <div class="order-header">

                <div>
                    <div class="order-id">
                        Order #${order.id}
                    </div>

                    <small>
                        ${order.date}
                    </small>
                </div>

                <span class="order-status">
                    ${order.status}
                </span>

            </div>

            ${itemsHTML}

            <hr style="margin-top:20px; border:none;
                       border-top:1px solid #eee;">

            <div style="
                display:flex;
                justify-content:space-between;
                margin-top:18px;
                font-size:18px;
                font-weight:800;
            ">

                <span>Total</span>

                <span>
                    ₹${order.total.toLocaleString("en-IN")}
                </span>

            </div>
        `;

        container.appendChild(orderCard);

    });
}


/* ==============================
   PAGE LOAD
================================ */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayCart();

        displayOrders();

    }
);
