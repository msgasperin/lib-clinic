import { valida_login, cerrar_sesion } from "./LoginServices.js";

const ModalToken = (correo) => {
  html = `
  <div class="modal fade" id="modalToken" tabindex="-1" aria-labelledby="modalToken" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header modal-head-per">
          <h1 class="modal-title fs-5" id="titModalToken">Autenticación en dos pasos</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12 mt-4 mb-2">
              <label for="tokenLogin" class="form-label fs-7"><i class="bi bi-lock"></i> Ingresa el token que llegó al correo:</label> 
              <div class="fs-8">${correo}</div>
              <input type="text" class="form-control form-control-lg fs-7" id="tokenLogin" placeholder="Token...">
              <span class="fs-8 text-secondary"><i class="bi bi-exclamation-circle"></i>&nbsp;Recuerda revisar la bandeja de spam o correos no deseados</span>
            </div>
            <div class="col-12 mt-2">
              <div id="msjSendMail"></div>
            </div>
            <div class="col-12 mt-5 mb-2" align="right">
              <button type="button" class="btn btn-danger btn-redondo fs-6" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-dark btn-redondo fs-6" id="btnConfirmToken" onclick="fnValidaToken();">Confirmar token</button>
            </div>
          </div>
        </div>
        <div class="modal-footer" align="right">
          <button type="button" class="btn btn-outline-secondary btn-redondo fs-6" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>`;
  $('#modalIndex').html(html);
  $('#modalToken').modal('show');
}

const ModalRecuperarPass = () => {
  html = `
  <div class="modal fade" id="modalRecuperarPass" tabindex="-1" aria-labelledby="modalRecuperarPass" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header modal-head-per">
          <h1 class="modal-title fs-5" id="titModalRecuperarPass">Recuperar contraseña</h1>
          <button type="button" class="btn btn-outline-light btn-sm" data-bs-dismiss="modal" aria-label="Close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body">
          <div id="primerPasoRecuperarPass">
            <div class="row">
              <div class="col-12 mt-4 mb-2">
                <label for="mailPass" class="form-label fs-7"><i class="bi bi-envelope-at"></i> Ingresa el correo asociado a tu cuenta:</label> 
                <input type="text" class="form-control form-control-lg fs-7" id="mailPass" placeholder="example@gmail.com...">
              </div>
              <div class="col-12 mt-2">
                <div id="msjSendMail"></div>
              </div>
              <div class="col-12 mt-5 mb-2" align="right">
                <button type="button" class="btn btn-danger fs-6 btn-redondo" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-dark fs-6 btn-redondo" id="btnConfirmToken" onclick="fnValidaCorreo();">Confirmar correo</button>
              </div>
            </div>
          </div>

          <div id="segundoPasoRecuperarPass" class="no-display">
            <div class="row">
              <div class="col-12 mt-4 mb-2">
                <label for="tokenPass" class="form-label fs-7"><i class="bi bi-lock"></i> Ingresa el token enviado a tu cuenta de correo:</label> 
                <input type="text" class="form-control form-control-lg fs-7" id="tokenPass" placeholder="token...">
              </div>
              <div class="col-12 mt-4 mb-2">
                <label for="nuevoPass" class="form-label fs-7"><i class="bi bi-lock"></i> Ingresa tu nueva contraseña:</label> 
                <input type="text" class="form-control form-control-lg fs-7" id="nuevoPass" placeholder="nueva contraseña...">
                <div class="fs-8 text-secondary p-2 mt-2" id="lineamientosPs"><i class="bi bi-exclamation-circle"></i>&nbsp; 
                  Al menos una mayúscula, una minúscula un caracter especial, un número; longitud entre 8 y 15 caracteres
                </div>
              </div>
              <div class="col-12 mt-4 mb-2">
                <label for="confirmNuevoPass" class="form-label fs-7"><i class="bi bi-lock"></i> Confirma tu nueva contraseña:</label> 
                <input type="text" class="form-control form-control-lg fs-7" id="confirmNuevoPass" placeholder="nueva contraseña...">
              </div>
              <div class="col-12 mt-5 mb-2" align="right">
                <button type="button" class="btn btn-danger btn-redondo fs-6" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-dark btn-redondo fs-6" id="btnConfirmToken" onclick="fnCambiarPass();">Cambiar contraseña</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer" align="right">
          <button type="button" class="btn btn-outline-secondary btn-redondo fs-6" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>`;
  $('#modalIndex').html(html);
  $('#modalRecuperarPass').modal('show');
}

