from flask import Blueprint, request, jsonify
from models.models import Portfolio, Transaction, Asset
from extensions import db

portfolio_bp = Blueprint('portfolio_bp', __name__)

# Returns all Portfolios
@portfolio_bp.route('/api/portfolio/', methods=['GET'])
def get_all_portfolios():
    portfolios = Portfolio.query.all()
    result = []
    for p in portfolios:
        result.append({"id": p.id, "name": p.name, "user_id": p.user_id})
    return jsonify(result)

# Creates a Portfolio
@portfolio_bp.route('/api/portfolio/create', methods=['POST'])
def create_portfolio():
    data = request.get_json()
    name = data.get('name')
    user_id = data.get('user_id')

    if not name or not user_id:
        return jsonify({"error": "Missing fields"}), 400
    
    new_portfolio = Portfolio(name=name, user_id=user_id)
    db.session.add(new_portfolio)
    db.session.commit()
    return jsonify({"message": "Portfolio created", "id": new_portfolio.id})

# Adds an Asset to a Portfolio
@portfolio_bp.route('/api/portfolio/<int:portfolio_id>/add_asset', methods=['POST'])
def add_asset_to_portfolio(portfolio_id):
    data = request.get_json()
    ticker = data.get('ticker')
    quantity = data.get('quantity')
    price = data.get('price')
    date = data.get('date')

    asset = Asset.query.filter_by(ticker=ticker).first()
    if not asset:
        asset = Asset(ticker=ticker)
        db.session.add(asset)
        db.session.commit()

    new_tx = Transaction(
        portfolio_id=portfolio_id,
        asset_id=asset.id,
        quantity=quantity,
        price=price,
        date=date
    )
    db.session.add(new_tx)
    db.session.commit()
    return jsonify({"message": "Asset added to portfolio"})