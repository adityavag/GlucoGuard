from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
import numpy as np
from PIL import Image
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Dropout
from io import BytesIO
import logging
import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)
app.logger.setLevel(logging.INFO)

class FixedDropout(Dropout):
    def __init__(self, rate, **kwargs):
        super().__init__(rate, **kwargs)

def swish(x):
    return x * tf.sigmoid(x)

model = load_model(
    "Copy of 2best_modelB3b.h5",
    custom_objects={
        "FixedDropout": FixedDropout,
        "swish": swish
    }
)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image, target_size=(224, 224)):
    try:
        if image.mode != "RGB":
            image = image.convert("RGB")
        image = image.resize(target_size)
        image_array = np.array(image)
        image_array = np.expand_dims(image_array, axis=0)
        image_array = image_array.astype('float32') / 255.0
        return image_array
    except Exception as e:
        app.logger.error(f"Image preprocessing failed: {str(e)}")
        raise

# from reportlab.pdfgen import canvas
# from reportlab.lib.pagesizes import letter
from io import BytesIO
from datetime import datetime

from reportlab.lib.colors import HexColor

def create_pdf_report(patient_data, prediction):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)

    # Theme Colors
    purple = HexColor("#A855F7")
    purple_bg = HexColor("#F5F3FF")
    gray_border = HexColor("#D1D5DB")

    # Margins
    margin_x = 72
    y = 750

    # Header Box
    c.setFillColor(purple_bg)
    c.rect(margin_x - 10, y - 20, 470, 30, fill=True, stroke=False)
    c.setFillColor(purple)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(margin_x, y, "Diabetic Retinopathy Report")
    
    # Reset to normal text
    c.setFillColor("black")
    y -= 40
    c.setFont("Helvetica", 12)
    c.drawString(margin_x, y, f"Dear {patient_data['name']},")
    y -= 25
    c.drawString(margin_x, y, "We are writing to inform you about the results of your recent eye screening using")
    y -= 15
    c.drawString(margin_x, y, "automated diabetic retinopathy detection technology. Please find the details below:")

    # Patient Info
    y -= 40
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(purple)
    c.drawString(margin_x, y, "Patient Details:")
    c.setFillColor("black")
    c.setFont("Helvetica", 12)
    y -= 20
    c.drawString(margin_x, y, f"Name       : {patient_data['name']}")
    y -= 20
    c.drawString(margin_x, y, f"Age        : {patient_data['age']}")
    y -= 20
    c.drawString(margin_x, y, f"DR Grade   : {prediction['dr_grade']}")
    y -= 20
    c.drawString(margin_x, y, f"Confidence : {prediction['confidence']*100:.2f}%")

    # DR Grade Reference Table
    y -= 40
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(purple)
    c.drawString(margin_x, y, "DR Grade Reference:")
    c.setFont("Helvetica", 11)
    c.setFillColor("black")
    y -= 20
    c.drawString(margin_x, y, "Grade 0: No DR")
    y -= 15
    c.drawString(margin_x, y, "Grade 1: Mild NPDR (Non-Proliferative Diabetic Retinopathy)")
    y -= 15
    c.drawString(margin_x, y, "Grade 2: Moderate NPDR")
    y -= 15
    c.drawString(margin_x, y, "Grade 3: Severe NPDR")
    y -= 15
    c.drawString(margin_x, y, "Grade 4: Proliferative DR")

    # Footer Note
    y -= 40
    c.setFont("Helvetica-Oblique", 10)
    c.drawString(margin_x, y, "Note: This is a computer-generated report. Please consult an ophthalmologist for expert review.")

    # Light bottom border
    c.setStrokeColor(gray_border)
    c.line(margin_x - 10, 50, 540, 50)

    c.save()
    buffer.seek(0)
    return buffer


def send_email(receiver_email, pdf_buffer, patient_name):
    msg = MIMEMultipart()
    msg['Subject'] = f"Diabetic Retinopathy Report for {patient_name}"
    msg['From'] = SMTP_USERNAME
    msg['To'] = receiver_email

    body = MIMEText(f"""Dear {patient_name},
    
Please find attached your diabetic retinopathy analysis report.
    
Best regards,
GlucoGuard Team""")
    msg.attach(body)

    pdf_attachment = MIMEApplication(pdf_buffer.read(), _subtype="pdf")
    pdf_attachment.add_header('Content-Disposition', 'attachment', filename="DR_Report.pdf")
    msg.attach(pdf_attachment)

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(SMTP_USERNAME, receiver_email, msg.as_string())
        return True
    except Exception as e:
        app.logger.error(f"Email sending failed: {str(e)}")
        return False

@app.route("/predict", methods=["POST"])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400
    
    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    try:
        patient_data = {
            "name": request.form.get('name', ''),
            "email": request.form.get('email', ''),
            "age": request.form.get('age', '')
        }

        if not patient_data['email']:
            return jsonify({"error": "Email address is required"}), 400

        image = Image.open(BytesIO(file.read()))
        processed_image = preprocess_image(image)
        
        prediction = model.predict(processed_image)
        predicted_class = int(np.argmax(prediction, axis=1)[0])
        confidence = float(np.max(prediction))
        
        prediction_result = {
            "dr_grade": predicted_class,
            "confidence": confidence
        }

        pdf_buffer = create_pdf_report(patient_data, prediction_result)
        email_sent = send_email(patient_data['email'], pdf_buffer, patient_data['name'])

        response = {
            "status": "success",
            "prediction": prediction_result,
            "patient": patient_data,
            "email_sent": email_sent,
            "message": "Report sent to registered email" if email_sent else "Report generation failed"
        }

        return jsonify(response)
    
    except Exception as e:
        app.logger.error(f"Prediction error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/")
def home():
    return "Diabetic Retinopathy Detection API - POST image to /predict"

if __name__ == "__main__":
    app.run(debug=True)