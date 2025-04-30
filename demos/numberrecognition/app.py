from flask import Flask, render_template, request, jsonify
from tensorflow.keras.models import load_model
from num2words import num2words
from PIL import Image
import numpy as np
import base64
import io

app = Flask(__name__)
model = load_model('model/mnist_model.h5')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    image_data = data['image'].split(',')[1]
    img_bytes = base64.b64decode(image_data)
    img = Image.open(io.BytesIO(img_bytes)).convert('L').resize((28, 28))
    img = 255 - np.array(img)  # invert
    img = img / 255.0
    img = img.reshape(1, 28, 28)

    prediction = model.predict(img)
    digit = int(np.argmax(prediction))
    word = num2words(digit)

    return jsonify({'digit': digit, 'word': word})
