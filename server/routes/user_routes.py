from flask import Blueprint, request, jsonify
from models.models import User
from extensions import db

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{'id': u.id, 'username': u.username} for u in users])

@user_bp.route('/create', methods=['POST'])
def create_user():
    data = request.get_json()
    username = data.get('username')

    if not username:
        return jsonify({'error': 'Username is required'}), 400
    
    user = User(username=username)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User created', 'id': user.id})