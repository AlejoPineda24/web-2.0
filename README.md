# Dulce Pecado — Flask

## Cómo correrlo

```bash
python -m venv venv
# Windows: venv\Scripts\activate
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

Abre http://localhost:5000

## Port forwarding en VS Code (compartir la web)

1. Corre `python app.py` (debe quedar escuchando en el puerto **5000**).
2. En VS Code abre el panel inferior y haz click en la pestaña **PORTS** (al lado de TERMINAL). Si no la ves: `View → Open View… → Ports`.
3. Click en **Forward a Port** (o el ícono **+**) y escribe `5000`. Enter.
4. VS Code te genera una URL pública tipo `https://xxxx-5000.devtunnels.ms` — esa es la que compartís.
5. Por defecto la URL es **privada** (requiere login con tu cuenta Microsoft/GitHub). Para que cualquiera entre:
   - Click derecho sobre la fila del puerto → **Port Visibility → Public**.
6. Para apagarlo: click derecho → **Stop Forwarding Port**.

> Tip: si querés que el túnel siga activo aunque cierres VS Code, instalá el CLI `devtunnel` de Microsoft y usá `devtunnel host -p 5000 --allow-anonymous`.

## Estructura

```
app.py
requirements.txt
templates/index.html
static/css/styles.css
static/js/main.js
static/img/{logo,mascota,product-bags,product-closeup}.*
```

Cambia `WHATSAPP_NUMBER` en `app.py` por tu número real (formato internacional sin `+`).
