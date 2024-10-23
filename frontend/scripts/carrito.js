document.addEventListener('DOMContentLoaded', () => {
  const cartContainer = document.getElementById('cart-items');
  const totalElement = document.getElementById('cart-total');
  const buttonMp = document.getElementById('button-checkout');

  function renderCart() {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cartContainer.innerHTML = '';
      let total = 0;

      cart.forEach(item => {
          const { name, price, quantity } = item;
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
                  <button class="btn btn-sm btn-danger" data-name="${name}">
                      <i class="fas fa-trash-alt"></i>
                  </button>
              </div>`;
          cartContainer.appendChild(cartItem);
      });

      totalElement.textContent = `$${total}`;

      document.querySelectorAll('.btn-danger').forEach(button => {
          button.addEventListener('click', () => {
              const name = button.getAttribute('data-name');
              let cart = JSON.parse(localStorage.getItem('cart')) || [];
              cart = cart.filter(item => item.name !== name);
              localStorage.setItem('cart', JSON.stringify(cart));
              renderCart();
          });
      });
  }

  function verificarCarrito() {
      const carritoJSON = localStorage.getItem('cart');
      const carrito = JSON.parse(carritoJSON);
      if (!carrito || carrito.length === 0) {
          procederpago.style.display = 'none';
          return false;
      }
      return true;
  }

  function validarToken(token, datos) {
      fetch('http://localhost:3000/api/usuarios/validar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
      })
      .then(response => response.json())
      .then(data => {
          const carritoJSON = localStorage.getItem('cart');
          const carrito = JSON.parse(carritoJSON);
          
          const pedidos = {
              id_usuario: data.id_usuario,
              productos: carrito.map(item => ({
                  id_producto: item.id,
                  cantidad: item.quantity
              })),
              direccion: datos.direccion,
              codigo_postal: datos.codigoPostal,
              ciudad: datos.ciudad,
              provincia: datos.provincia
          };
  
          crearPedidos(pedidos);
      })
      .catch(error => reiniciar());
  }
  
  async function iniciarPagoMercadoPago() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const items = cart.map(item => ({
        title: item.name,
        unit_price: Number(item.price),
        quantity: item.quantity,
    }));

    try {
        const response = await fetch('http://localhost:3000/api/create_preference', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items })
        });

        if (!response.ok) {
            throw new Error('Error al crear la preferencia de pago');
        }

        const { id } = await response.json();

        // Inicializar el botón de pago de Mercado Pago
        const mp = new MercadoPago('APP_USR-227034dd-364d-4a37-9ff8-91462d7cdbba', {
            locale: 'es-AR'
        });

        mp.checkout({
            preference: {
                id: id
            },
            render: {
                container: '#button-checkout',
                label: 'Pagar con Mercado Pago',
                buttonText: 'Proceder al Pago',
            },
            autoOpen: true
        });
    } catch (error) {
        console.error('Error en la comunicación con el servidor:', error);
        alert('Ocurrió un error al comunicarse con el servidor. Por favor, intente de nuevo.');
    }
}
  
    async function crearPedidos(pedido) {
      try {
        const response = await fetch('http://localhost:3000/api/pedidos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pedido)
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error: ${errorData.error}`);
        }
    
        alert('Pedido creado exitosamente');
        // Aquí puedes redirigir al usuario a una página de confirmación
      } catch (error) {
        console.error('Error al crear el pedido:', error);
        alert('No se pudo procesar el pedido. Por favor, intente de nuevo.');
      }
    }

  function reiniciar() {
      localStorage.removeItem('authToken');
      window.location.href = 'login/login.html';
  }

  renderCart();
  verificarCarrito();

  buttonMp.addEventListener('click', async function(event) {
    event.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Debe iniciar sesión para proceder con el pago.');
        window.location.href = 'login/login.html';
        return;
    }
    if (!verificarCarrito()) return;

    try {
        await iniciarPagoMercadoPago();
    } catch (error) {
        console.error('Error al iniciar el pago:', error);
        alert('No se pudo iniciar el proceso de pago. Por favor, inténtelo de nuevo.');
    }
});

  document.getElementById('paymentForm').addEventListener('submit', function(event) {
      event.preventDefault();
      // Validar los campos del formulario...
      // Si todo está correcto, proceder con el pago
      const token = localStorage.getItem('authToken');
      const datos = {
          direccion: document.getElementById('direccion').value,
          codigoPostal: document.getElementById('codigoPostal').value,
          ciudad: document.getElementById('ciudad').value,
          provincia: document.getElementById('provincia').value
      };
      validarToken(token, datos);
  });
});