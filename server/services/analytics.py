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