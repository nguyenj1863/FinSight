from flask import Blueprint, request, jsonify
from models.models import Portfolio, Transaction, Asset
from extensions import db
from datetime import datetime
import numpy as np

analytics_bp = Blueprint('analytics_bp', __name__)

@analytics_bp.route('/sharpe/<int:portfolio_id>', methods=['GET'])
def calculate_sharpe_ratio(portfolio_id):
    try:
        transactions = Transaction.query.filter_by(portfolio_id=portfolio_id).all()
        if not transactions:
            return jsonify({"error": "No transactions found for this portfolio"}), 404
        
        # Simulate daily returns for 30 days (dummy example)
        simulated_returns = np.random.normal(loc=0.001, scale=0.02, size=30) # Mean 0.1%, stddev 2%
        avg_return = np.mean(simulated_returns)
        std_dev = np.std(simulated_returns)
        risky_free_rate = 0.0001 # Daily risk-free rate (~2.5 % annualized)

        sharpe_ratio = (avg_return - risky_free_rate) / std_dev if std_dev != 0 else 0.0
        
        return jsonify({
            "portfolio_id": portfolio_id,
            "avg_daily_return": round(avg_return, 5),
            "std_dev": round(std_dev, 5),
            "sharpe_ratio": round(sharpe_ratio, 4)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        