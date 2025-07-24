from flask import Flask
from flask_cors import CORS
from routes.analytics_routes import analytics_bp
from routes.asset_routes import asset_bp
from routes.portfolio_routes import portfolio_bp
from extensions import db
import os

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL", "sqlite:///finsight.db")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    app.register_blueprint(analytics_bp)
    app.register_blueprint(asset_bp)
    app.register_blueprint(portfolio_bp)

    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)