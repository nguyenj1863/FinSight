import csv
from flask import Blueprint, request, jsonify
from io import StringIO
from datetime import datetime
from werkzeug.utils import secure_filename
from sqlalchemy import func
from extensions import db
from models.models import Portfolio, Transaction, Asset
from services.analytics import get_sector_breakdown

portfolio_bp = Blueprint('portfolio_bp', __name__)

# Returns all Portfolios
@portfolio_bp.route('/', methods=['GET'])
def get_all_portfolios():
    portfolios = Portfolio.query.all()
    result = []
    for p in portfolios:
        result.append({"id": p.id, "name": p.name, "user_id": p.user_id})
    return jsonify(result)

# Creates a Portfolio
@portfolio_bp.route('/create', methods=['POST'])
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
@portfolio_bp.route('/<int:portfolio_id>/add_asset', methods=['POST'])
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

# Upload CSV file
@portfolio_bp.route('/<int:portfolio_id>/upload', methods=['POST'])
def upload_transactions(portfolio_id):
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    stream = StringIO(file.stream.read().decode("UTF-8"), newline=None)
    reader = csv.DictReader(stream)

    for row in reader:
        ticker = row['tickler'].strip().upper()
        quantity = float(row['quantity'])
        price = float(row['price'])
        date = datetime.strptime(row['date'], '%Y-%m-%d').date()

        # Get or create asset
        asset = Asset.query.filter_by(ticker=ticker).first()
        if not asset:
            asset = Asset(ticker=ticker)
            db.session.add(asset)
            db.session.commit()
        
        # Create transaction
        tx = Transaction(
            portfolio_id=portfolio_id,
            asset_id=asset.id,
            quantity=quantity,
            price=price,
            date=date
        )
        db.session.add(tx)
    
    db.session.commit()
    return jsonify({'message': 'Transactions imported successfully'})

# Breakdown of portfolio
@portfolio_bp.route('/<int:portfolio_id>/breakdown', methods=['GET'])
def get_sector_allocation(portfolio_id):
    try:
        data = get_sector_breakdown(portfolio_id)
        return jsonify({"portfolio_id": portfolio_id, "sector_allocation": data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Returns all transactions in a porfolio
@portfolio_bp.route('/<int:portfolio_id>/transactions', methods=['GET'])
def get_portfolio_transactions(portfolio_id):
    try:
        transactions = (
            db.session.query(Transaction, Asset)
            .join(Asset, Transaction.asset_id == Asset.id)
            .filter(Transaction.portfolio_id == portfolio_id)
            .all()
        )

        result = [
            {
                "ticker": asset.ticker,
                "name": asset.name,
                "sector": asset.sector,
                "quantity": float(tx.quantity),
                "price": float(tx.price),
                "date": tx.date.strftime('%Y-%m-%d')
            }
            for tx, asset in transactions
        ]
        return jsonify({"portfolio_id": portfolio_id, "transactions": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500