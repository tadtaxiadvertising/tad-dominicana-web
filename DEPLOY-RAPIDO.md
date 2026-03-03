# 🚀 DEPLOY RÁPIDO - TAD DOMINICANA

**URL de Google Apps Script:** ✅ Configurada  
**Tiempo estimado:** 10 minutos

---

## 📋 **PASOS PARA DEPLOY**

### **Paso 1: Crear Repositorio en GitHub (3 min)**

1. Ve a https://github.com/new
2. Nombre: `tad-dominicana-web`
3. Público o Privado (como prefieras)
4. **NO** marques "Add README"
5. Click en **"Create repository"**

### **Paso 2: Subir Archivos (3 min)**

En tu terminal:

```bash
cd /root/.openclaw/workspace/TAD\ Dominicana/web-app/

# Inicializar git
git init
git add .
git commit -m "TAD Web App - Initial commit"

# Conectar con GitHub (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/tad-dominicana-web.git
git branch -M main
git push -u origin main
```

**Opción manual (sin terminal):**
1. En GitHub: "uploading an existing file"
2. Arrastra estos 5 archivos:
   - `app.jsx`
   - `package.json`
   - `vite.config.js`
   - `index.html`
   - `README-DEPLOY.md`
3. Click "Commit changes"

### **Paso 3: Conectar con Vercel (3 min)**

1. Ve a https://vercel.com
2. Sign up con GitHub
3. "Add New Project"
4. Selecciona `tad-dominicana-web`
5. Click "Import"

### **Paso 4: Configurar Build (1 min)**

**Framework Preset:** Vite  
**Root Directory:** `./`  
**Build Command:** `npm run build`  
**Output Directory:** `dist`

Click en **"Deploy"**

### **Paso 5: ¡LISTO! (1 min)**

Vercel te dará una URL:
```
https://tad-dominicana-web.vercel.app
```

---

## ✅ **VERIFICACIÓN**

1. Abre la URL de Vercel
2. Click en "Comenzar a Ganar"
3. Llena el formulario
4. Al finalizar, verifica en tu Google Sheet

---

## 🎉 **URLs Importantes**

| Servicio | URL |
|----------|-----|
| **Web App** | https://tad-dominicana-web.vercel.app |
| **Google Sheet** | (tu sheet de registros) |
| **WhatsApp** | https://wa.me/18495043872 |

---

*¡Tu web app estará online en 10 minutos!* 🚀
