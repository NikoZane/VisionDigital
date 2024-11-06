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

        const datos = {
            direccion: document.getElementById('direccion').value,
            codigoPostal: document.getElementById('codigoPostal').value,
            ciudad: document.getElementById('ciudad').value,
            provincia: document.getElementById('provincia').value
        };

        try {
            // Validar el token
            const validacionResponse = await fetch('https://vision-digital-api.vercel.app/api/usuarios/validar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });

            if (!validacionResponse.ok) {
                throw new Error('Token inválido');
            }

            const userData = await validacionResponse.json();
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            const pedido = {
                id_usuario: userData.id_usuario,
                productos: cart.map(item => ({
                    id_producto: item.id,
                    cantidad: item.quantity
                })),
                ...datos
            };

            // Crear el pedido
            const pedidoResponse = await fetch('https://vision-digital-api.vercel.app/api/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedido)
            });

            if (pedidoResponse.ok) {
    alert('Pedido creado exitosamente');
    localStorage.removeItem('cart'); // Limpiar el carrito
    window.location.href = 'index.html'; // Redirigir al inicio
                
} else {
    throw new Error('Error al crear el pedido');
                    console.error('Detalles del error en la creación del pedido:', errorDetails);

}

            alert('Pedido creado exitosamente');
            localStorage.removeItem('cart'); // Limpiar el carrito
            window.location.href = 'index.html'; // Redirigir al inicio

        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar el pedido');
        }
    });
});
