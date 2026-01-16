"""
Simple Python backend server that proxies requests to OpenAI API
This avoids CORS issues by handling API calls server-side
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import os
from urllib.request import Request, urlopen
from urllib.error import URLError
import sys

class ProxyHandler(BaseHTTPRequestHandler):
    """HTTP request handler that proxies to OpenAI API"""
    
    def do_GET(self):
        """Handle GET requests - serve static files"""
        if self.path == '/':
            self.path = '/index.html'
        
        # Remove query parameters
        if '?' in self.path:
            self.path = self.path.split('?')[0]
        
        # Serve static files
        try:
            content_type = 'application/octet-stream'
            
            if self.path.endswith('.html'):
                content_type = 'text/html'
            elif self.path.endswith('.js'):
                content_type = 'application/javascript'
            elif self.path.endswith('.json'):
                content_type = 'application/json'
            elif self.path.endswith('.env'):
                content_type = 'text/plain'
            elif self.path.endswith('.css'):
                content_type = 'text/css'
            else:
                self.send_response(404)
                self.end_headers()
                return
            
            with open('.' + self.path, 'rb') as f:
                content = f.read()
                try:
                    self.send_response(200)
                    self.send_header('Content-type', content_type)
                    self.send_header('Content-Length', len(content))
                    self.end_headers()
                    self.wfile.write(content)
                except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
                    # Client disconnected, ignore
                    pass
        except FileNotFoundError:
            try:
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'File not found'}).encode())
            except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
                pass
        except Exception as e:
            try:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
            except:
                pass
    
    def do_POST(self):
        """Handle POST requests - proxy to OpenAI API"""
        if self.path == '/api/generate-scene':
            try:
                # Read the request body
                content_length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(content_length)
                request_data = json.loads(body.decode('utf-8'))
                
                # Load API key from .env file
                api_key = self._load_api_key()
                if not api_key:
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': 'API key not found in .env file'}).encode())
                    return
                
                # Prepare the OpenAI API request
                openai_request_data = request_data['data']
                openai_url = 'https://api.openai.com/v1/chat/completions'
                
                openai_request = Request(
                    openai_url,
                    data=json.dumps(openai_request_data).encode('utf-8'),
                    headers={
                        'Authorization': f'Bearer {api_key}',
                        'Content-Type': 'application/json'
                    },
                    method='POST'
                )
                
                # Call OpenAI API
                try:
                    with urlopen(openai_request, timeout=60) as response:
                        response_data = json.loads(response.read().decode('utf-8'))
                        
                        # Send response back to client
                        self.send_response(200)
                        self.send_header('Content-type', 'application/json')
                        self.send_header('Access-Control-Allow-Origin', '*')
                        self.end_headers()
                        self.wfile.write(json.dumps(response_data).encode())
                
                except URLError as e:
                    # Extract detailed error from OpenAI
                    error_body = None
                    error_code = 500
                    
                    if hasattr(e, 'read'):
                        error_body = e.read().decode('utf-8')
                        try:
                            error_json = json.loads(error_body)
                            print(f"OpenAI Error: {error_json}", file=sys.stderr)
                        except:
                            print(f"OpenAI Error: {error_body}", file=sys.stderr)
                    
                    if hasattr(e, 'code'):
                        error_code = e.code
                    
                    # Return the actual API error details
                    error_response = {
                        'error': str(e),
                        'type': 'openai_api_error'
                    }
                    
                    if error_body:
                        try:
                            error_response['details'] = json.loads(error_body)
                        except:
                            error_response['details'] = error_body
                    
                    self.send_response(error_code if error_code >= 400 else 500)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps(error_response).encode())
            
            except json.JSONDecodeError:
                try:
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': 'Invalid JSON in request'}).encode())
                except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
                    pass
            
            except Exception as e:
                try:
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': str(e)}).encode())
                except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
                    pass
        else:
            try:
                self.send_response(404)
                self.end_headers()
            except:
                pass
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def _load_api_key(self):
        """Load API key from .env file"""
        try:
            with open('.env', 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#'):
                        if '=' in line:
                            key, value = line.split('=', 1)
                            if key.strip() == 'OPENAI_API_KEY':
                                return value.strip().strip('"').strip("'")
        except FileNotFoundError:
            print("Warning: .env file not found")
        return None
    
    def log_message(self, format, *args):
        """Custom logging"""
        print(f"[{self.client_address[0]}] {format % args}")


def run_server(port=8000):
    """Start the proxy server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, ProxyHandler)
    
    print(f"🚀 Server running at http://localhost:{port}")
    print(f"📁 Serving files from: {os.getcwd()}")
    print(f"🔌 API proxy active at http://localhost:{port}/api/generate-scene")
    print(f"📝 Make sure you have OPENAI_API_KEY in your .env file")
    print("\nPress Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n✓ Server stopped")
        sys.exit(0)


if __name__ == '__main__':
    port = 8000
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    run_server(port)
