<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carrito de Compras</title>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css" rel="stylesheet">

    <link rel="stylesheet" href="carrito.css">
        
</head>
<body>
    <nav class="navbar navbar-expand-lg ">
        <div class="container-fluid">
            <a class="navbar-brand" href="index.html">
                <img src="img/logo.png" alt="Logo" style="height: 40px;">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                </ul>
            </div>
        </div>
    </nav>


  <div class="container mt-5">
        <h1 class="mb-4">Carrito de Compras</h1>
        <div class="row">
            <div class="col-md-8" id="cart-items">
            </div>
            <div class="col-md-4">
                <div class="bg-light p-3 rounded">
                    <h4 class="mb-3">Resumen del Pedido</h4>
                    <div class="cart-total d-flex justify-content-between">
                        <span>Total</span>
                        <span id="cart-total">$0.00</span>
                    </div>
                    <div id="wallet_container"></div>
                    <div id="button-checkout"></div>
                </div>
            </div>
        </div>
    </div>


    
    <footer class="footer text-center">
        <div class="container d-flex justify-content-around">
           
            <!-- Información de Contacto -->
            <div class="contact-info">
                <p><strong>Información de Contacto</strong></p>
                <p>
                    <i class="bi bi-geo-alt"></i> Av. Rigolleau 4253, Berazategui<br>
                    <i class="bi bi-globe"></i> Buenos Aires, Argentina<br>
                    <i class="bi bi-telephone"></i> (011) 4256-1689 Líneas Rotativas<br>

                </p>
            </div>
    
            <!-- Horarios de Atención -->
            <div class="business-hours">
                <p><strong>Horarios de Atención</strong></p>
                <p>
                    <i class="bi bi-shop"></i> Showroom de Atención al Público<br>
                    <i class="bi bi-calendar"></i> Lunes a Viernes: 10:00 a 17:00 hs.<br>
                    <i class="bi bi-calendar"></i> Sábados: 09:00 a 13:00 hs.
                </p>
            </div>
    
            <!-- Información de la Empresa -->
            <div class="company-info">
                <p><strong>Acerca de Vision Digital</strong></p>
                <p>
                    <a href="nuestra-empresa.html"><i class="bi bi-building"></i> Nuestra Empresa</a><br>
                    <a href="./AcercadeVisionDigital/Servicio Técnico.html"><i class="bi bi-file-earmark-text"></i> Términos y Condiciones</a><br>
                    <a href="./AcercadeVisionDigital/contacto.html"><i class="bi bi-chat"></i> Contacto</a>
                </p>
            </div>
        </div>
    
        <!-- Redes sociales -->
        <div class="social-media">
            <p>
                <a href="https://www.facebook.com" target="_blank"><i class="bi bi-facebook"></i></a>
                <a href="https://www.twitter.com" target="_blank"><i class="bi bi-twitter"></i></a>
                <a href="https://www.instagram.com" target="_blank"><i class="bi bi-instagram"></i></a>
                <br>&copy; Vision Digital. Todos los derechos reservados.
            </p>
        </div>
    </footer>

    <a href="https://api.whatsapp.com/send?phone=1156657009&text=Hola%20quiero%20más%20información!" target="_blank" class="whatsapp-button">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" class="whatsapp-icon">
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="scripts/carrito.js"></script>
    <script src="https://sdk.mercadopago.com/js/v2"></script>
</body>
</html>
