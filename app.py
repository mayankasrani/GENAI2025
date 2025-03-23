# MOVE INTO VENV 
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import os
import base64
from PIL import Image
from io import BytesIO

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure API Key from environment variable
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
# Use gemini-1.5-pro for better multimodal capabilities
model = genai.GenerativeModel('gemini-1.5-pro')

def get_gemini_analysis(query):
    prompt = f"Analyze the following life choice: '{query}'. Provide a brief qualitative analysis of its financial, health, and environmental impacts."
    try:
        response = model.generate_content(prompt)
        if response.text == None:
            return "Gemini returned no response"
        return response.text
    except Exception as e:
        error_message = f"Error during Gemini API call: {e}"
        print(error_message) #For debugging
        return error_message

def analyze_image(image_data, prompt_text):
    try:
        # Decode base64 image
        image_bytes = base64.b64decode(image_data.split(',')[1] if ',' in image_data else image_data)
        image = Image.open(BytesIO(image_bytes))
        
        # Create prompt with the image
        prompt = f"Analyze this image. {prompt_text if prompt_text else 'What does this image show? Provide details about what you see.'}"
        
        # Generate content with the image
        response = model.generate_content([prompt, image])
        
        if response.text == None:
            return "Gemini returned no response"
        return response.text
    except Exception as e:
        error_message = f"Error during image analysis: {e}"
        print(error_message)  # For debugging
        return error_message

@app.route('/analyze', methods=['POST'])
def analyze_choice():
    data = request.get_json()
    query = data.get('query')
    if not query:
        return jsonify({'error': 'Query is required'}), 400

    analysis = get_gemini_analysis(query)
    return jsonify({'analysis': analysis})  # Changed back to 'analysis' to match frontend

@app.route('/analyze-image', methods=['POST'])
def analyze_image_route():
    data = request.get_json()
    image_data = data.get('image')
    prompt_text = data.get('prompt', '')
    
    if not image_data:
        return jsonify({'error': 'Image data is required'}), 400
    
    analysis = analyze_image(image_data, prompt_text)
    return jsonify({'analysis': analysis})

@app.route('/test', methods=['GET'])
def test():
    return jsonify({'message': 'Backend is working!'})

if __name__ == '__main__':
    app.run(debug=True)