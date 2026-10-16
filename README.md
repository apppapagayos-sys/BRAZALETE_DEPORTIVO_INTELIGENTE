# Brazalete Deportivo Inteligente — Beta visual

Demo web responsive para mostrar cómo podría verse la plataforma del proyecto escolar.

## Incluye
- Indicadores de pulso, SpO₂ y temperatura corporal.
- Datos ambientales: temperatura, humedad, altitud y presión.
- Gráficos históricos interactivos con selección de rango.
- Valores simulados que se actualizan automáticamente.
- Diseño adaptable a computadora y celular.

## Importante
Esta versión es una **demo visual**. Todos los valores son simulados; no se conecta a sensores ni representa mediciones reales. La temperatura corporal, altitud y presión son campos de ejemplo para la futura plataforma.

## Publicar en GitHub Pages
1. Crea un repositorio público en GitHub, por ejemplo `brazalete-deportivo-inteligente`.
2. Sube `index.html`, `styles.css`, `app.js` y `README.md` a la raíz del repositorio.
3. En GitHub, entra a **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Selecciona la rama `main` y la carpeta `/ (root)`, y guarda.
6. Espera a que GitHub genere la URL pública. Puedes usar esa URL para crear el QR del stand.

## Ejecutar localmente
Abre `index.html` en un navegador moderno. Se necesita conexión a internet para cargar Chart.js desde CDN y las fuentes web. Para trabajar completamente sin internet, habría que guardar esas dependencias localmente.

## Próximo paso
Cuando el prototipo físico esté listo, reemplazar la simulación de `app.js` por una fuente de datos real. GitHub Pages sirve archivos estáticos; no aloja por sí solo un servidor Node.js que reciba directamente las solicitudes de los ESP32.
