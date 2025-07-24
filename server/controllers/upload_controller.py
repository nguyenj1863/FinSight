from flask import Blueprint, request, jsonify
import csv
import io
from extensions import db
from models.models import Asset, Transaction
from datetime import datetime

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/<int:portfolio_id>", methods=["POST"])
def upload_transactions(portfolio_id):
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if not file.filename.endswith(".csv"):
        return jsonify({"error": "Invalid file type"}), 400

    stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
    reader = csv.DictReader(stream)

    for row in reader:
        try:
            ticker = row["ticker"].strip().upper()
            name = row.get("name", "").strip()
            sector = row.get("sector", "").strip()
            quantity = int(row["quantity"])
            price = float(row["price"])
            date = datetime.strptime(row["date"], "%Y-%m-%d").date()

            # Find or create asset
            asset = Asset.query.filter_by(ticker=ticker).first()
            if not asset:
                asset = Asset(ticker=ticker, name=name, sector=sector)
                db.session.add(asset)
                db.session.flush()  # Assigns asset.id before committing

            # Create transaction
            transaction = Transaction(
                portfolio_id=portfolio_id,
                asset_id=asset.id,
                quantity=quantity,
                price=price,
                date=date
            )
            db.session.add(transaction)
        
        except Exception as e:
            return jsonify({"error": f"Error processing row: {row}. Reason: {str(e)}"}), 400

    db.session.commit()
    return jsonify({"message": "Transactions uploaded successfully"}), 201
