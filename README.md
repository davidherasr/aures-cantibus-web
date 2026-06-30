# Aures Cantibus · Web V3 institucional

Versión estática lista para GitHub Pages.

## Qué cambia en esta V3

- Home más editorial: Aures Cantibus como archivo vivo de una coral zamorana.
- Agenda compacta: tarjetas más pequeñas y consultables.
- Calendario de disponibilidad: días ocupados, disponibles y pasados.
- Galería convertida en archivo cultural: filtros, páginas de memoria, lightbox y compartir.
- Repertorio más musical: familias, obras destacadas, buscador y tarjetas.
- Página El Coro con más peso institucional: San Lázaro, significado del nombre, dirección y timeline.
- Footer reducido.
- Carpeta `data/` separada por secciones para facilitar una futura administración.

## Cómo subir a GitHub

Sube todo el contenido de esta carpeta a la raíz del repositorio. No subas la carpeta contenedora como subcarpeta.

Activa GitHub Pages en `Settings > Pages > Deploy from a branch > main > /root`.

## Qué editar

La web funciona con `assets/js/data.js`. Además, la carpeta `data/` contiene los mismos contenidos separados:

```
data/site.json
data/agenda.json
data/galerias.json
data/repertorio.json
data/noticias.json
```

Antes de publicar como web final, revisa especialmente:

- Email definitivo.
- Facebook definitivo.
- Fechas reales de agenda.
- Fotos reales y logo en mayor calidad.
- Datos legales de la asociación.
- Dominio en `sitemap.xml`, `robots.txt` y `CNAME`.
