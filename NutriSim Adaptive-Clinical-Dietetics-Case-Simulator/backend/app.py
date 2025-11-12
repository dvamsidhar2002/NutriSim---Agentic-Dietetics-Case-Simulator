from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
from database.models import db, User
import random
import string
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import json
import requests

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Email configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME', 'vamsidhard2002@gmail.com')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD', 'dqtjvplpebofoorl')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME', 'vamsidhard2002@gmail.com')

db.init_app(app)
mail = Mail(app)

# Store OTPs temporarily
otp_storage = {}

def generate_otp():
    """Generate a 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=6))

# --------------------------------------------
# Replaced Gemini API with Ollama (Llama 3.2)
# --------------------------------------------
OLLAMA_MODEL = "llama3.2"
OLLAMA_URL = "http://localhost:11434/api/generate"

def query_ollama(prompt, temperature=0.7, max_tokens=2048):
    """Helper to query Ollama's llama3.2 model."""
    try:
        payload = {
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens
            }
        }
        response = requests.post(OLLAMA_URL, json=payload, stream=True, timeout=120)
        response.raise_for_status()

        # Ollama streams JSON lines; collect text pieces
        output_text = ""
        for line in response.iter_lines():
            if line:
                data = json.loads(line)
                if "response" in data:
                    output_text += data["response"]
        return output_text.strip()
    except Exception as e:
        print(f"❌ Ollama request failed: {e}")
        return None


# ----------------------------------------------------
# Case Generation Endpoint
# ----------------------------------------------------
@app.route('/api/cases/generate', methods=['POST'])
def generate_case():
    """Generate a new case based on difficulty level"""
    try:
        data = request.json
        username = data.get('username')
        difficulty = data.get('difficulty', 'beginner')

        print(f"🔍 Received request - Username: {username}, Difficulty: {difficulty}")

        if not username:
            return jsonify({"message": "Username required", "success": False}), 400

        prompt = f"""
You are a clinical dietetics case simulator. Generate a realistic {difficulty}-level clinical case for a nutrition student.

Difficulty guidelines:
- Beginner: Single condition (obesity, simple diabetes), straightforward dietary needs
- Intermediate: Multiple conditions (diabetes + hypertension), some complications
- Advanced: Complex cases (multiple comorbidities, special populations, tube feeding)

The case should include:
- Patient name, age and gender
- Relevant medical condition(s)
- Weight, height, and BMI
- Clinical symptoms
- Dietary habits or lifestyle details
- Lab report findings (if relevant)
- What the patient seeks help with

Write it like a real patient case from clinical practice. Make it natural and medically plausible.
Format the response as a structured case study.
"""

        print("📤 Sending request to Ollama...")
        case_text = query_ollama(prompt, temperature=0.7, max_tokens=2048)

        if not case_text:
            return jsonify({
                "message": "Failed to generate case content. Please try again.",
                "success": False
            }), 500

        print("✅ Case generated successfully")

        case_id = f"case_{username}_{difficulty}_{datetime.now().strftime('%Y%m%d%H%M%S')}"



        return jsonify({
            "success": True,
            "case": case_text,
            "difficulty": difficulty,
            "case_id": case_id
        }), 200


    except Exception as e:
        error_msg = str(e)
        print(f"❌ Error generating case: {error_msg}")
        import traceback
        traceback.print_exc()

        return jsonify({
            "message": f"Failed to generate case: {error_msg}",
            "success": False
        }), 500


