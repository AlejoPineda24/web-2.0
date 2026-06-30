from flask import Flask, render_template, Response, url_for, request, send_file
import qrcode
import io

app = Flask(__name__)

WHATSAPP_NUMBER = "573054230585"  # número de pedidos por WhatsApp

SIZES = [
    {"id": "mini",   "name": "Mini",   "weight": "50 g",  "price": "$6.000",  "price_num": 6000,  "desc": "Antojo express"},
    {"id": "medio",  "name": "Medio",  "weight": "100 g", "price": "$10.000", "price_num": 10000, "desc": "El clásico"},
    {"id": "grande", "name": "Grande", "weight": "150 g", "price": "$18.000", "price_num": 18000, "desc": "Para compartir (o no)"},
]

FLAVORS = [
    {"id": "chamoy",    "name": "Chamoy clásico",  "level": "Suave",   "emoji": "🌶️"},
    {"id": "mango",     "name": "Mango con chile", "level": "Medio",   "emoji": "🌶️🌶️"},
    {"id": "diablo",    "name": "Diablo rojo",     "level": "Intenso", "emoji": "🌶️🌶️🌶️"},
]

@app.route("/")
def index():
    return render_template(
        "index.html",
        sizes=SIZES,
        flavors=FLAVORS,
        whatsapp=WHATSAPP_NUMBER,
    )

@app.route("/qr.png")
def qr_code():
    target_url = request.url_root  # URL pública/local desde la que se sirve la web
    qr = qrcode.QRCode(border=2, box_size=10)
    qr.add_data(target_url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0D0D0D", back_color="#FFFFFF").convert("RGB")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return send_file(buf, mimetype="image/png")

@app.route("/robots.txt")
def robots():
    return Response("User-agent: *\nAllow: /\n", mimetype="text/plain")

@app.route("/sitemap.xml")
def sitemap():
    xml = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
</urlset>"""
    return Response(xml, mimetype="application/xml")

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
