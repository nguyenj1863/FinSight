from sqlalchemy import func
from models.models import Portfolio, Transaction, Asset
from extensions import db

def get_sector_breakdown(portfolio_id):
    results = (
        db.session.query(Asset.sector, func.sum(Transaction.quantity * Transaction.price))
        .join(Transaction, Transaction.asset_id == Asset.id)
        .filter(Transaction.portfolio_id == portfolio_id)
        .group_by(Asset.sector)
        .all()
    )

    return {sector or "Unknown": float(total) for sector, total in results}

def calculate_portfolio_metrics(portfolio_id):
    transactions = (
        db.session.query(Transaction, Asset)
        .join(Asset, Transaction.asset_id == Asset.id)
        .filter(Transaction.portfolio_id == portfolio_id)
        .all()
    )

    holdings = {}
    total_value = 0.0

    for tx, asset in transactions:
        if asset.ticker not in holdings:
            holdings[asset.ticker] = {
                "ticker": asset.ticker,
                "name": asset.name,
                "sector": asset.sector,
                "quantity": 0,
                "invested": 0.0,
            }

        holdings[asset.ticker]["quantity"] += tx.quantity
        holdings[asset.ticker]["invested"] += tx.quantity * tx.price
        total_value += tx.quantity * tx.price

    return {
        "total_invested": round(total_value, 2),
        "holdings": list(holdings.values())
    }
