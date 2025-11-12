from flask import Blueprint, request, jsonify, session
from database.models import User
from database import SessionLocal
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint("auth", __name__)
db = SessionLocal()

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if db.query(User).filter_by(username=data["username"]).first():
        return jsonify({"error": "Username already exists"}), 400

    user = User(
        username=data["username"],
        password_hash=generate_password_hash(data["password"])
    )
    db.add(user)
    db.commit()
    return jsonify({"message": "User registered successfully!"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = db.query(User).filter_by(username=data["username"]).first()
    if not user or not check_password_hash(user.password_hash, data["password"]):
        return jsonify({"error": "Invalid username or password"}), 401

    session["user_id"] = user.id
    return jsonify({"message": "Login successful!", "user_id": user.id})