import sqlite3
import logging
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configure basic logging
logging.basicConfig(level=logging.INFO)
app.logger.setLevel(logging.INFO)

def get_db_connection():
    # Thay 'data.db' bằng tên file database của bạn
    conn = sqlite3.connect('data.db')
    conn.row_factory = sqlite3.Row # Để lấy dữ liệu dạng từ điển (key-value)
    return conn

@app.route('/api/data', methods=['GET'])
def get_data():
    conn = None
    try:
        conn = get_db_connection()
        # Thay 'ten_bang' bằng tên bảng bạn đã import từ CSV
        rows = conn.execute('SELECT * FROM drug_data_mixed').fetchall()

        # Chuyển đổi dữ liệu sang dạng list of dicts
        result = [dict(row) for row in rows]
        return jsonify(result)
    except Exception as e:
        app.logger.exception('Error in /api/data')
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    # Listen on all interfaces so other devices (or container host) can reach it
    app.run(host='0.0.0.0', debug=True, port=5000)