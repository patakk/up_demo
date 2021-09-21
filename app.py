from flask import Flask
from flask import render_template
import base64
import requests


app = Flask(__name__)


@app.route("/")
def hello():
    response = requests.get('http://gibaster.zapto.org:8089/curlr.php')
    imgstring = response.content

    imgdata = base64.b64decode(imgstring)
    filename = 'static/background_image.jpg'
    with open(filename, 'wb') as f:
        f.write(response.content)

    return render_template('index.html')


if __name__ == "__main__":
    app.run("0.0.0.0", port=5005)