document.addEventListener("DOMContentLoaded", () => {
    // 1. Data con URLs de imágenes corregidas para 2026
    const productsData = [
        { id: 1, name: "Teclado Mecánico RGB", price: 120, category: "tech", img: "https://images.unsplash.com" },
        { id: 2, name: "Auriculares Pro", price: 250, category: "audio", img: "https://images.unsplash.com" },
        { id: 3, name: "Smartwatch Series X", price: 180, category: "tech", img: "https://images.unsplash.com" },
        { id: 4, name: "Monitor Gamer 4K", price: 400, category: "tech", img: "https://images.unsplash.com" }
    ];

    let cart = JSON.parse(localStorage.getItem("tech_cart")) || [];

    // Selectores
    const productsGrid = document.getElementById("products-grid");
    const cartList = document.getElementById("cart-list");
    const totalPriceElement = document.getElementById("total-price");
    const cartCount = document.getElementById("cart-count");

    // Renderizar Productos
    function renderProducts(category = "all") {
        if (!productsGrid) return;
        productsGrid.innerHTML = "";
        const filtered = category === "all" ? productsData : productsData.filter(p => p.category === category);

        filtered.forEach(product => {
            const col = document.createElement("div");
            col.className = "col-12 col-md-6 col-lg-4 d-flex justify-content-center reveal";
            col.innerHTML = `
                <div class="card h-100 shadow-sm border-0">
                    <img src="${product.img}" class="card-img-top" style="height:200px; object-fit:cover;" alt="${product.name}">
                    <div class="card-body text-center d-flex flex-column">
                        <h5 class="fw-bold">${product.name}</h5>
                        <p class="fs-4 text-primary fw-bold mt-auto">$${product.price}</p>
                        <button class="btn btn-dark w-100" onclick="addToCart(${product.id})">Agregar al Carrito</button>
                    </div>
                </div>`;
            productsGrid.appendChild(col);
        });
        initScrollReveal();
    }

    // Carrito con Verificación de Bootstrap
    window.addToCart = (id) => {
        const product = productsData.find(p => p.id === id);
        cart.push(product);
        updateCart();
        
        const cartEl = document.getElementById('cartOffcanvas');
        if (typeof bootstrap !== 'undefined' && cartEl) {
            const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(cartEl);
            bsOffcanvas.show();
        }
    };

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        updateCart();
    };

    function updateCart() {
        localStorage.setItem("tech_cart", JSON.stringify(cart));
        renderCartUI();
    }

    function renderCartUI() {
        if (!cartList) return;
        cartList.innerHTML = "";
        let total = 0;
        cart.forEach((item, index) => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center rounded-3 mb-2 border";
            li.innerHTML = `
                <span class="small fw-bold">${item.name} - $${item.price}</span>
                <button class="btn btn-sm text-danger" onclick="removeFromCart(${index})"><i class="bi bi-trash"></i></button>`;
            cartList.appendChild(li);
            total += item.price;
        });
        totalPriceElement.innerText = total;
        cartCount.innerText = cart.length;
    }

    // Menú Hamburguesa Seguro
    function setupNavbar() {
        const navCollapse = document.getElementById("navbarNav");
        const menuBtn = document.getElementById("menu-btn");
        if (typeof bootstrap !== 'undefined' && navCollapse && menuBtn) {
            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse, { toggle: false });
            
            navCollapse.addEventListener('show.bs.collapse', () => {
                menuBtn.innerHTML = '<i class="bi bi-x-lg text-white fs-4"></i>';
            });
            navCollapse.addEventListener('hide.bs.collapse', () => {
                menuBtn.innerHTML = '<span class="navbar-toggler-icon"></span>';
            });
            document.querySelectorAll(".nav-link").forEach(l => {
                l.addEventListener("click", () => bsCollapse.hide());
            });
        }
    }

    // Filtros
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", (e) => renderProducts(e.target.dataset.category));
    });

    // Scroll Reveal
    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("active"); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    // Validación Formulario
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            document.getElementById("form-message").innerHTML = `<div class="alert alert-success">¡Mensaje enviado con éxito!</div>`;
            contactForm.reset();
        });
    }

    renderProducts();
    renderCartUI();
    setupNavbar();
});
