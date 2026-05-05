const cerrarMenu = () => {
  if(isMobile()) {
    muestraMenu(2);
  }
}

const muestraMenu = (opcion) => {
  $('.overlay-menu').appendTo('body');
  if (opcion == 1 && isMobile()) {
    $(".overlay-menu").css("height", "100%");
    $(".overlay-menu").css("opacity", "1");
    $(".side-menu").css("left", "0");
    $(".overlay-menu").css("opacity", "1");
  }
  else {
    $(".overlay-menu").css("height", "");
    $(".overlay-menu").css("opacity", "");
    $(".side-menu").css("left", "");
  }
  $(".overlay-menu").css("transition", "opacity 1s ease-out 0s");
  $(".side-menu").css("transition", "left 0.2s ease 0s");
}

const link = (tipo, enlace) => {
  if (tipo == 1) {
    window.open(enlace);
  } else {
    setTimeout("location.href='" + enlace + "'");
  }
}

const opcionActive = (opcion) => {
  $('.opciones_menu').removeClass("opciones_menu_active");
  $('#' + opcion).addClass("opciones_menu_active");  
}

const activarLoad = (mensajeInicial) => {
  $('#modalLoading').modal('show');
  $('#mensajeLoading').html(mensajeInicial);
}


const closeLoad = (mensajeFinal) => {
  $('#mensajeLoading').html(mensajeFinal);
  setTimeout(() => {
    $('#modalLoading').modal('hide');
  }, 500);
}

const isMobile = () => {
  return /android|iphone|ipad|ipod|windows phone|mobile/i.test(navigator.userAgent);
}


window.cerrarMenu    = cerrarMenu;
window.muestraMenu   = muestraMenu;
window.link          = link;
window.opcionActive  = opcionActive;
window.activarLoad   = activarLoad;
window.closeLoad     = closeLoad;
window.isMobile     = isMobile;