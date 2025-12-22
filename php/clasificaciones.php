<?php
// Activar errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Clase para leer la clasificación
class Clasificacion
{
    private string $documento;

    public function __construct()
    {
        $this->documento = __DIR__ . '/../xml/circuitoEsquema.xml';

    }

    public function consultar(): SimpleXMLElement|false
    {
        if (!file_exists($this->documento)) {
            echo "ERROR: El archivo XML no se encuentra en '" . $this->documento . "'";
            return false;
        }

        $xml = simplexml_load_file($this->documento);
        if ($xml === false) {
            echo "ERROR: No se pudo leer el XML.";
            return false;
        }

        // Registrar namespace para XPath
        $xml->registerXPathNamespace('ns', 'http://www.uniovi.es');

        return $xml;
    }
}

// Crear instancia y leer XML
$clasificacion = new Clasificacion();
$xml = $clasificacion->consultar();

if ($xml !== false) {
    // Obtener ganador y tiempo
    $vencedor = $xml->xpath('//ns:resultadoCarrera/ns:vencedor')[0];
    $tiempo = $xml->xpath('//ns:resultadoCarrera/ns:tiempo')[0];

    // Obtener clasificación mundial
    $pilotos = $xml->xpath('//ns:clasificacionMundial/ns:piloto');
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Clasificaciones MotoGP</title>
    <link rel="stylesheet" href="../estilo/estilo.css">
    <link rel="stylesheet" href="../estilo/layout.css">
    <link rel="icon" href="multimedia/favicon.ico" type="image/x-icon" />
</head>

<body>
    <header>
        <h1>MotoGP Desktop - Clasificaciones</h1>
        <nav>
            <a href="../index.html" accesskey="I" tabindex="1">Inicio</a>
            <a href="../piloto.html" accesskey="P" tabindex="2">Piloto</a>
            <a href="../circuito.html" accesskey="C" tabindex="3">Circuito</a>
            <a href="../meteorologia.html" accesskey="M" tabindex="4">Meteorología</a>
            <a href="clasificaciones.php" class="active" accesskey="C" tabindex="5">Clasificaciones</a>
            <a href="../juegos.html" accesskey="J" tabindex="6">Juegos</a>
            <a href="../ayuda.html" accesskey="A" tabindex="7">Ayuda</a>
        </nav>
    </header>

    <main>
        <?php if ($xml !== false): ?>
            <section>
                <h2>Ganador de la Carrera</h2>
                <p><strong>Vencedor:</strong> <?= $vencedor ?></p>
                <p><strong>Tiempo empleado:</strong> <?= $tiempo ?></p>
            </section>

            <section>
                <h2>Clasificación Mundial tras la Carrera</h2>
                <ol>
                    <?php foreach ($pilotos as $p): ?>
                        <li><?= $p ?></li>
                    <?php endforeach; ?>
                </ol>
            </section>
        <?php else: ?>
            <p>No se pudo cargar la información de la clasificación.</p>
        <?php endif; ?>
    </main>
    <footer>
        <p>© 2025 MotoGP-Desktop — Silvia Suárez Prendes</p>
    </footer>
</body>

</html>