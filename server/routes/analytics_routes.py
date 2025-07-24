from flask import Blueprint, request, jsonify


analytics_bp = Blueprint('analytics_bp', __name__)

@analytics_bp.route('/api/analytics')
def home():
    return "Welcome to TD's professional FLask app!"