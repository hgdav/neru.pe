<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener los datos del formulario
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $type = htmlspecialchars($_POST['type']);
    $message = htmlspecialchars($_POST['message']);

    // Leer el número del documento actual y aumentar el contador
    $counterFile = 'contador.txt';
    $documentNumber = file_get_contents($counterFile);
    $documentNumber = (int)$documentNumber + 1;
    file_put_contents($counterFile, $documentNumber);

    // Configurar los correos electrónicos
    $toAdmin = 'tu-correo@ejemplo.com';
    $subjectAdmin = "Nuevo $type recibido - Documento Nº $documentNumber";
    $messageAdmin = "Has recibido un nuevo $type.\n\n" .
                    "Número de documento: $documentNumber\n" .
                    "Nombre: $name\n" .
                    "Correo: $email\n" .
                    "Mensaje:\n$message";

    $subjectClient = "Confirmación de recepción de su $type - Documento Nº $documentNumber";
    $messageClient = "Gracias por enviar su $type.\n\n" .
                     "Número de documento: $documentNumber\n" .
                     "Nos pondremos en contacto con usted lo antes posible.";

    // Enviar los correos
    $headers = "From: no-reply@tu-dominio.com";

    mail($toAdmin, $subjectAdmin, $messageAdmin, $headers);
    mail($email, $subjectClient, $messageClient, $headers);

    // Redirigir al usuario a una página de confirmación
    echo "Su $type ha sido enviado correctamente. Documento Nº $documentNumber";
} else {
    echo "Método de solicitud no válido.";
}
?>
