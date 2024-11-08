document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    const checkoutContainer = document.getElementById('button-checkout');

   function renderCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const { id, name, price, quantity } = item;
        const priceFloat = typeof price === 'string' ? parseFloat(price) : price;
        const itemTotal = priceFloat * quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item d-flex justify-content-between align-items-center mb-3';
        cartItem.innerHTML = `
            <div class="d-flex align-items-center">
                <div>
                    <h5>${name}</h5>
                    <p class="mb-0">Descripción breve del producto.</p>
                </div>
            </div>
            <div class="d-flex align-items-center">
                <span class="mr-2">$${priceFloat}</span>
                <span class="mr-2">x${quantity}</span>
                <button class="btn btn-sm btn-danger" data-name="${name}" data-id="${id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>`;
        cartContainer.appendChild(cartItem);
    });

    totalElement.textContent = `$${total}`;

    document.querySelectorAll('.btn-danger').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const id = button.getAttribute('data-id');
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(item => item.name !== name && item.id !== id);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            verificarCarritoYSesion();
        });
    });
}

    async function verificarCarritoYSesion() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const token = localStorage.getItem('authToken');

        // Limpiar el contenedor de checkout
        checkoutContainer.innerHTML = '';

        // Verificar si hay items en el carrito
        if (cart.length === 0) {
            checkoutContainer.innerHTML = '<p class="text-center mt-3">El carrito está vacío</p>';
            return;
        }

        // Verificar si el usuario está logueado
        if (!token) {
            checkoutContainer.innerHTML = `
                <div class="text-center mt-3">
                    <p>Debe iniciar sesión para continuar con la compra</p>
                    <a href="login/login.html" class="btn btn-primary">Iniciar Sesión</a>
                </div>`;
            return;
        }

        try {
            // Validar el token
            const response = await fetch('https://vision-digital-api.vercel.app/api/usuarios/validar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });

            if (!response.ok) {
                throw new Error('Token inválido');
            }

            // Si el token es válido, iniciar Mercado Pago
            iniciarPagoMercadoPago();

        } catch (error) {
            console.error('Error:', error);
            
        }
    }

    async function iniciarPagoMercadoPago() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const items = cart.map(item => ({
            title: item.name,
            unit_price: Number(item.price),
            quantity: item.quantity,
        }));

        try {
            const response = await fetch('https://vision-digital-api.vercel.app/api/create_preference', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items })
            });

            if (!response.ok) {
                throw new Error('Error al crear la preferencia de pago');
            }

            const { id } = await response.json();
            const mp = new MercadoPago('TEST-e6e86703-feb8-4555-a64c-5acf8bb55e21', {
                locale: 'es-AR'
            });

            mp.checkout({
                preference: {
                    id: id
                },
                render: {
                    container: '#button-checkout',
                    label: 'Pagar con Mercado Pago'
                }
            });
        } catch (error) {
            console.error('Error:', error);
            checkoutContainer.innerHTML = '<p class="text-center mt-3 text-danger">Error al iniciar el pago. Por favor, intente nuevamente.</p>';
        }
    }

    renderCart();
    verificarCarritoYSesion();
});