const fn_login = async () => {
  let user = $.trim($('#userLogin').val());
  let pass = $.trim($('#passwordLogin').val());
  let csrf = $('#csrfToken').val();

  if (user == '') {
    ToastColor.fire({
      text: '¡Atención! Debes ingresar un nombre de usuario',
      icon: 'warning',
      position: 'top',
      timerProgressBar: false
    });
    $('#userLogin').focus();
    return;
  } else if (pass == '') {
    ToastColor.fire({
      text: '¡Atención! Debes ingresar tu contraseña',
      icon: 'warning',
      position: 'top',
      timerProgressBar: false
    });
    $('#passwordLogin').focus();
    return;
  }

  $('#btnLogin').prop('disabled',true);
  let res = await valida_login(user, pass, csrf);
  if(res.estatus == 200) {
    showMessageSwalTimer('Bienvenido al equipo', 'LIB Laboratorios', 'success', 2500);
    redireccionar("webapp/admin", 1000);
  }
  else if(res.estatus == 202) {
    showMessageSwalTimer('Usuario no encontrado', '', 'info', 2500);
    $('#btnLogin').prop('disabled',false);
    return;
  }
  else if(res.estatus == 202) {
    showMessageSwalTimer('Debes ingresar usuario y contraseña', '', 'info', 2500);
    $('#btnLogin').prop('disabled',false);
    return;
  }
  else if (res.estatus == 429) { 
    showMessageSwal('Acceso bloqueado', res.mensaje, 'error');
    $('#btnLogin').prop('disabled', true);
  }
  else {
    showMessageSwal('Ocurrio un error: ', res.mensaje, 'error');
    $('#btnLogin').prop('disabled',false);
  }
}

const fn_cerrar_sesion = async () => {
  
  const res = await showMessageSwalQuestion('¿Estás seguro?', 'Se cerrará la sesión', 'question', 'Sí, cerrar', 'Cancelar');
   
  if (!res.result) {
    return;
  }

  let respuesta = await cerrar_sesion();
  if(respuesta.estatus == 200) {
    showMessageSwalTimer('Sesión finalizada correctamente', '', 'success', 2500);
    redireccionar("../inicio", 1000);
  }
  else {
    showMessageSwal('Ocurrio un error: ', res.mensaje, 'error');
  }
}

const send_token = (correo, movimiento) => {
  let datos = { func: 'fnSendToken', correo, movimiento };

  $.ajax({
    url: "api/controller/fnNotifToken.php",
    type: "POST",
    data: datos
  }).done((res) => {
    if (res.estatus != 200) {
      $('#msjSendMail').html('<div class="alert alert-warning p-2" align="center">' + res.mensaje + '</div>');
      $('#btnConfirmToken').prop('disabled', true);
    }
  }).fail((err) => {
    $('#msjSendMail').html('<div class="alert alert-warning p-2" align="center">Hubo un problema para enviar el token, intentalo de nuevo</div>');
    $('#btnConfirmToken').prop('disabled', true);
  });
}

const check_password = (password) => {
  let validaPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;
  let res;
  validaPassword.test(password) ? res = true : res = false;
  return res;
}

const ver_password = (campo, icon) => {
  var input = document.getElementById(campo);
  var tipo = input.getAttribute("type");
  if (tipo == 'password') {
    input.setAttribute('type', 'text');
    $('#eyePassword').html('<i class="bi bi-eye"></i>');
  } else {
    input.setAttribute('type', 'password');
    $('#' + icon).html('<i class="bi bi-eye-slash"></i>');
  }
}

const redireccionar = (dir, tiempo) => {
  setTimeout("location.href='" + dir + "'", tiempo);
}

window.ModalToken          = ModalToken;
window.ModalRecuperarPass  = ModalRecuperarPass;
window.fn_login            = fn_login;
window.fn_cerrar_sesion    = fn_cerrar_sesion;
window.send_token          = send_token;
window.check_password      = check_password;
window.ver_password        = ver_password;
window.redireccionar       = redireccionar;