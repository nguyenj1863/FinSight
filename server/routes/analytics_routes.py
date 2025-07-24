from flask import Blueprint


analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/api/analytics')
def home():
    return "Welcome to TD's professional FLask app!"