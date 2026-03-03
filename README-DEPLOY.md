# 🚀 GUÍA DE DEPLOY - TAD DOMINICANA WEB APP

**Tiempo estimado:** 15-20 minutos  
**Costo:** $0 (todo gratis)

---

## 📋 **REQUISITOS PREVIOS**

1. ✅ Tener cuenta de GitHub (gratis)
2. ✅ Tener cuenta de Google (para Sheets)
3. ✅ Código ya está en `TAD Dominicana/web-app/`

---

## 🔧 **PASO 1: CONFIGURAR GOOGLE SHEETS (5 min)**

### **1.1 Crear Google Sheet**

1. Ve a https://sheets.google.com
2. Click en **"+ Nueva hoja de cálculo"**
3. Nómbrala: `Registros TAD`

### **1.2 Crear Columnas**

En la fila 1, crea estos encabezados:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Fecha | Nombre | Apellido | Cédula | Teléfono | Marca | Año | Placa | Aplicación |

### **1.3 Abrir Apps Script**

1. En el Sheet: **Extensiones > Apps Script**
2. Se abrirá el editor de Apps Script

### **1.4 Pegar el Código**

1. Borra todo el código que aparece
2. Copia el contenido de `google-apps-script.js`
3. Pégalo en el editor
4. Click en **💾 Guardar** (ponle nombre: "TAD Form Handler")

### **1.5 Implementar como Web App**

1. Click en **"Implementar" > "Nueva implementación"**
2. Tipo: **Aplicación web**
3. Configuración:
   - **Descripción:** TAD Form Handler v1
   - **Ejecutar como:** Yo (tu email)
   - **Quién tiene acceso:** **Cualquier persona** ⚠️ (importante)
4. Click en **"Implementar"**
5. **Autoriza** los permisos (Google te pedirá permiso)
6. **Copia la URL** que te da (se ve así: `https://script.google.com/macros/s/....../exec`)

### **1.6 Actualizar el Frontend**

1. Abre `TAD Dominicana/web-app/app.jsx`
2. Busca esta línea (aproximadamente línea 268):
```javascript
const scriptURL = "TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI";
```
3. Reemplaza con tu URL real:
```javascript
const scriptURL = "https://script.google.com/macros/s/XXXXXX/exec";
```
4. Guarda el archivo

---

## 🚀 **PASO 2: DEPLOY EN VERCEL (10 min)**

### **2.1 Crear Proyecto en GitHub**

1. Ve a https://github.com
2. Click en **"+ New repository"**
3. Nombre: `tad-dominicana-web`
4. **Público** o Privado (como prefieras)
5. Click en **"Create repository"**

### **2.2 Subir el Código**

**Opción A: Desde la terminal (recomendado)**

```bash
# Navega al workspace
cd /root/.openclaw/workspace/TAD\ Dominicana/web-app/

# Inicializa git
git init
git add .
git commit -m "Initial commit - TAD Web App"

# Conecta con GitHub (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/tad-dominicana-web.git
git branch -M main
git push -u origin main
```

**Opción B: Upload manual**

1. En GitHub: **"uploading an existing file"**
2. Arrastra `app.jsx` y los otros archivos
3. Click en **"Commit changes"**

### **2.3 Conectar con Vercel**

1. Ve a https://vercel.com
2. **Sign up** con tu cuenta de GitHub
3. Click en **"Add New Project"**
4. Selecciona el repositorio `tad-dominicana-web`
5. Click en **"Import"**

### **2.4 Configurar Build**

**IMPORTANTE:** Esta app es React puro, necesita un setup especial.

1. **Framework Preset:** Selecciona **Vite** o **Create React App**
2. **Root Directory:** Déjalo en `./`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`

### **2.5 Necesitas crear package.json**

Crea un archivo `package.json` en la carpeta `web-app/`:

```json
{
  "name": "tad-dominicana-web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.3.9"
  }
}
```

### **2.6 Configurar Vite**

Crea `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
})
```

### **2.7 Crear index.html**

Crea `index.html` en la raíz:

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TAD Dominicana - Tu Vehículo, Tu Valla Digital</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/app.jsx"></script>
  </body>
</html>
```

### **2.8 Hacer Push y Deploy**

```bash
git add package.json vite.config.js index.html
git commit -m "Add Vite config files"
git push
```

Vercel detectará los cambios y hará deploy automáticamente.

### **2.9 ¡LISTO!**

Vercel te dará una URL como:
```
https://tad-dominicana-web.vercel.app
```

---

## ✅ **VERIFICACIÓN**

### **Test del Formulario**

1. Abre tu URL de Vercel
2. Click en **"Comenzar a Ganar"**
3. Llena los 3 pasos del formulario
4. Al finalizar, debería:
   - ✅ Guardar en Google Sheets
   - ✅ Redirigir a WhatsApp

### **Verificar Google Sheets**

1. Abre tu Google Sheet
2. Deberías ver una nueva fila con los datos del registro

---

## 🔧 **SOLUCIÓN DE PROBLEMAS**

### **Error: "CORS"**

**Solución:** Asegúrate de que en `doPost` el acceso sea "Cualquier persona"

### **Error: "404 Not Found"**

**Solución:** Verifica que la URL de Apps Script termine en `/exec` no `/edit`

### **Error: Build falla en Vercel**

**Solución:** 
```bash
# Ejecuta localmente para test
npm install
npm run dev
```

---

## 📞 **SOPORTE**

Si tienes problemas:

1. Revisa los logs de Vercel: **Dashboard > Project > Deployments > View logs**
2. Revisa Apps Script: **Extensiones > Apps Script > Ejecuciones**

---

*¡Tu web app estará en línea en 20 minutos!* 🚀
