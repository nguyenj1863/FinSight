from flask import Blueprint, request, jsonify
from models.models import Portfolio, Transaction, Asset
from extensions import db
from datetime import datetime
import numpy as np

analytics_bp = Blueprint('analytics_bp', __name__)

# @analytics_bp.route('/api/analytics/sharpe/<int:portfolio_id>', methods=['GET'])
# def calculate_sharpe_ratio(portfolio_id):
#     try:
#         transactions = Transaction.query.filter_by(portfolio_id=portfolio_id).all()
#         if not transactions:
#             return jsonify({"error": "No transactions found for this portfolio"}), 404
        
