<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Libro de Reclamaciones</title>
</head>
<body>
    <h1>Libro de Reclamaciones</h1>
    <form action="process.php" method="post">
        <label for="name">Nombre:</label><br>
        <input type="text" id="name" name="name" required><br><br>

        <label for="email">Correo electrónico:</label><br>
        <input type="email" id="email" name="email" required><br><br>

        <label for="type">Tipo:</label><br>
        <select id="type" name="type" required>
            <option value="queja">Queja</option>
            <option value="reclamo">Reclamo</option>
        </select><br><br>

        <label for="message">Mensaje:</label><br>
        <textarea id="message" name="message" rows="4" required></textarea><br><br>

        <input type="submit" value="Enviar">
    </form>
</body>
</html>