# Локальный просмотр как на GitHub Pages: /vetnas/uzi -> dist/uzi.html
import http.server, os, sys
ROOT = os.path.join(os.path.dirname(__file__), "..", "serve")
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def send_head(self):
        p = self.translate_path(self.path.split("?")[0])
        if not os.path.exists(p) and os.path.exists(p + ".html"):
            self.path = self.path.split("?")[0] + ".html"
        return super().send_head()
http.server.ThreadingHTTPServer(("", int(sys.argv[1]) if len(sys.argv) > 1 else 8766), H).serve_forever()
