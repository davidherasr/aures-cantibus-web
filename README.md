# Aures Cantibus · Web estática

Web oficial propuesta para **Aures Cantibus**, coral de voces mixtas de Zamora. Está preparada en **HTML + CSS + JavaScript puro**, sin dependencias, para que puedas subirla directamente a GitHub y probarla en GitHub Pages, Vercel o Netlify.

## Qué incluye

- Inicio con hero, próxima actuación destacada, estadísticas, galería y actualidad.
- Página `El Coro` con historia, cita latina, dirección musical y línea temporal.
- Agenda con próximos conciertos, archivo, filtros y página de detalle por evento.
- Galería con carrusel, filtros, páginas individuales y lightbox.
- Repertorio con buscador en tiempo real y filtros por categoría/origen.
- Canta con nosotros con bloques por cuerda y preguntas frecuentes.
- Contacto con formulario estático que abre un correo preparado.
- Actualidad y páginas legales base.
- Aviso de cookies preparado, sin analítica por defecto.
- `.nojekyll` para GitHub Pages.

## Estructura

```txt
aures-cantibus-web/
  index.html
  el-coro.html
  agenda.html
  galeria.html
  repertorio.html
  canta.html
  contacto.html
  actualidad.html
  aviso-legal.html
  privacidad.html
  cookies.html
  404.html
  assets/
    css/styles.css
    js/data.js
    js/main.js
    img/
      logo-aures-cantibus.png
      hero-coro.jpg
      hero-coro-warm.jpg
      gallery/
      icons/
  robots.txt
  sitemap.xml
  CNAME.example
  .nojekyll
```

## Probar en local

Opción rápida con Python:

```bash
cd aures-cantibus-web
python -m http.server 8000
```

Luego abre:

```txt
http://localhost:8000
```

También puedes abrir `index.html` directamente, pero es mejor usar servidor local para simular el comportamiento real.

## Editar contenido

El contenido vivo está en:

```txt
assets/js/data.js
```

Ahí puedes cambiar:

- Próximas actuaciones.
- Galerías.
- Repertorio.
- Noticias.
- Preguntas frecuentes.
- Email de contacto.
- Enlaces externos.

### Añadir una actuación

En `assets/js/data.js`, busca `events` y añade un bloque como este:

```js
{
  id: "concierto-ejemplo-2027",
  title: "Concierto ejemplo",
  eyebrow: "Próxima actuación",
  date: "2027-01-15",
  time: "20:00",
  place: "Iglesia / Auditorio",
  city: "Zamora",
  address: "Dirección completa",
  type: "Concierto",
  status: "proximo",
  image: "assets/img/gallery/navidad-san-lazaro-cover.jpg",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Zamora",
  programUrl: "",
  short: "Resumen breve.",
  description: "Texto más amplio de la actuación.",
  featured: false
}
```

### Añadir una galería

Sube las fotos a una carpeta, por ejemplo:

```txt
assets/img/gallery/concierto-ejemplo/
```

Y añade en `galleries`:

```js
{
  id: "concierto-ejemplo",
  title: "Concierto ejemplo",
  date: "2027-01-15",
  place: "Zamora",
  category: "Concierto",
  cover: "assets/img/gallery/concierto-ejemplo/cover.jpg",
  lead: "Resumen de la galería.",
  description: "Texto de contexto.",
  images: [
    { src: "assets/img/gallery/concierto-ejemplo/01.jpg", caption: "Foto 1" },
    { src: "assets/img/gallery/concierto-ejemplo/02.jpg", caption: "Foto 2" }
  ],
  featured: true
}
```

## Subir a GitHub

1. Crea un repositorio nuevo en GitHub, por ejemplo `aures-cantibus-web`.
2. Desde la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Primera versión web Aures Cantibus"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/aures-cantibus-web.git
git push -u origin main
```

## Publicar con GitHub Pages

En GitHub:

```txt
Settings > Pages > Build and deployment
Source: Deploy from a branch
Branch: main
Folder: /root
Save
```

GitHub te dará una URL tipo:

```txt
https://TU_USUARIO.github.io/aures-cantibus-web/
```

## Publicar con dominio propio

Cuando tengáis comprado `aurescantibus.es`:

1. Renombra `CNAME.example` a `CNAME`.
2. Dentro debe aparecer:

```txt
aurescantibus.es
```

3. En el proveedor del dominio, configura DNS hacia GitHub Pages.
4. En GitHub Pages, activa `Enforce HTTPS` cuando esté disponible.

## Publicar en Vercel o Netlify

También puedes importar el repositorio desde Vercel o Netlify. Como es una web estática sin build, normalmente basta con:

```txt
Framework preset: Other
Build command: vacío
Output directory: .
```

En Vercel/Netlify añadirías el dominio propio desde el panel de proyecto.

## Cosas que debes revisar antes de publicar oficialmente

- Cambiar `contacto@aurescantibus.es` por el correo real.
- Sustituir fotos de ejemplo por fotos originales autorizadas.
- Completar datos legales reales de la asociación.
- Decidir si se mantiene o elimina el aviso de cookies.
- Configurar un sistema de formulario real si no queréis usar `mailto:`.
- Cambiar los eventos de ejemplo por agenda real.
- Revisar fechas, lugares y mapas.

## Formulario real recomendado

La versión actual abre un correo preparado. Para enviar formularios directamente desde la web puedes usar:

- Formspree.
- Netlify Forms.
- Un pequeño backend propio.
- Un formulario conectado a Google Forms, aunque visualmente es menos fino.

## Migración futura a CMS

Si más adelante la coral quiere actualizar agenda y galerías sin tocar código, puedes migrar a:

- Astro + TinaCMS.
- Astro + Decap CMS con backend GitHub.
- Astro + Sanity.

Para empezar, esta versión estática es más simple, más rápida y más fácil de publicar.
