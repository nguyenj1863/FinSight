from flask import Blueprint, request, jsonify
import yfinance as yf

asset_bp = Blueprint('asset_bp', __name__)

@asset_bp.route('/api/asset/<string:ticker>', methods=['GET'])
def get_asset_data(ticker):
    try:
        stock = yf.Ticker(ticker)
        info = stock.info

        if not info or 'regularMarketPrice' not in info:
            return jsonify({"error": "Ticker not found or invalid"}), 404
        
        data = {
            "symbol": info.get("symbol"),
            "shortName": info.get("shortName"),
            "currentPrice": info.get("regularMarketPrice"),
            "dayHigh": info.get("dayHigh"),
            "dayLow": info.get("dayLow"),
            "marketCap": info.get("marketCap"),
            "previousClose": info.get("previousClose"),
            "volume": info.get("volume"),
            "currency": info.get("currency")
        }
        return jsonify(data)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500