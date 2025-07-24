from flask import Flask
from flask_cors import CORS
from controllers.analytics_controller import analytics_bp
from controllers.asset_controller import asset_bp
from controllers.portfolio_controller import portfolio_bp
from controllers.upload_controller import upload_bp
from controllers.performance_controller import performance_bp
from controllers.metrics_controller import metrics_bp
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
    app.register_blueprint(metrics_bp, url_prefix='/api/portfolio')
    app.register_blueprint(upload_bp, url_prefix='/api/upload')
    app.register_blueprint(performance_bp, url_prefix="/api/performance")

    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)