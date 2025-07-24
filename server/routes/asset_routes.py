from flask import Blueprint


asset_bp = Blueprint('asset', __name__)

@asset_bp.route('/api/asset/<ticker>')
def home():
    return "Welcome to TD's professional FLask app!"
