import yfinance as yf
from flask import Blueprint, jsonify
from models.models import Transaction, Asset
from extensions import db
from datetime import datetime

metrics_bp = Blueprint('metrics', __name__)

@metrics_bp.route('/<int:portfolio_id>/cagr', methods=['GET'])
def calculate_cagr(portfolio_id):
    transactions = (
        db.session.query(Transaction, Asset)
        .join(Asset, Transaction.asset_id == Asset.id)
        .filter(Transaction.portfolio_id == portfolio_id)
        .order_by(Transaction.date.asc())
        .all()
    )

    if not transactions:
        return jsonify({"error": "No transactions found"}), 404

    start_date = transactions[0][0].date
    end_date = datetime.today().date()

    total_invested = 0
    current_value = 0
    holdings = {}

    for tx, asset in transactions:
        total_invested += tx.price * tx.quantity
        ticker = asset.ticker.upper()
        holdings[ticker] = holdings.get(ticker, 0) + tx.quantity

    tickers = list(holdings.keys())

    # Fetch live prices
    try:
        tickers = list(holdings.keys())
        data = yf.download(tickers=tickers, period="1d", group_by='ticker', auto_adjust=False, progress=False)
        
        for ticker in tickers:
            # Use .get() to safely access nested MultiIndex columns
            if (ticker, "Close") in data.columns:
                live_price = data[(ticker, "Close")].iloc[-1]
                current_value += live_price * holdings[ticker]
            else:
                return jsonify({"error": f"Missing Close price for {ticker}"}), 500
    except Exception as e:
        return jsonify({"error": f"Failed to fetch live prices: {str(e)}"}), 500


    years = (end_date - start_date).days / 365.25
    if years == 0 or total_invested == 0:
        return jsonify({"cagr": 0})

    cagr = (current_value / total_invested) ** (1 / years) - 1

    return jsonify({
        "cagr": round(cagr * 100, 2),
        "years": round(years, 2),
        "total_invested": round(total_invested, 2),
        "portfolio_value": round(current_value, 2)
    })