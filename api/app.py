from flask import Flask
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Dropout
from keras.saving import register_keras_serializable

app = Flask(__name__)

class FixedDropout(Dropout):
    def __init__(self, rate, **kwargs):
        super().__init__(rate, **kwargs)

@register_keras_serializable(package='Custom')
def swish(x):
    return x * tf.sigmoid(x)

# model = load_model("Copy of 2best_modelB3b.h5", custom_objects={"FixedDropout": FixedDropout})
model = load_model(
    "Copy of 2best_modelB3b.h5", 
    custom_objects={
        "FixedDropout": FixedDropout,
        "swish": swish  # Add this line
    }
)
@app.route("/")
def home():
    return "Flask API is running!"

if __name__ == "__main__":
    app.run(debug=True)
