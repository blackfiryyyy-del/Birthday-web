import http.server
import json
import os
import sys
import urllib.parse
from datetime import datetime, timezone

PORT = int(os.environ.get('PORT', 3000))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.join(BASE_DIR, 'public')
DB = os.path.join(BASE_DIR, 'data', 'wishes.json')

MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.mp3': 'audio/mpeg',
    '.ogg': 'audio/ogg',
    '.svg': 'image/svg+xml',
    '.json': 'application/json; charset=utf-8',
    '.ico': 'image/x-icon'
}

def read_db():
    try:
        with open(DB, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []

def write_db(data):
    try:
        os.makedirs(os.path.dirname(DB), exist_ok=True)
        with open(DB, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=1)
    except Exception as e:
        sys.stderr.write(f"Error saving wishes: {e}\n")

class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        url_path = self.path.split('?')[0]
        if url_path == '/api/wishes':
            data = read_db()
            body = json.dumps(data).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        rel_path = 'index.html' if url_path in ('/', '') else url_path.lstrip('/')
        rel_path = urllib.parse.unquote(rel_path)
        full_path = os.path.normpath(os.path.join(PUB, rel_path))

        pub_norm = os.path.normpath(PUB)
        if not full_path.startswith(pub_norm):
            self.send_response(403)
            self.end_headers()
            self.wfile.write(b'Forbidden')
            return

        if not os.path.isfile(full_path):
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not found')
            return

        ext = os.path.splitext(full_path)[1].lower()
        content_type = MIME_TYPES.get(ext, 'application/octet-stream')

        try:
            with open(full_path, 'rb') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        except Exception:
            self.send_response(500)
            self.end_headers()

    def do_POST(self):
        url_path = self.path.split('?')[0]
        if url_path == '/api/wishes':
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                if content_length > 5000:
                    self.send_response(400)
                    self.end_headers()
                    return
                body_bytes = self.rfile.read(content_length)
                j = json.loads(body_bytes.decode('utf-8'))
                name = str(j.get('name') or 'Friend')[:40]
                text = str(j.get('text') or '')[:400]
                if not text.strip():
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(b'{"error":"empty"}')
                    return
                all_wishes = read_db()
                all_wishes.append({
                    'name': name,
                    'text': text,
                    'at': datetime.now(timezone.utc).isoformat()
                })
                write_db(all_wishes[-200:])
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"ok":true}')
            except Exception:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"error":"bad"}')
            return

        self.send_response(404)
        self.end_headers()

    def log_message(self, format, *args):
        # Clean logging
        sys.stderr.write(f"[{self.log_date_time_string()}] {format % args}\n")

if __name__ == '__main__':
    try:
        if sys.stdout.encoding.lower() != 'utf-8':
            sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass
    # Listen on all interfaces (0.0.0.0) so localhost / 127.0.0.1 both work
    server = http.server.ThreadingHTTPServer(('0.0.0.0', PORT), Handler)
    print(f"Birthday server running: http://localhost:{PORT}")
    sys.stdout.flush()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
