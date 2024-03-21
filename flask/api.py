from flask import Flask, request, jsonify
from keras.models  import load_model
import cv2
import numpy as np
from flask_cors import CORS


app = Flask(__name__)

CORS(app)

model_path_for_mri = r"C:\Users\ANITHA\Desktop\enigma\flask\brainfuckfunalB2.h5"
model_for_mri = load_model(model_path_for_mri)

model_path_for_xray = r"C:\Users\ANITHA\Desktop\enigma\flask\brainfuckfunalB2.h5"
model_for_xray = load_model(model_path_for_xray)


classes = ["glioma","meningioma", "notumor", "pituitary"]

def processimage(image):
    img = cv2.resize(image, (150, 150))  
    img = img.reshape(1, 150, 150, 3)
    return img

	
@app.route('/predictmri', methods=['POST'])
def predictmri():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file:
    	#decode image
        image = cv2.imdecode(np.fromstring(file.read(), np.uint8), cv2.IMREAD_COLOR)
        img = processimage(image)
        prediction = model_for_mri.predict(img)*100
        prediction_class = int(np.argmax(prediction))  
        prediction_class_index = int(np.argmax(prediction))
        max_prediction = float(np.max(prediction))
        
        return jsonify({"prediction_class": classes[prediction_class], "prediction_index" : prediction_class_index,"max_pred":max_prediction})

    return jsonify({'error': 'Something went wrong'})

@app.route("/predictxray", methods = ['POST'])
def predictxray():
     if 'file' not in request.files:
          return jsonify({'error ' : "No file is recived"})
     file = request.files['file']
     if file.filename == '':
          return jsonify({'error' : 'wrong file or no file '})
     if file:
          image = cv2.imdecode(np.fromstring(file.read(), np.uint8), cv2.IMREAD_COLOR)
          img = processimage(image)
          prediction = model_for_xray.predict(img)*100
          prediction_class = int(np.argmax(prediction))
          return jsonify({"prediction_class": classes[prediction_class], "prediction_list" : prediction.tolist()})

if __name__ == "__main__":
	app.run(debug = True)
