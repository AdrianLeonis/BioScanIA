from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, login_required
from models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
# Importa db y User desde tu app ya inicializada:
auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['GET','POST'])
def signup():
    if request.method == 'POST':
        email = request.form['email']
        username = request.form['username']
        password = generate_password_hash(request.form['password'])
        # Comprobar usuario o email ya existentes
        if User.query.filter_by(username=username).first():
            flash('El nombre de usuario ya existe', 'error')
            return redirect(url_for('auth.signup'))
        if User.query.filter_by(email=email).first():
            flash('El correo ya está registrado', 'error')
            return redirect(url_for('auth.signup'))
        # Crear nuevo usuario
        user = User(username=username, email=email, password=password)
        db.session.add(user)
        db.session.commit()
        flash('Cuenta creada con éxito', 'success')
        login_user(user)
        return redirect(url_for('index'))
    return render_template('signup.html')

@auth.route('/login', methods=['GET','POST'])
def login():
    if request.method=='POST':
        email = request.form['email']  # o 'username', según tu formulario
        pwd = request.form['password']
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, pwd):
            login_user(user)
            return redirect(url_for('index'))
        flash('Credenciales inválidas','error')
    return render_template('login.html')

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))
