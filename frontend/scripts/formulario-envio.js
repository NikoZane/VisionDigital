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
        
        // Verificar si el carrito está vacío
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
            
            // Transformar los productos del carrito al formato esperado
            const productosFormateados = cart.map(item => {
                // Asegurarse de que los valores sean números
                const id_producto = parseInt(item.id);
                const cantidad = parseInt(item.quantity);

                // Verificar que los valores sean válidos
                if (isNaN(id_producto) || isNaN(cantidad)) {
                    throw new Error('Datos del carrito inválidos');
                }

                return {
                    id_producto,
                    cantidad
                };
            });

            const pedido = {
                id_usuario: userData.id_usuario,
                productos: productosFormateados,
                ...datos
            };

            // Para depuración
            console.log('Estructura del carrito original:', cart);
            console.log('Productos formateados:', productosFormateados);
            console.log('Datos del pedido completo:', pedido);

            const pedidoResponse = await fetch('https://vision-digital-api.vercel.app/api/pedidos', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Por si acaso necesitas el token en el header
                },
                body: JSON.stringify(pedido)
            });

            if (!pedidoResponse.ok) {
                const errorDetails = await pedidoResponse.json();
                console.error('Detalles del error:', errorDetails);
                throw new Error(errorDetails.error || 'Error al crear el pedido');
            }

            const respuestaExitosa = await pedidoResponse.json();
            console.log('Respuesta exitosa:', respuestaExitosa);

            alert('Pedido creado exitosamente');
            localStorage.removeItem('cart');
            window.location.href = 'index.html';

        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar el pedido: ' + error.message);
        }
    });
});
