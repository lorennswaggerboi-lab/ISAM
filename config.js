// ============================================================
//  DATOS DE LA INSTITUCIÓN — editá solo este archivo
// ============================================================
window.ISAM_CONFIG = {
  // WhatsApp en formato internacional, sin "+", espacios ni guiones.
  // Celular: 549 + código de área sin 0 + número sin 15. Ej: 11 2345-6789 → 5491123456789
  // Dejalo vacío ("") si la escuela no tiene WhatsApp: los botones pasan a llamar a Secretaría.
  // (El fijo 0237-4690775 NO tiene WhatsApp, por eso está vacío.)
  whatsapp: "",

  // Mensaje que aparece precargado al abrir WhatsApp
  whatsappMessage: "Buenos días. Quisiera solicitar información sobre el Instituto General Don José de San Martín.",

  // Correo de Secretaría (opcional). Si hay correo y no hay WhatsApp, el formulario envía por correo.
  email: "",

  // Teléfono que se muestra en la página
  phoneDisplay: "0237 - 4690775",
  phoneTel: "+542374690775",

  // Año de fundación (con esto se calculan los años de trayectoria)
  foundedYear: 1979,

  // Cantidad de alumnos que muestra el contador de la portada
  students: 300,

  // Dirección que se muestra
  address: "Avellaneda y Ruta 23, Moreno, Buenos Aires",

  // Dirección exacta para ubicar el pin en el mapa
  mapQuery: "ISAM, Nicolás Avellaneda 3000, B1743JLD Moreno, Provincia de Buenos Aires",

  // Horario de atención de Secretaría
  hours: "Lunes a viernes, en horario escolar",

  // Calificación en Google (actualizar cada tanto)
  googleRating: 4.2,
  googleMapsUrl: "https://maps.app.goo.gl/qx3oLrruhobTMiR79",

  instagram: "https://www.instagram.com/secundaria.isam/"
};
