# app.py       http://localhost:5000
from flask import Flask, request, render_template, abort, redirect, url_for
from PIL import Image
import numpy as np
import tensorflow as tf
import os
import uuid
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

# Flask-Login, Migrate
from flask_login import login_required, current_user
from flask_migrate import Migrate

# Importamos db y modelos desde models.py
from models import db, User, Detection

# Importamos el blueprint YA DEFINIDO en auth.py
from auth import auth as auth_bp

# Para poder usar TF1-style sessions
tf.compat.v1.disable_eager_execution()

def create_app():
    app = Flask(__name__)

    # Configuración Flask + SQLAlchemy
    app.config['SECRET_KEY'] = 'Clave_Segura'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # — inicializo extensiones —
    db.init_app(app)
    Migrate(app, db)

    # — registramos blueprint de autenticación bajo /auth —
    app.register_blueprint(auth_bp, url_prefix='/auth')

    # — loader de usuario para flask-login —
    from flask_login import LoginManager
    login_manager = LoginManager(app)
    login_manager.login_view = 'auth.login'
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Cargar tu modelo TF congelado
    def load_frozen_graph(pb_path):
        g = tf.Graph()
        sess = tf.compat.v1.Session(graph=g)
        with tf.io.gfile.GFile(pb_path, "rb") as f:
            gd = tf.compat.v1.GraphDef()
            gd.ParseFromString(f.read())
        with g.as_default():
            tf.import_graph_def(gd, name="")
        return g, sess

    PB_PATH = os.path.join(app.root_path, "model", "EffNetB0-MyClassification-78.15.pb")
    graph, sess = load_frozen_graph(PB_PATH)
    input_tensor  = graph.get_tensor_by_name("model_5/normalization_5/truediv:0")
    output_tensor = graph.get_tensor_by_name("Identity:0")

    IMG_SIZE = (200, 200)
    CLASS_NAMES = [
        "Rice Leaf Caterpillar", "Sternochetus Frigidus", "Rice Leafhopper",
        "Rice Shell Pest", "Large Cutworm", "Yellow Cutworm", "Red Spider",
        "Potosiabre Vitarsis", "English Grain Aphid", "Wheat Blossom Midge",
        "Wheat Sawfly", "Yellow Rice Borer", "Alfalfa Weevil",
        "Alfalfa Plant Bug", "Lytta Polita", "Rice Gall Midge", "Pieris Canidia",
        "Apolygus Lucorum", "Viteus Vitifoliae", "Rice Stemfly", "Papilio Xuthus",
        "Unaspis Yanonensis", "Dacus Dorsalis(Hendel)", "Phyllocnistis Citrella Stainton",
        "Small Brown Plant Hopper", "Aphis Citricola Vander Goot", "Dasineura Sp",
        "Lawana Imitata Melichar", "Salurnis Marginella Guerr", "Rhytidodera Bowrinii White"
    ]

    # — Ruta principal con login_required —
    @app.route("/", methods=["GET", "POST"])
    @login_required
    def index():
        prediction = None
        error = None

        if request.method == "POST":
            file = request.files.get("image")
            if not file:
                error = "Por favor, sube una imagen."
            else:
                try:
                    img = Image.open(file).convert("RGB").resize(IMG_SIZE)
                    arr = np.array(img, dtype=np.float32) / 255.0
                    batch = np.expand_dims(arr, axis=0)

                    preds = sess.run(output_tensor,
                                     feed_dict={input_tensor: batch})
                    idx = int(np.argmax(preds[0]))
                    prediction = CLASS_NAMES[idx]

                    # guarda imagen y registro
                    filename = f"{uuid.uuid4().hex}.jpg"
                    save_dir = os.path.join(app.static_folder, 'uploads', str(current_user.id))
                    os.makedirs(save_dir, exist_ok=True)
                    full_path = os.path.join(save_dir, filename)
                    img.save(full_path)

                    rel_path = os.path.join('uploads', str(current_user.id), filename).replace('\\','/')
                    image_url = url_for('static', filename=rel_path)

                    det = Detection(
                        pest_name=prediction,
                        image_path=os.path.relpath(full_path, start=app.root_path),
                        user=current_user
                    )
                    db.session.add(det)
                    db.session.commit()
                    return render_template(
                        "index.html",
                        prediction=prediction,
                        error=error,
                        image_url=image_url
                    )
                except Exception as e:
                    error = f"Error de inferencia: {e}"

        return render_template("index.html",
                               prediction=prediction,
                               error=error,
                               image_url=None)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
