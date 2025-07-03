# models.py
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

class User(db.Model, UserMixin):
    id         = db.Column(db.Integer, primary_key=True)
    username   = db.Column(db.String(80), unique=True, nullable=False)
    email      = db.Column(db.String(120), unique=True, nullable=True)
    password   = db.Column(db.String(200), nullable=False)
    detections = db.relationship('Detection', backref='user', cascade='all, delete-orphan')

class Detection(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    timestamp  = db.Column(db.DateTime, default=datetime.utcnow)
    pest_name  = db.Column(db.String(100), nullable=False)
    image_path = db.Column(db.String(200), nullable=False)
    user_id    = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
