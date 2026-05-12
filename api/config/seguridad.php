<?php
if (isset($_SESSION["login_lib_clinic"]) && $_SESSION["login_lib_clinic"] === "SI") {

    // ── Protección contra session hijacking ──────────────────────────────
    $agente_actual = $_SERVER['HTTP_USER_AGENT'] ?? '';

    // Primera carga tras login — guardar huella del navegador
    if (!isset($_SESSION['_agente'])) {
        $_SESSION['_agente'] = $agente_actual;
    }

    // Si cambia el navegador durante la sesión, cerrarla
    if ($_SESSION['_agente'] !== $agente_actual) {
        session_destroy();
        header('Location: ../index.php');
        exit;
    }

    // ── Regeneración periódica del ID de sesión (cada 5 min) ─────────────
    if (!isset($_SESSION['_last_regen'])) {
        $_SESSION['_last_regen'] = time();
    }

    if (time() - $_SESSION['_last_regen'] > 300) {
        session_regenerate_id(true);
        $_SESSION['_last_regen'] = time();
    }

    // ── Token de sesión rotativo ─────────────────────────────────────────
    if (!isset($_SESSION['_token'])) {
        $_SESSION['_token'] = bin2hex(random_bytes(16));
    }

} else {
    header('Location: ../index.php');
    exit;
}