from flask import Flask

app = Flask(__name__)

@app.route('/test')
def test():
    return {'status': 'ok'}

if __name__ == '__main__':
    print("Starting simple Flask test server...")
    app.run(debug=False, host='127.0.0.1', port=5001)
    print("Flask returned - THIS SHOULD NOT HAPPEN")
