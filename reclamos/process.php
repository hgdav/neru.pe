<?php
error_reporting(E_ALL); // Mostrar todos los errores y advertencias
ini_set('display_errors', 1); // Hacer que los errores se muestren en la página

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener los datos del formulario
    $tipoDocumento = htmlspecialchars($_POST['tipoDocumento']);
    $numeroDocumento = htmlspecialchars($_POST['numeroDocumento']);
    $nombres = htmlspecialchars($_POST['nombres']);
    $apellido1 = htmlspecialchars($_POST['apellido1']);
    $apellido2 = htmlspecialchars($_POST['apellido2']);
    $tipoRespuesta = htmlspecialchars($_POST['tipoRespuesta']);
    $email = htmlspecialchars($_POST['email']);
    $departamento = htmlspecialchars($_POST['departamento']);
    $provincia = htmlspecialchars($_POST['provincia']);
    $distrito = htmlspecialchars($_POST['distrito']);
    $telefono = htmlspecialchars($_POST['telefono']);
    $emailComprobante = htmlspecialchars($_POST['emailComprobante']);
    $menorDeEdad = isset($_POST['menorDeEdad']) ? "Sí" : "No";

    if ($menorDeEdad === "Sí") {
        $tipoDocumentoApoderado = htmlspecialchars($_POST['tipoDocumentoApoderado']);
        $numeroDocumentoApoderado = htmlspecialchars($_POST['numeroDocumentoApoderado']);
        $nombresApoderado = htmlspecialchars($_POST['nombresApoderado']);
        $apellido1Apoderado = htmlspecialchars($_POST['apellido1Apoderado']);
        $apellido2Apoderado = htmlspecialchars($_POST['apellido2Apoderado']);
    }

    $bienContratado = htmlspecialchars($_POST['bienContratado']);
    $montoReclamado = htmlspecialchars($_POST['montoReclamado']);
    $descripcionProducto = htmlspecialchars($_POST['descripcionProducto']);
    $fecha = htmlspecialchars($_POST['fecha']);
    $tipoSolicitud = htmlspecialchars($_POST['tipoSolicitud']);
    $detalleReclamo = htmlspecialchars($_POST['detalleReclamo']);
    $pedido = htmlspecialchars($_POST['pedido']);

    // Leer el número del documento actual y aumentar el contador
    $counterFile = 'contador.txt';
    $documentNumber = file_get_contents($counterFile);
    $documentNumber = (int)$documentNumber + 1;
    file_put_contents($counterFile, $documentNumber);

    // Configurar los correos electrónicos
    $toAdmin = 'tu-correo@ejemplo.com';
    $subjectAdmin = "Nuevo $tipoSolicitud recibido - Documento Nº $documentNumber";
    $messageAdmin = "Has recibido un nuevo $tipoSolicitud.\n\n" .
                    "Número de documento: $documentNumber\n" .
                    "Tipo de Documento: $tipoDocumento\n" .
                    "Número de Documento: $numeroDocumento\n" .
                    "Nombres: $nombres\n" .
                    "Apellido Paterno: $apellido1\n" .
                    "Apellido Materno: $apellido2\n" .
                    "Tipo de Respuesta: $tipoRespuesta\n" .
                    "Correo: $email\n" .
                    "Departamento: $departamento\n" .
                    "Provincia: $provincia\n" .
                    "Distrito: $distrito\n" .
                    "Teléfono: $telefono\n" .
                    "Correo para Comprobante: $emailComprobante\n" .
                    "Menor de Edad: $menorDeEdad\n";

    if ($menorDeEdad === "Sí") {
        $messageAdmin .= "Datos del Apoderado:\n" .
                         "Tipo de Documento: $tipoDocumentoApoderado\n" .
                         "Número de Documento: $numeroDocumentoApoderado\n" .
                         "Nombres: $nombresApoderado\n" .
                         "Apellido Paterno: $apellido1Apoderado\n" .
                         "Apellido Materno: $apellido2Apoderado\n";
    }

    $messageAdmin .= "Producto o Servicio: $bienContratado\n" .
                     "Monto Reclamado: $montoReclamado\n" .
                     "Descripción del Producto/Servicio: $descripcionProducto\n" .
                     "Fecha: $fecha\n" .
                     "Detalle del Reclamo:\n$detalleReclamo\n\n" .
                     "Pedido:\n$pedido";

    $subjectClient = "Confirmación de recepción de su $tipoSolicitud - Documento Nº $documentNumber";
    $messageClient = "Gracias por enviar su $tipoSolicitud.\n\n" .
                     "Número de documento: $documentNumber\n" .
                     "Nos pondremos en contacto con usted lo antes posible.";

    // Enviar los correos
    $headers = "From: no-reply@tu-dominio.com";

    mail($toAdmin, $subjectAdmin, $messageAdmin, $headers);
    mail($email, $subjectClient, $messageClient, $headers);

    // Redirigir al usuario a una página de confirmación
    echo "Su $tipoSolicitud ha sido enviado correctamente. Documento Nº $documentNumber";



    
    // Verificar si el correo se envió correctamente
    if (mail($toAdmin, $subjectAdmin, $messageAdmin, $headers)) {
        echo "Correo enviado con éxito.";
    } else {
        echo "Error al enviar el correo. Verifica la configuración de tu servidor de correos.";
    }

    if (mail($email, $subjectClient, $messageClient, $headers)) {
        echo "Correo de confirmación enviado al cliente.";
    } else {
        echo "Error al enviar el correo de confirmación al cliente.";
    }
} else {
    echo "Método de solicitud no válido.";
}
?>
