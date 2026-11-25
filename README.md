# México en datos - Mapa Interactivo

## Descripción

Este proyecto consiste en una aplicación web que permite visualizar y comparar la distribución de la población de las 32 entidades federativas de México, utilizando información de los censos de población de 2010 y 2020 del INEGI.

La aplicación utiliza un mapa coroplético interactivo que representa la cantidad de habitantes mediante una escala de colores. Asimismo, permite consultar la ubicación geográfica de diferentes universidades del país.

El objetivo es facilitar la consulta, interpretación y comparación de información demográfica mediante una representación geográfica, dinámica e interactiva.

## Funcionalidades

- Visualización de las 32 entidades federativas de México.
- Selección del año del censo mediante un selector.
- Representación de la población mediante una escala de cinco colores.
- Visualización de información al pasar el cursor sobre una entidad.
- Consulta detallada de la población al seleccionar un estado.
- Comparación de la población entre los censos de 2010 y 2020.
- Cálculo del porcentaje de crecimiento poblacional.
- Búsqueda de entidades federativas por nombre.
- Visualización de universidades mediante marcadores geográficos.
- Agrupación de universidades cercanas.
- Activación y desactivación de la capa de universidades.
- Actualización dinámica de la leyenda de población.
- Visualización de estadísticas demográficas nacionales.
- Restablecimiento de la vista original del mapa.
- Diseño adaptable a diferentes tamaños de pantalla.

## Indicadores disponibles

- Población total por entidad federativa (2010).
- Población total por entidad federativa (2020).
- Población total nacional.
- Entidad federativa más poblada.
- Entidad federativa menos poblada.
- Variación porcentual de la población entre 2010 y 2020.

## Tecnologías utilizadas

- **HTML5:** estructura y organización de la página web.
- **CSS3:** diseño, estilos visuales y adaptación a diferentes dispositivos.
- **JavaScript:** procesamiento de datos, funcionalidades e interacción del mapa.
- **Leaflet:** creación y visualización del mapa interactivo.
- **GeoJSON:** representación de los límites geográficos de las entidades federativas.
- **JSON:** almacenamiento de información demográfica y ubicaciones universitarias.
- **Leaflet MarkerCluster:** agrupación de marcadores geográficos cercanos.
- **OpenStreetMap:** proveedor del mapa base.
- **Google Fonts:** implementación de tipografías para la interfaz.

## Fuentes de información

- INEGI: Censos de Población y Vivienda de 2010 y 2020.
- GeoJSON: información geográfica de las entidades federativas obtenida desde un repositorio externo de GitHub.
- OpenStreetMap: información cartográfica del mapa base.
- Muestra ilustrativa de ocho universidades ubicadas en diferentes entidades del país.

## Estructura del proyecto

```
mapa-mexico-interactivo/
│
├── index.html
├── styles.css
├── script.js
│
└── data/
    ├── indicadores.json
    └── lugares.json
```

## Descripción de los archivos

| Archivo | Descripción |
|---|---|
| index.html | Contiene la estructura principal de la aplicación web. |
| styles.css | Define el diseño, los colores y los estilos de la interfaz. |
| script.js | Gestiona el mapa, los indicadores, las estadísticas y la interactividad. |
| indicadores.json | Almacena los datos poblacionales de las 32 entidades federativas. |
| lugares.json | Contiene los nombres, ubicaciones y coordenadas de las universidades. |

## Visualización del proyecto



## Ejecución local

1. Descargar o clonar el repositorio.
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Instalar la extensión Live Server, en caso de no tenerla.
4. Ejecutar el archivo `index.html` utilizando Live Server.
5. Seleccionar el año del censo que se desea consultar.
6. Explorar el mapa, las estadísticas poblacionales y la ubicación de las universidades.

**Nota:** Se requiere conexión a Internet para cargar las bibliotecas externas, el mapa base y las geometrías de las entidades federativas.

## Hallazgos

Mediante la visualización del mapa se puede identificar que la población de México no se distribuye de manera uniforme. Entidades como el Estado de México, Ciudad de México, Jalisco y Veracruz presentan una mayor concentración poblacional, mientras que Colima, Baja California Sur y Campeche registran una menor cantidad de habitantes.

La comparación entre los censos de 2010 y 2020 permite identificar los cambios demográficos de cada entidad federativa.

## Integrantes

- Edwin Uriel Yepez Lopez
- Alexia Estefania Jaime Martinez
- Yasmin Alejandra Martinez Torres 
