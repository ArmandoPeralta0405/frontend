$(document).ready(function() {
  // Manejar el clic en los elementos que tienen la clase "nav-link"
  $('.nav-link').on('click', function(e) {
      // Evitar el comportamiento predeterminado de los enlaces
      e.preventDefault();

      // Obtener el elemento padre (li) del enlace
      var listItem = $(this).closest('li');

      // Verificar si el elemento padre tiene la clase "menu-open"
      if (listItem.hasClass('menu-open')) {
          // Si tiene la clase "menu-open", quitarla
          listItem.removeClass('menu-open');
      } else {
          // Si no tiene la clase "menu-open", agregarla
          listItem.addClass('menu-open');
      }
  });
});
