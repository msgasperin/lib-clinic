  
<div class="row fondo-azul-1 header-top">
  <div class="col-xl-2 col-lg-2 col-md-3 col-sm-3 col-5 p-2 mt-2" align="center">
    <img src="assets/images/logo_text.webp" class="img-logo"></img>
  </div>
  <div class="col-xl-10 col-lg-10 col-md-9 col-sm-9 col-7 fs-1" align="right">
    <div class="p-3">
      <div class="d-none d-xl-block d-xxl-block text-dark text-white">
        <div class="fs-8"><i class="bi bi-person-circle fs-6">&nbsp;</i> <?php echo $_SESSION["nombre"] ?></div>
        <div class="fs-8">Administrador</div>
      </div>
      <div class="d-block d-xl-none d-xxl-none text-white" onclick="muestraMenu(1);">
        <i class="bi bi-list"></i>
      </div>
    </div>
  </div>
</div>

<div class="row">
  <div class="col-12">
    <div class="overlay-menu m-responsive">
      <div class="side-menu wm-responsive">
        <div class="row mt-4">
          <div class="col-8 offset-1 d-lg-none mt-3 text-white">
            <div class="fs-6">&nbsp;<?php echo $_SESSION["nombre"] ?></div>
            <div class="fs-7">&nbsp;Admininstrador</div>
          </div>
          <div class="col-1 d-lg-none text-white mt-3" onclick="muestraMenu(2);">
            <i class="bi bi-x-lg"></i>
          </div>
        </div>
        <div class="mt-cel">
          <!--
          <div class="opciones_menu align-menu" id="opcionDashboard" onclick="opcionActive('opcionDashboard'), TabDashboard(), cerrarMenu();">
            <i class="bi bi-speedometer2 icon-menu"></i>
            <div>Dashboard</div>
          </div>
          -->
          <div class="opciones_menu align-menu text-white" id="opcionCitas" onclick="opcionActive('opcionCitas'), TabCitas(), cerrarMenu();">
            <i class="bi bi-calendar4-week icon-menu"></i>
            <div>Citas</div>
          </div>

          <?php if($_SESSION["perfil"] == 1 || $_SESSION["perfil"] == 2) { ?>
            <div class="opciones_menu align-menu text-white" id="opcionPacientes" onclick="opcionActive('opcionPacientes'), TabPacientes(), cerrarMenu();">
              <i class="bi bi-person-bounding-box icon-menu"></i>
              <div>Pacientes</div>
            </div>
          <?php } ?>

          <?php if($_SESSION["perfil"] == 1) { ?>
            <div class="opciones_menu align-menu text-white" id="opcionUsuarios" onclick="opcionActive('opcionUsuarios'), TabUsuarios(), cerrarMenu();">
              <i class="bi bi-person-gear icon-menu"></i> 
              <div>Usuarios</div>
            </div>
          <?php } ?>

          <div class="opciones_menu align-menu text-white" id="opcionSalir" onclick="fn_cerrar_sesion();">
            <i class="bi bi-box-arrow-left icon-menu"></i>
            <div>Salir</div>
          </div>

        </div>                
      </div>  
    </div>  
  </div>
</div>
<!-- cierre menu lateral -->