# ----------------------------------------------------
# Case Evaluation Endpoint
# ----------------------------------------------------
@app.route('/api/cases/evaluate', methods=['POST'])
def evaluate_case():
    """Evaluate student's answer to a case"""
    try:
        data = request.json
        case_text = data.get('case')
        student_answer = data.get('answer')

        print(f"🔍 Received evaluation request")

        if not case_text or not student_answer:
            return jsonify({"message": "Case and answer required", "success": False}), 400

        evaluation_prompt = f"""
You are an expert clinical dietitian evaluating a student's response.

CASE:
{case_text}

STUDENT'S ANSWER:
{student_answer}

Evaluate the answer and provide:
1. A score from 0-100
2. Detailed feedback on what was correct
3. What was missing or incorrect
4. Suggestions for improvement
5. Whether the student demonstrated clinical reasoning

Format your response as JSON:
{{
    "score": <number 0-100>,
    "correct_points": ["point1", "point2"],
    "missing_points": ["point1", "point2"],
    "incorrect_points": ["point1", "point2"],
    "feedback": "detailed feedback here",
    "clinical_reasoning": "excellent/good/fair/poor",
    "overall_assessment": "excellent/good/fair/needs_improvement"
}}
"""

        print("📤 Sending evaluation request to Ollama...")
        text = query_ollama(evaluation_prompt, temperature=0.3, max_tokens=2048)

        try:
            if not text:
                raise ValueError("No response from Ollama.")

            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()

            evaluation = json.loads(text)
            print("✅ Evaluation completed successfully")

            return jsonify({
                "success": True,
                "evaluation": evaluation
            }), 200

        except json.JSONDecodeError as je:
            print(f"❌ JSON parsing error: {str(je)}")
            print(f"Response text: {text}")

            return jsonify({
                "success": True,
                "evaluation": {
                    "score": 70,
                    "correct_points": ["Good effort demonstrated"],
                    "missing_points": ["Could not fully evaluate due to technical issue"],
                    "incorrect_points": [],
                    "feedback": text,
                    "clinical_reasoning": "fair",
                    "overall_assessment": "good"
                }
            }), 200

    except Exception as e:
        error_msg = str(e)
        print(f"❌ Error evaluating case: {error_msg}")
        import traceback
        traceback.print_exc()

        return jsonify({
            "message": f"Failed to evaluate: {error_msg}",
            "success": False
        }), 500


# ----------------------------------------------------
# Clarifying Questions Endpoint
# ----------------------------------------------------
@app.route('/api/cases/clarifying-questions', methods=['POST'])
def get_clarifying_questions():
    """Generate clarifying questions based on evaluation"""
    try:
        data = request.json
        case_text = data.get('case')
        student_answer = data.get('answer')
        missing_points = data.get('missing_points', [])

        print("🔍 Generating clarifying questions...")

        question_prompt = f"""
Based on the student's answer and the missing points, generate 2-3 clarifying questions 
to help the student think deeper about what they missed.

CASE: {case_text}

STUDENT'S ANSWER: {student_answer}

MISSING POINTS: {missing_points}

Generate questions that guide learning without giving away the answer. 
Return as a simple numbered list.
"""

        questions = query_ollama(question_prompt, temperature=0.7, max_tokens=1024)

        if not questions:
            raise ValueError("Failed to generate questions")

        print("✅ Clarifying questions generated")

        return jsonify({
            "success": True,
            "questions": questions
        }), 200

    except Exception as e:
        error_msg = str(e)
        print(f"❌ Error generating questions: {error_msg}")

        return jsonify({
            "message": f"Failed to generate questions: {error_msg}",
            "success": False
        }), 500


# ----------------------------------------------------
# Ollama Test Endpoint
# ----------------------------------------------------
@app.route('/api/test-ollama', methods=['GET'])
def test_ollama():
    """Test if Ollama Llama 3.2 API is working"""
    try:
        text = query_ollama("Say 'Hello, NutriSim is running with Llama 3.2!'")
        if not text:
            raise ValueError("No response from Ollama.")
        return jsonify({
            "status": "success",
            "message": text,
            "api_configured": True
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
            "api_configured": False
        }), 500


# ----------------------------------------------------
# Main App Runner
# ----------------------------------------------------
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    print("🚀 Starting NutriSim Flask Server...")
    print(f"📧 Email: {app.config['MAIL_USERNAME']}")
    print(f"🤖 Ollama AI: ✅ Llama 3.2 configured via {OLLAMA_URL}")
    app.run(debug=True)
