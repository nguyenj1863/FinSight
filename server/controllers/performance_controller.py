from flask import Blueprint, jsonify
from models.models import Portfolio, Transaction, Asset
from extensions import db
from services.prices_service import get_live_price

performance_bp = Blueprint("performance_bp", __name__)

@performance_bp.route("/<int:portfolio_id>/performance", methods=["GET"])
def get_portfolio_performance(portfolio_id):
    try:
        transactions = (
            db.session.query(Transaction, Asset)
            .join(Asset, Transaction.asset_id == Asset.id)
            .filter(Transaction.portfolio_id == portfolio_id)
            .all()
        )

        holdings = {}
        for tx, asset in transactions:
            ticker = asset.ticker
            if ticker not in holdings:
                holdings[ticker] = {"quantity": 0, "cost_basis": 0, "name": asset.name}
            holdings[ticker]["quantity"] += tx.quantity
            holdings[ticker]["cost_basis"] += tx.quantity * tx.price

        results = []
        total_value = total_cost = 0

        for ticker, info in holdings.items():
            current_price = get_live_price(ticker)
            if current_price is None:
                continue

            market_value = current_price * info["quantity"]
            gain_loss = market_value - info["cost_basis"]

            results.append({
                "ticker": ticker,
                "name": info["name"],
                "quantity": info["quantity"],
                "avg_cost": round(info["cost_basis"] / info["quantity"], 2),
                "current_price": round(current_price, 2),
                "market_value": round(market_value, 2),
                "gain_loss": round(gain_loss, 2)
            })

            total_value += market_value
            total_cost += info["cost_basis"]

        return jsonify({
            "portfolio_id": portfolio_id,
            "summary": {
                "total_cost": round(total_cost, 2),
                "total_value": round(total_value, 2),
                "total_gain_loss": round(total_value - total_cost, 2)
            },
            "holdings": results
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
