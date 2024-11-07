document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('shippingForm');
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            alert('Debe iniciar sesión para continuar');
            window.location.href = 'login/login.html';
            return;
        }

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        console.log('Carrito original:', cart);

        if (cart.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        const datos = {
            direccion: document.getElementById('direccion').value,
            codigo_postal: document.getElementById('codigoPostal').value,
            ciudad: document.getElementById('ciudad').value,
            provincia: document.getElementById('provincia').value
        };

        try {
            const validacionResponse = await fetch('https://vision-digital-api.vercel.app/api/usuarios/validar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });

            if (!validacionResponse.ok) {
                throw new Error('Token inválido');
            }

            const userData = await validacionResponse.json();
            
            // Modificación en la transformación de productos
            const productosFormateados = cart.map(item => {
                // Usamos 0 si no hay un ID válido
                return {
                    id_producto: item.productId || item.id || 0,  // Asignamos 0 si no hay ID
                    cantidad: parseInt(item.quantity || 1),
                    precio: parseFloat(item.price || 0)  // Agregado el precio si el API lo requiere
                };
            });

            const pedido = {
                id_usuario: userData.id_usuario,
                productos: productosFormateados,
                ...datos
            };

            console.log('Pedido a enviar:', pedido);

            const pedidoResponse = await fetch('https://vision-digital-api.vercel.app/api/pedidos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(pedido)
            });

            if (!pedidoResponse.ok) {
                const errorDetails = await pedidoResponse.json();
                console.log('Detalles del error:', errorDetails);
                throw new Error(errorDetails.error || 'Error al crear el pedido');
            }

            alert('Pedido creado exitosamente');
            localStorage.removeItem('cart');
            window.location.href = 'index.html';

        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar el pedido: ' + error.message);
        }
    });
});
