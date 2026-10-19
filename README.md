# ISAM — Instituto Gral. Don José de San Martín (Moreno)

Sitio web institucional del nivel secundario del ISAM.
Página estática: `index.html` + `styles.css` + `script.js` + `config.js`. No necesita servidor ni compilación.

## Ver la página
Abrir `index.html` en el navegador.

## Editar los datos de la escuela
Todo lo importante (WhatsApp, teléfono, dirección, año de fundación, horario, Instagram) está en **`config.js`**.
Los "años educando" se calculan solos a partir de `foundedYear`.

> WhatsApp: está configurado con el fijo 0237-4690775 (`542374690775`). Si la escuela usa un celular para WhatsApp,
> cambiar `whatsapp` por `549` + código de área sin 0 + número sin 15.

## Publicar
Se puede subir gratis a GitHub Pages, Netlify o Vercel tal cual está.
