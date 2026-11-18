# Otra forma de mirar

Prototipo de una galería colectiva responsive, pensada para presentar alrededor de 130 trabajos de arte. Abrí `index.html` en un navegador; no necesita instalación ni servidor.

## Qué incluye

- Colección de 130 obras de muestra, organizada en 19 secciones de siete trabajos por consigna (la última queda con cuatro).
- Marcos rectangulares responsivos que conservan la imagen completa, sin recortar los dibujos.
- Búsqueda por consigna o artista, filtro por artista y orden de artistas dentro de cada sección.
- Favoritos guardados en este navegador.
- Ficha ampliada de cada obra, con navegación entre piezas y controles de teclado.
- Diseño adaptable a celular, tablet y escritorio.

## Reemplazar las obras de muestra

1. Copiá las imágenes reales en `obras/` (por ejemplo, `obras/01-mi-obra.jpg`).
2. Abrí `app.js` y reemplazá el generador de `artworks` por la lista de trabajos reales. Cada entrada debe tener estos campos:

   ```js
   { id: 1, prompt: 1, title: "Nombre de la consigna", artist: "Nombre de quien la hizo",
     year: 2026, image: "obras/01-mi-obra.jpg", description: "Una breve descripción." }
   ```

3. Asigná el mismo número `prompt` y el mismo `title` a las siete obras que correspondan a una consigna. La página las agrupa automáticamente bajo ese título; podés escribir el nombre definitivo en `title`.
4. Reemplazá `Artista 01` a `Artista 07` en `artistNames` de `app.js` con los nombres que quieran mostrar. Las imágenes abstractas, artistas y títulos de consigna actuales son muestras ficticias.

Los marcos usan una proporción vertical 4:5 y muestran la imagen completa, incluso si una obra tiene otra proporción. Las imágenes de muestra se crean en el momento y no se guardan como archivos; `obras/` está lista para recibir las piezas definitivas.
