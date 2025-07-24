from flask import Flask
from flask_cors import CORS
from routes.analytics_routes import analytics_bp
from routes.asset_routes import asset_bp
from routes.portfolio_routes import portfolio_bp
from routes.user_routes import user_bp
from routes.upload_routes import upload_bp
from extensions import db
import os

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL", "sqlite:///finsight.db")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    app.register_blueprint(asset_bp, url_prefix='/api/assets')
    app.register_blueprint(portfolio_bp, url_prefix='/api/portfolio')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(upload_bp, url_prefix='/api/upload')

    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)