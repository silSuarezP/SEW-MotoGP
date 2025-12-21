<?php
// Clase para leer la clasificación desde XML
class Clasificacion
{
    private string $documento;

    public function __construct()
    {
        $this->documento = __DIR__ . '/xml/circuitoEsquema.xml';
    }

    public function consultar(): SimpleXMLElement|false
    {
        if (!file_exists($this->documento)) {
            echo "El archivo XML no se encuentra.";
            return false;
        }

        $xml = simplexml_load_file($this->documento);

        if ($xml === false) {
            echo "Error al leer el XML.";
            return false;
        }

        return $xml;
    }
}

// Crear instancia y leer XML
$clasificacion = new Clasificacion();
$xml = $clasificacion->consultar();
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Clasificaciones MotoGP</title>
    <link rel="stylesheet" href="../estilo/estilo.css">
    <link rel="stylesheet" href="../estilo/layout.css">
    <link rel="icon" href="../multimedia/favicon.ico" type="image/x-icon" />
</head>

<body>
    <header>
        <h1>MotoGP Desktop - Clasificaciones</h1>
        <nav>
            <a href="../index.html">Inicio</a>
            <a href="../piloto.html">Piloto</a>
            <a href="../circuito.html">Circuito</a>
            <a href="../meteorologia.html">Meteorología</a>
            <a href="../clasificaciones.php" class="active">Clasificaciones</a>
            <a href="../juegos.html">Juegos</a>
            <a href="../ayuda.html">Ayuda</a>
        </nav>
    </header>

    <main>
        <?php if ($xml !== false): ?>
            <!-- Tarea 4: Mostrar ganador de la carrera -->
            <section>
                <h2>Ganador de la Carrera</h2>
                <p><strong>Vencedor:</strong> <?= $xml->resultadoCarrera->vencedor ?></p>
                <p><strong>Tiempo empleado:</strong> <?= $xml->resultadoCarrera->tiempo ?></p>
            </section>

            <!-- Tarea 5: Mostrar clasificación mundial -->
            <section>
                <h2>Clasificación Mundial tras la Carrera</h2>
                <ol>
                    <?php foreach ($xml->clasificacionMundial->piloto as $piloto): ?>
                        <li><?= $piloto ?></li>
                    <?php endforeach; ?>
                </ol>
            </section>
        <?php else: ?>
            <p>No se pudo cargar la información de la clasificación.</p>
        <?php endif; ?>
    </main>
</body>

</html>