# MOVE INTO VENV 
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure API Key from environment variable
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-1.5-flash')

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

@app.route('/analyze', methods=['POST'])
def analyze_choice():
    data = request.get_json()
    query = data.get('query')
    if not query:
        return jsonify({'error': 'Query is required'}), 400

    analysis = get_gemini_analysis(query)
    return jsonify({'analysis': analysis})  # Changed back to 'analysis' to match frontend

@app.route('/test', methods=['GET'])
def test():
    return jsonify({'message': 'Backend is working!'})

if __name__ == '__main__':
    app.run(debug=True)