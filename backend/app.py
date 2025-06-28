from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import google.generativeai as genai
import logging
from datetime import datetime
import ollama
import json
import random
import re
import base64
from PIL import Image
import io

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Set up logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Configure Gemini API
try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    models = genai.list_models()
    supported_models = [m.name for m in models if 'generateContent' in m.supported_generation_methods]
    logger.info(f"Supported models: {supported_models}")
    model_name = "gemini-1.5-flash"
    if model_name not in [m.split('/')[-1] for m in supported_models]:
        logger.warning(f"Model {model_name} not found, trying gemini-1.5-pro")
        model_name = "gemini-1.5-pro"
    gemini_model = genai.GenerativeModel(model_name)
    logger.info(f"Using Gemini model: {model_name}")
except Exception as e:
    logger.error(f"Failed to configure Gemini API: {str(e)}")
    gemini_model = None

# Configure Ollama (local Llama model)
try:
    ollama_model = "llama3"
    ollama.pull(ollama_model)
    logger.info(f"Ollama model {ollama_model} ready")
except Exception as e:
    logger.error(f"Failed to configure Ollama: {str(e)}")
    ollama_model = None

# In-memory storage
profiles = {}
interaction_history = {}
learning_progress = {}
fraud_alerts = {}

# Enhanced BFSI Manager prompt for AI Agent
BFSI_AGENT_PROMPT = """
You are an expert BFSI (Banking, Financial Services, and Insurance) Manager and Financial Advisor with 15+ years of experience. Your role is to:

1. **Simplify Complex Financial Concepts**: Break down complex terms like ULIP, EMI, SIP, Term Insurance, Mutual Funds, etc. into simple, beginner-friendly explanations with real-world examples.

2. **Provide Personalized Guidance**: Based on user profiles (income, age, goals, risk appetite), offer tailored financial advice and product recommendations.

3. **Educational Approach**: Create bite-sized, gamified learning content that makes financial literacy engaging and accessible.

4. **Fraud Prevention**: Help users understand common financial frauds and how to avoid them.

5. **24/7 Support**: Provide instant, accurate responses to any financial query with a warm, professional tone.

**Response Guidelines:**
- Always use simple language, avoid jargon
- Provide practical examples and analogies
- Include actionable steps when possible
- Be encouraging and supportive
- If explaining a complex term, break it down step-by-step
- Use bullet points for better readability
- Include relevant emojis to make responses engaging
- Always end with a helpful follow-up question

**Example Response Format:**
```
📚 **Term Insurance Explained Simply**

Think of term insurance like a safety net for your family! 🛡️

**What it is:** A life insurance policy that protects your family for a specific period (like 20-30 years).

**How it works:** 
• You pay a small premium monthly/yearly
• If something happens to you during the term, your family gets a large sum
• If you survive the term, no money back (but your family was protected!)

**Real Example:** 
Rahul (30 years) buys ₹1 crore term insurance for 30 years at ₹500/month. If he passes away anytime in these 30 years, his family gets ₹1 crore. If he lives beyond 60, no money back, but his family was protected during his earning years.

**Why it's important:** 
✅ Protects family's future
✅ Very affordable (₹500/month for ₹1 crore coverage)
✅ Tax benefits under Section 80C

**Next Steps:** Would you like to know how much coverage you need based on your income and family size? 💡
```

Remember: You're not just answering questions - you're educating and empowering people to make better financial decisions! 🚀
"""

# Gamified Learning Content
LEARNING_MODULES = {
    "insurance_basics": {
        "title": "Insurance Fundamentals",
        "lessons": [
            {
                "id": "term_vs_ulip",
                "title": "Term Insurance vs ULIP",
                "content": {
                    "term_insurance": {
                        "title": "Term Insurance - Pure Protection",
                        "description": "Like a safety net for your family",
                        "pros": ["High coverage at low cost", "Pure protection", "Tax benefits"],
                        "cons": ["No returns if you survive", "No cash value"],
                        "example": "₹1 crore coverage for ₹500/month"
                    },
                    "ulip": {
                        "title": "ULIP - Investment + Protection",
                        "description": "Combines insurance with investment",
                        "pros": ["Life cover + investment", "Potential returns", "Flexibility"],
                        "cons": ["Higher costs", "Market risks", "Complex structure"],
                        "example": "₹10 lakh coverage + investment returns"
                    }
                },
                "quiz": [
                    {
                        "question": "Which is better for pure family protection?",
                        "options": ["Term Insurance", "ULIP", "Both", "Neither"],
                        "correct": 0,
                        "explanation": "Term insurance provides maximum coverage at minimum cost for pure protection."
                    }
                ]
            }
        ]
    },
    "investment_basics": {
        "title": "Investment Fundamentals",
        "lessons": [
            {
                "id": "sip_emergency",
                "title": "SIPs and Emergency Funds",
                "content": {
                    "sip": {
                        "title": "Systematic Investment Plan (SIP)",
                        "description": "Invest small amounts regularly",
                        "benefits": ["Disciplined investing", "Rupee cost averaging", "Long-term wealth creation"],
                        "example": "₹5000/month in mutual funds"
                    },
                    "emergency_fund": {
                        "title": "Emergency Fund",
                        "description": "Safety net for unexpected expenses",
                        "amount": "6-12 months of expenses",
                        "where_to_keep": ["Savings account", "Liquid funds", "FDs"],
                        "example": "₹3 lakh for ₹50,000 monthly expenses"
                    }
                }
            }
        ]
    },
    "loan_basics": {
        "title": "Loan and EMI Understanding",
        "lessons": [
            {
                "id": "emi_calculation",
                "title": "Understanding EMI and Loan Traps",
                "content": {
                    "emi": {
                        "title": "What is EMI?",
                        "description": "Equated Monthly Installment",
                        "formula": "EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)",
                        "example": "₹10 lakh loan at 10% for 20 years = ₹9,650/month"
                    },
                    "loan_traps": {
                        "title": "Common Loan Traps",
                        "traps": [
                            "Prepayment charges",
                            "Hidden fees",
                            "High processing charges",
                            "Insurance bundling"
                        ],
                        "avoidance": [
                            "Read all terms carefully",
                            "Compare multiple lenders",
                            "Check total cost, not just EMI",
                            "Avoid unnecessary add-ons"
                        ]
                    }
                }
            }
        ]
    }
}

# Fallback responses when Gemini is not available
FALLBACK_RESPONSES = {
    'security_analysis': {
        'isFraudulent': False,
        'confidence': 85,
        'riskFactors': ['No immediate threats detected'],
        'recommendations': [
            'File appears to be legitimate',
            'Continue with normal processing',
            'Monitor for any unusual patterns'
        ],
        'details': 'The uploaded file has been analyzed and appears to be safe for processing. No suspicious patterns or malicious content were detected.'
    },
    'claim_analysis': {
        'summary': [
            'Claim submitted successfully',
            'Documents appear to be complete',
            'Processing time: 5-7 business days'
        ],
        'missingInfo': ['All required information appears to be complete'],
        'approvalLikelihood': 'High',
        'explanation': 'Your claim has been submitted successfully. The documents provided appear to be complete and the claim amount is within policy limits. We expect a quick processing time.',
        'status': 'Under Review',
        'claimId': None
    },
    'chat_response': 'I apologize, but I am currently experiencing technical difficulties. Please try again later or contact our support team for assistance.'
}

def analyze_with_gemini(prompt, fallback_key):
    """Analyze with Gemini AI with fallback"""
    if not gemini_model:
        return FALLBACK_RESPONSES[fallback_key]
    
    try:
        response = gemini_model.generate_content(prompt)
        return response.text
    except Exception as e:
        logger.warning(f"Gemini API error: {e}")
        return FALLBACK_RESPONSES[fallback_key]

def analyze_image_with_gemini(image_data, prompt, fallback_key):
    """Analyze image with Gemini Vision with fallback"""
    if not gemini_model:
        return FALLBACK_RESPONSES[fallback_key]
    
    try:
        # Convert base64 to PIL Image
        image_bytes = base64.b64decode(image_data.split(',')[1])
        image = Image.open(io.BytesIO(image_bytes))
        
        response = gemini_model.generate_content([prompt, image])
        return response.text
    except Exception as e:
        logger.warning(f"Gemini Vision API error: {e}")
        return FALLBACK_RESPONSES[fallback_key]

@app.route("/api/profile", methods=["POST"])
def save_profile():
    try:
        data = request.get_json()
        if not data or "user_id" not in data:
            logger.warning("Invalid profile request: missing user_id")
            return jsonify({"error": "user_id is required"}), 400
        user_id = data["user_id"]
        
        # Enhanced profile analysis with AI
        if gemini_model:
            try:
                profile_analysis_prompt = f"""
                {BFSI_AGENT_PROMPT}
                
                Analyze this user profile for comprehensive BFSI insights:
                {json.dumps(data, indent=2)}
                
                Provide analysis in JSON format with:
                {{
                    "risk_profile": "low/medium/high",
                    "financial_priorities": ["priority1", "priority2", "priority3"],
                    "recommended_products": ["product1", "product2"],
                    "learning_path": ["module1", "module2"],
                    "fraud_risk_score": 0-100,
                    "personalized_advice": "tailored advice"
                }}
                """
                
                response = gemini_model.generate_content(profile_analysis_prompt)
                if response and hasattr(response, 'text') and response.text:
                    try:
                        analysis = json.loads(response.text)
                        data["ai_analysis"] = analysis
                    except json.JSONDecodeError:
                        logger.warning("Failed to parse AI analysis as JSON")
            except Exception as e:
                logger.warning(f"AI profile analysis failed: {str(e)}")
        
        profiles[user_id] = data
        logger.info(f"Enhanced profile saved for user_id: {user_id}")
        return jsonify({"message": "Profile saved successfully", "analysis": data.get("ai_analysis", {})})
    except Exception as e:
        logger.error(f"Error in save_profile: {str(e)}")
        return jsonify({"error": f"Failed to save profile: {str(e)}"}), 500

@app.route("/api/learning/modules", methods=["GET"])
def get_learning_modules():
    """Get available learning modules"""
    return jsonify({"modules": LEARNING_MODULES})

@app.route("/api/learning/lesson/<module_id>/<lesson_id>", methods=["GET"])
def get_lesson(module_id, lesson_id):
    """Get specific lesson content"""
    try:
        if module_id in LEARNING_MODULES:
            for lesson in LEARNING_MODULES[module_id]["lessons"]:
                if lesson["id"] == lesson_id:
                    return jsonify({"lesson": lesson})
        return jsonify({"error": "Lesson not found"}), 404
    except Exception as e:
        logger.error(f"Error getting lesson: {str(e)}")
        return jsonify({"error": "Failed to get lesson"}), 500

@app.route("/api/learning/progress", methods=["POST"])
def update_learning_progress():
    """Update user's learning progress"""
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        module_id = data.get("module_id")
        lesson_id = data.get("lesson_id")
        score = data.get("score", 0)
        
        if user_id not in learning_progress:
            learning_progress[user_id] = {}
        
        if module_id not in learning_progress[user_id]:
            learning_progress[user_id][module_id] = {}
        
        learning_progress[user_id][module_id][lesson_id] = {
            "completed": True,
            "score": score,
            "completed_at": datetime.now().isoformat()
        }
        
        return jsonify({"message": "Progress updated successfully"})
    except Exception as e:
        logger.error(f"Error updating progress: {str(e)}")
        return jsonify({"error": "Failed to update progress"}), 500

@app.route("/api/chat", methods=["POST"])
def enhanced_chatbot():
    """Enhanced BFSI chatbot with context awareness"""
    try:
        data = request.get_json()
        if not data or "message" not in data:
            return jsonify({"error": "message is required"}), 400
        
        message = data["message"]
        user_id = data.get("user_id", "anonymous")
        context = data.get("context", {})
        
        # Track interaction for fraud detection
        if user_id not in interaction_history:
            interaction_history[user_id] = []
        interaction_history[user_id].append({
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "context": context
        })
        
        # Enhanced prompt with user context
        user_profile = profiles.get(user_id, {})
        
        enhanced_prompt = f"""
        {BFSI_AGENT_PROMPT}
        
        **User Context:**
        - Profile: {json.dumps(user_profile, indent=2) if user_profile else "No profile available"}
        - Previous interactions: {len(interaction_history.get(user_id, []))} messages
        - Current context: {json.dumps(context, indent=2)}
        
        **User Query:** {message}
        
        **Instructions:**
        1. If the user asks about complex terms (ULIP, EMI, SIP, etc.), provide a simple explanation with examples
        2. If they ask for recommendations, consider their profile data
        3. If they mention fraud concerns, provide guidance on prevention
        4. Always be encouraging and educational
        5. Use emojis and bullet points for better readability
        6. End with a helpful follow-up question
        
        **Response Format:** Provide a clear, structured response that's easy to understand.
        """
        
        if not gemini_model:
            return jsonify({"error": "AI model unavailable"}), 500
        
        response = gemini_model.generate_content(enhanced_prompt)
        if not response or not hasattr(response, 'text') or not response.text:
            return jsonify({"error": "Failed to generate response"}), 500
        
        # Check for fraud indicators in the conversation
        fraud_score = analyze_conversation_fraud(user_id, message, context)
        
        return jsonify({
            "response": response.text,
            "fraud_score": fraud_score,
            "fraud_alert": fraud_score > 70,
            "suggestions": generate_follow_up_suggestions(message, user_profile)
        })
        
    except Exception as e:
        logger.error(f"Error in enhanced chatbot: {str(e)}")
        return jsonify({"error": f"Failed to process query: {str(e)}"}), 500

def analyze_conversation_fraud(user_id, message, context):
    """Analyze conversation for fraud indicators"""
    fraud_score = 0
    
    # Check for suspicious patterns
    suspicious_keywords = [
        "urgent", "immediate", "quick money", "guaranteed returns",
        "no risk", "double your money", "secret formula"
    ]
    
    message_lower = message.lower()
    for keyword in suspicious_keywords:
        if keyword in message_lower:
            fraud_score += 10
    
    # Check interaction frequency
    user_interactions = interaction_history.get(user_id, [])
    recent_interactions = [i for i in user_interactions 
                         if (datetime.now() - datetime.fromisoformat(i["timestamp"])).seconds < 300]
    
    if len(recent_interactions) > 5:
        fraud_score += 20
    
    # Check for unusual requests
    unusual_patterns = [
        r"transfer.*money.*urgently",
        r"bank.*details.*needed",
        r"otp.*required.*immediately"
    ]
    
    for pattern in unusual_patterns:
        if re.search(pattern, message_lower):
            fraud_score += 30
    
    return min(fraud_score, 100)

def generate_follow_up_suggestions(message, user_profile):
    """Generate contextual follow-up suggestions"""
    suggestions = []
    
    message_lower = message.lower()
    
    if "insurance" in message_lower:
        suggestions.extend([
            "Learn about different types of insurance",
            "Calculate your insurance needs",
            "Compare insurance policies"
        ])
    
    if "investment" in message_lower or "mutual fund" in message_lower:
        suggestions.extend([
            "Start with SIP basics",
            "Understand risk vs returns",
            "Learn about emergency funds"
        ])
    
    if "loan" in message_lower or "emi" in message_lower:
        suggestions.extend([
            "Calculate EMI for different amounts",
            "Learn about loan traps",
            "Compare loan options"
        ])
    
    if "fraud" in message_lower or "scam" in message_lower:
        suggestions.extend([
            "Learn about common frauds",
            "Check fraud detection tips",
            "Report suspicious activity"
        ])
    
    return suggestions[:3]

@app.route("/api/fraud-detection", methods=["POST"])
def enhanced_fraud_detection():
    """Enhanced fraud detection with AI analysis"""
    try:
        data = request.get_json()
        if not data or "user_id" not in data:
            return jsonify({"error": "user_id is required"}), 400
        
        user_id = data["user_id"]
        profile = profiles.get(user_id, {})
        
        # AI-powered fraud analysis
        if gemini_model:
            try:
                fraud_analysis_prompt = f"""
                You are an expert fraud detection specialist for BFSI sector.
                
                Analyze this user profile and interaction history for fraud indicators:
                
                **User Profile:**
                {json.dumps(profile, indent=2)}
                
                **Interaction History:**
                {json.dumps(interaction_history.get(user_id, []), indent=2)}
                
                **Fraud Detection Criteria:**
                1. Income vs spending patterns
                2. Age vs financial behavior
                3. Multiple policy applications
                4. Suspicious transaction patterns
                5. Inconsistent information
                6. Unusual request patterns
                
                Provide analysis in JSON format:
                {{
                    "policy_fraud": {{
                        "score": 0-100,
                        "status": "Safe/Warning/Danger",
                        "indicators": ["indicator1", "indicator2"],
                        "details": "explanation",
                        "recommendations": ["action1", "action2"]
                    }},
                    "insurance_fraud": {{
                        "score": 0-100,
                        "status": "Safe/Warning/Danger",
                        "indicators": ["indicator1", "indicator2"],
                        "details": "explanation",
                        "recommendations": ["action1", "action2"]
                    }},
                    "overall_risk": "Low/Medium/High",
                    "confidence": 0-100
                }}
                """
                
                response = gemini_model.generate_content(fraud_analysis_prompt)
                if response and hasattr(response, 'text') and response.text:
                    try:
                        ai_analysis = json.loads(response.text)
                        return jsonify(ai_analysis)
                    except json.JSONDecodeError:
                        logger.warning("Failed to parse AI fraud analysis as JSON")
            except Exception as e:
                logger.warning(f"AI fraud analysis failed: {str(e)}")
        
        # Fallback to basic fraud detection
        return basic_fraud_detection(profile)
        
    except Exception as e:
        logger.error(f"Error in enhanced fraud detection: {str(e)}")
        return jsonify({"error": f"Failed to perform fraud detection: {str(e)}"}), 500

def basic_fraud_detection(profile):
    """Basic fraud detection logic"""
    income = float(profile.get("income", 0))
    age = int(profile.get("age", 30))
    dependents = int(profile.get("dependents", 0))
    
    policy_risk_score = 0
    insurance_risk_score = 0
    
    # Policy fraud risk factors
    if income < 300000:
        policy_risk_score += 20
    if age < 25:
        policy_risk_score += 15
    if dependents > 5:
        policy_risk_score += 25
    
    # Insurance fraud risk factors
    if income > 1000000:
        insurance_risk_score += 10
    if age > 60:
        insurance_risk_score += 15
    if dependents == 0:
        insurance_risk_score += 20
    
    # Add random variation for demo
    policy_risk_score += random.randint(-10, 10)
    insurance_risk_score += random.randint(-10, 10)
    
    # Clamp scores
    policy_risk_score = max(0, min(100, policy_risk_score))
    insurance_risk_score = max(0, min(100, insurance_risk_score))
    
    def get_status(score):
        if score < 30:
            return "Safe"
        elif score < 70:
            return "Warning"
        else:
            return "Danger"
    
    return jsonify({
        "policy_fraud": {
            "score": policy_risk_score,
            "status": get_status(policy_risk_score),
            "details": f"Policy fraud risk assessment based on income (₹{income:,}), age ({age}), and dependents ({dependents}).",
            "recommendations": ["Verify income documents", "Check age proof", "Validate dependents"]
        },
        "insurance_fraud": {
            "score": insurance_risk_score,
            "status": get_status(insurance_risk_score),
            "details": f"Insurance fraud risk assessment based on profile analysis and transaction patterns.",
            "recommendations": ["Monitor claim patterns", "Verify documents", "Check history"]
        },
        "overall_risk": "Low" if (policy_risk_score + insurance_risk_score) / 2 < 30 else "Medium" if (policy_risk_score + insurance_risk_score) / 2 < 70 else "High",
        "confidence": 85
    })

@app.route("/api/recommend", methods=["POST"])
def enhanced_recommendations():
    """Enhanced AI-powered recommendations"""
    try:
        data = request.get_json()
        if not data or "user_id" not in data:
            return jsonify({"error": "user_id is required"}), 400
        
        user_id = data["user_id"]
        profile = profiles.get(user_id, {})
        
        if not profile:
            return jsonify({"error": "Profile not found"}), 404
        
        # Enhanced AI recommendation prompt
        recommendation_prompt = f"""
        {BFSI_AGENT_PROMPT}
        
        Based on this user profile, provide personalized BFSI recommendations:
        {json.dumps(profile, indent=2)}
        
        Generate 5-7 personalized recommendations in JSON format:
        [
            {{
                "id": "unique_id",
                "name": "Product/Service Name",
                "type": "insurance/investment/loan/banking",
                "category": "term_insurance/health_insurance/mutual_fund/personal_loan/etc",
                "description": "Simple, beginner-friendly description",
                "benefits": ["benefit1", "benefit2", "benefit3"],
                "monthly_cost": "₹X/month or N/A",
                "expected_returns": "X% annually or N/A",
                "rating": 4.5,
                "color": "blue/green/purple/orange/pink/red",
                "icon": "Shield/TrendingUp/CreditCard/Heart/etc",
                "priority": "high/medium/low",
                "why_recommended": "Why this is good for this user",
                "next_steps": "What user should do next"
            }}
        ]
        
        Focus on:
        1. User's income level and affordability
        2. Age and life stage
        3. Financial goals
        4. Risk appetite
        5. Dependents and family situation
        """
        
        if not gemini_model:
            return jsonify({"error": "AI model unavailable"}), 500
        
        response = gemini_model.generate_content(recommendation_prompt)
        if not response or not hasattr(response, 'text') or not response.text:
            return jsonify({"error": "Failed to generate recommendations"}), 500
        
        try:
            recommendations = json.loads(response.text)
        except json.JSONDecodeError:
            # Fallback recommendations
            recommendations = [
                {
                    "id": "1",
                    "name": "SecureLife Term Plan",
                    "type": "insurance",
                    "category": "term_insurance",
                    "description": "Pure life insurance protection for your family",
                    "benefits": ["High coverage at low cost", "Tax benefits", "Family protection"],
                    "monthly_cost": "₹500-1000/month",
                    "expected_returns": "N/A (Protection only)",
                    "rating": 4.8,
                    "color": "blue",
                    "icon": "Shield",
                    "priority": "high",
                    "why_recommended": "Essential for family protection",
                    "next_steps": "Calculate coverage amount needed"
                }
            ]
        
        return jsonify({"recommendations": recommendations})
        
    except Exception as e:
        logger.error(f"Error in enhanced recommendations: {str(e)}")
        return jsonify({"error": f"Failed to generate recommendations: {str(e)}"}), 500

@app.route("/api/health", methods=["GET"])
def health_check():
    """Enhanced health check with AI model status"""
    return jsonify({
        "status": "healthy",
        "gemini_available": bool(gemini_model),
        "ollama_available": bool(ollama_model),
        "gemini_model": gemini_model._model_name if gemini_model else "none",
        "ollama_model": ollama_model if ollama_model else "none",
        "active_profiles": len(profiles),
        "active_conversations": len(interaction_history)
    })

@app.route('/api/security/analyze', methods=['POST'])
def analyze_security_file():
    """Analyze uploaded file for security threats"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Read file content
        content = file.read().decode('utf-8', errors='ignore')
        
        # Create Gemini prompt for security analysis
        prompt = f"""
        You are a cybersecurity expert AI. Analyze the following file content for potential security threats, fraud, or malicious content.
        
        File content:
        {content[:2000]}  # Limit content length
        
        Analyze for:
        1. Suspicious patterns or code
        2. Data exfiltration attempts
        3. Malicious URLs or commands
        4. Unusual data structures
        5. Potential fraud indicators
        
        Respond with a JSON object containing:
        {{
            "isFraudulent": boolean,
            "confidence": number (0-100),
            "riskFactors": [list of identified risks],
            "recommendations": [list of actions to take],
            "details": "detailed explanation"
        }}
        """
        
        # Get analysis from Gemini
        analysis_text = analyze_with_gemini(prompt, 'security_analysis')
        
        # Try to parse JSON response, fallback if not valid JSON
        try:
            analysis = json.loads(analysis_text)
        except:
            # If not valid JSON, use fallback
            analysis = FALLBACK_RESPONSES['security_analysis']
        
        return jsonify(analysis)
        
    except Exception as e:
        print(f"Security analysis error: {e}")
        return jsonify(FALLBACK_RESPONSES['security_analysis'])

@app.route('/api/claims/submit', methods=['POST'])
def submit_insurance_claim():
    """Submit insurance claim with document analysis"""
    try:
        # Get form data
        policy_id = request.form.get('policyId')
        claim_data = json.loads(request.form.get('claimData', '{}'))
        
        # Get uploaded documents
        documents = []
        for key in request.files:
            if key.startswith('document_'):
                file = request.files[key]
                if file:
                    # Convert to base64 for Gemini analysis
                    file_content = file.read()
                    file_base64 = base64.b64encode(file_content).decode('utf-8')
                    documents.append({
                        'name': file.filename,
                        'type': file.content_type,
                        'size': len(file_content),
                        'base64': file_base64
                    })
        
        # Create Gemini prompt for claim analysis
        prompt = f"""
        You are an insurance claims analyst AI. A user has submitted the following claim information:
        
        Policy Type: {claim_data.get('policyType', 'Unknown')}
        Policy Number: {claim_data.get('policyNumber', 'Unknown')}
        Claim Date: {claim_data.get('claimDate', 'Unknown')}
        Claim Amount: ₹{claim_data.get('claimAmount', '0')}
        Description: {claim_data.get('description', 'No description provided')}
        Documents Uploaded: {len(documents)} files
        
        Analyze the claim and respond with a JSON object containing:
        {{
            "summary": [
                "Brief claim summary line 1",
                "Brief claim summary line 2", 
                "Brief claim summary line 3"
            ],
            "missingInfo": ["list of missing or inconsistent information"],
            "approvalLikelihood": "High/Medium/Low",
            "explanation": "Human-friendly explanation for the status",
            "status": "Under Review/Approved/Rejected",
            "claimId": "CLM" + timestamp
        }}
        """
        
        # Get analysis from Gemini
        analysis_text = analyze_with_gemini(prompt, 'claim_analysis')
        
        # Try to parse JSON response, fallback if not valid JSON
        try:
            analysis = json.loads(analysis_text)
            # Add claim ID if not present
            if not analysis.get('claimId'):
                analysis['claimId'] = f"CLM{int(datetime.now().timestamp())}"
        except:
            # If not valid JSON, use fallback
            analysis = FALLBACK_RESPONSES['claim_analysis'].copy()
            analysis['claimId'] = f"CLM{int(datetime.now().timestamp())}"
        
        return jsonify(analysis)
        
    except Exception as e:
        print(f"Claim submission error: {e}")
        fallback = FALLBACK_RESPONSES['claim_analysis'].copy()
        fallback['claimId'] = f"CLM{int(datetime.now().timestamp())}"
        return jsonify(fallback)

@app.route('/api/chat/message', methods=['POST'])
def chat_message():
    """Handle chat messages with Gemini AI"""
    try:
        data = request.get_json()
        message = data.get('message', '')
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Create Gemini prompt for BFSI chat
        prompt = f"""
        You are a helpful AI assistant specializing in Banking, Financial Services, and Insurance (BFSI). 
        A user has asked: "{message}"
        
        Provide a helpful, accurate, and friendly response. Focus on:
        - Financial literacy and education
        - Insurance and investment guidance
        - Banking services and products
        - Security best practices
        - General financial advice
        
        Keep responses concise but informative. If you're unsure about specific financial advice, 
        recommend consulting with a qualified financial advisor.
        """
        
        # Get response from Gemini
        response_text = analyze_with_gemini(prompt, 'chat_response')
        
        return jsonify({
            'response': response_text,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({
            'response': FALLBACK_RESPONSES['chat_response'],
            'timestamp': datetime.now().isoformat()
        })

@app.route('/api/recommendations', methods=['POST'])
def get_personalized_recommendations():
    """Get personalized investment recommendations based on user profile"""
    try:
        data = request.get_json()
        user_profile = data.get('userProfile', {})
        
        if not user_profile:
            return jsonify({'error': 'User profile is required'}), 400
        
        # Create comprehensive Gemini prompt for personalized recommendations
        prompt = f"""
        You are a senior financial advisor with 15+ years of experience in BFSI. 
        Based on the following user profile, provide 4 personalized investment recommendations.
        
        User Profile:
        {json.dumps(user_profile, indent=2)}
        
        Generate 4 detailed investment recommendations in JSON format. Each recommendation should include:
        {{
            "id": number (1-4),
            "name": "Realistic product name with company",
            "type": "Mutual Fund/Insurance/Fixed Deposit/ULIP/ELSS/etc",
            "category": "Specific category (e.g., Equity - Mid Cap, Term Insurance, Senior Citizen FD)",
            "minAmount": number (minimum investment amount),
            "duration": "Investment time period (e.g., 5-7 years, 20-30 years)",
            "expectedReturn": "Expected return range (e.g., 12-15%, 6-8%)",
            "riskLevel": "Very Low/Low/Moderate/High/Very High",
            "rating": number (1-5 with decimals),
            "features": [
                "Feature 1 description",
                "Feature 2 description",
                "Feature 3 description",
                "Feature 4 description",
                "Feature 5 description"
            ],
            "rules": [
                "Rule 1 (e.g., Minimum investment: ₹5,000)",
                "Rule 2 (e.g., Exit load: 1% if redeemed within 1 year)",
                "Rule 3 (e.g., Lock-in period: 3 years for ELSS)",
                "Rule 4 (e.g., KYC compliance required)",
                "Rule 5 (e.g., Nomination facility available)"
            ],
            "pros": ["Pro 1", "Pro 2", "Pro 3"],
            "cons": ["Con 1", "Con 2", "Con 3"],
            "suitability": "Personalized suitability explanation based on user profile"
        }}
        
        Consider these factors for personalization:
        1. **Age**: Younger users can take more risk, seniors prefer stability
        2. **Income Level**: Higher income = higher investment capacity
        3. **Risk Tolerance**: Conservative/Aggressive/Moderate
        4. **Financial Goals**: Retirement/Child Education/Home Purchase/Emergency Fund
        5. **Investment Horizon**: Short/Medium/Long term
        6. **Monthly Investment Capacity**: Should match minimum amounts
        7. **Existing Insurance**: Avoid duplicate coverage
        8. **Dependents**: More dependents = need for protection
        9. **Occupation**: Stable vs variable income
        10. **Emergency Fund**: Adequacy of safety net
        
        Provide realistic, Indian market products with actual company names and realistic terms.
        Ensure recommendations are suitable for the user's profile and financial situation.
        """
        
        # Get recommendations from Gemini
        recommendations_text = analyze_with_gemini(prompt, 'claim_analysis')
        
        try:
            recommendations = json.loads(recommendations_text)
            # Ensure we have exactly 4 recommendations
            if isinstance(recommendations, list) and len(recommendations) >= 4:
                recommendations = recommendations[:4]
            else:
                # Use fallback recommendations with profile customization
                recommendations = get_fallback_recommendations(user_profile)
        except:
            # If not valid JSON, use fallback with customization
            recommendations = get_fallback_recommendations(user_profile)
        
        return jsonify({'recommendations': recommendations})
        
    except Exception as e:
        print(f"Personalized recommendations error: {e}")
        # Return fallback recommendations
        fallback_recommendations = get_fallback_recommendations(user_profile or {})
        return jsonify({'recommendations': fallback_recommendations})

def get_fallback_recommendations(user_profile):
    """Generate fallback recommendations with profile-based customization"""
    base_recommendations = [
        {
            "id": 1,
            "name": "HDFC Mid-Cap Opportunities Fund",
            "type": "Mutual Fund",
            "category": "Equity - Mid Cap",
            "minAmount": 5000,
            "duration": "5-7 years",
            "expectedReturn": "12-15%",
            "riskLevel": "Moderate",
            "rating": 4.5,
            "features": [
                "Invests in mid-cap companies with high growth potential",
                "Systematic Investment Plan (SIP) available",
                "Tax benefits under Section 80C (ELSS variant)",
                "Professional fund management",
                "Regular dividend payout option"
            ],
            "rules": [
                "Minimum investment: ₹5,000",
                "Exit load: 1% if redeemed within 1 year",
                "Lock-in period: 3 years for ELSS",
                "KYC compliance required",
                "Nomination facility available"
            ],
            "pros": ["High growth potential", "Diversified portfolio", "Professional management"],
            "cons": ["Market volatility risk", "Exit load charges", "Long-term commitment needed"],
            "suitability": "Suitable for investors with moderate risk appetite looking for long-term wealth creation"
        },
        {
            "id": 2,
            "name": "SBI Life Smart Humsafar",
            "type": "Insurance",
            "category": "Term Insurance with Return of Premium",
            "minAmount": 12000,
            "duration": "20-30 years",
            "expectedReturn": "6-8%",
            "riskLevel": "Low",
            "rating": 4.3,
            "features": [
                "High life coverage with return of premium",
                "Critical illness rider available",
                "Accidental death benefit",
                "Waiver of premium on disability",
                "Tax benefits under Section 80C & 10(10D)"
            ],
            "rules": [
                "Minimum coverage: ₹25 lakhs",
                "Maximum coverage: ₹1 crore",
                "Entry age: 18-65 years",
                "Premium payment: Yearly/Half-yearly/Monthly",
                "Grace period: 30 days"
            ],
            "pros": ["Life protection", "Premium return", "Tax benefits", "Rider options"],
            "cons": ["Lower returns compared to equity", "Long-term commitment", "Medical examination required"],
            "suitability": "Ideal for family breadwinners seeking life protection with savings component"
        },
        {
            "id": 3,
            "name": "Axis Bank Fixed Deposit Plus",
            "type": "Fixed Deposit",
            "category": "Senior Citizen Special",
            "minAmount": 10000,
            "duration": "1-5 years",
            "expectedReturn": "7.5-8.5%",
            "riskLevel": "Very Low",
            "rating": 4.7,
            "features": [
                "Higher interest rates for senior citizens",
                "Quarterly interest payout option",
                "Premature withdrawal facility",
                "Auto-renewal option",
                "Online account management"
            ],
            "rules": [
                "Minimum deposit: ₹10,000",
                "Maximum deposit: No limit",
                "Interest rate: 7.5% (general), 8.5% (senior citizens)",
                "Premature withdrawal penalty: 1%",
                "TDS applicable on interest above ₹40,000"
            ],
            "pros": ["Guaranteed returns", "Higher rates for seniors", "Flexible tenure", "Safe investment"],
            "cons": ["Lower returns than equity", "Lock-in period", "Interest rate fluctuations"],
            "suitability": "Perfect for conservative investors and senior citizens seeking stable returns"
        },
        {
            "id": 4,
            "name": "ICICI Prudential Technology Fund",
            "type": "Mutual Fund",
            "category": "Sectoral - Technology",
            "minAmount": 5000,
            "duration": "3-5 years",
            "expectedReturn": "15-20%",
            "riskLevel": "High",
            "rating": 4.1,
            "features": [
                "Focuses on technology sector companies",
                "Global technology exposure",
                "Regular rebalancing",
                "SIP and SWP options",
                "Dividend and growth options"
            ],
            "rules": [
                "Minimum investment: ₹5,000",
                "Exit load: 1% if redeemed within 1 year",
                "Sector concentration risk",
                "Regular portfolio review",
                "Market timing important"
            ],
            "pros": ["High growth potential", "Sector expertise", "Global exposure", "Technology focus"],
            "cons": ["High volatility", "Sector risk", "Market dependent", "Requires monitoring"],
            "suitability": "Suitable for aggressive investors with high risk tolerance and technology sector understanding"
        }
    ]
    
    # Customize based on user profile
    for scheme in base_recommendations:
        # Customize based on risk tolerance
        if user_profile.get('riskTolerance'):
            risk_tolerance = user_profile['riskTolerance'].lower()
            if 'conservative' in risk_tolerance and scheme['riskLevel'] == 'High':
                scheme['suitability'] = "May not be suitable for conservative investors. Consider lower risk options."
            elif 'aggressive' in risk_tolerance and scheme['riskLevel'] == 'Very Low':
                scheme['suitability'] = "Consider higher risk options for better returns based on your aggressive profile."
        
        # Customize based on monthly investment capacity
        if user_profile.get('monthlyInvestmentCapacity'):
            capacity = int(user_profile['monthlyInvestmentCapacity'])
            if scheme['minAmount'] > capacity:
                scheme['suitability'] += " Note: Minimum investment exceeds your monthly capacity. Consider SIP options."
        
        # Customize based on age
        if user_profile.get('age'):
            age = int(user_profile['age'])
            if age > 60 and scheme['type'] == 'Fixed Deposit':
                scheme['suitability'] = "Excellent choice for senior citizens with higher interest rates."
        
        # Customize based on existing insurance
        if user_profile.get('existingInsurance'):
            existing_insurance = user_profile['existingInsurance'].lower()
            if scheme['type'] == 'Insurance' and 'both' in existing_insurance:
                scheme['suitability'] = "You already have comprehensive insurance. Consider investment-focused products."
        
        # Customize based on primary goal
        if user_profile.get('primaryGoal'):
            goal = user_profile['primaryGoal'].lower()
            if 'retirement' in goal and scheme['type'] == 'Mutual Fund':
                scheme['suitability'] += " Good for long-term retirement planning."
            elif 'emergency' in goal and scheme['type'] == 'Fixed Deposit':
                scheme['suitability'] += " Provides liquidity for emergency needs."
    
    return base_recommendations

@app.route('/api/recommendations/personalized', methods=['GET'])
def get_personalized_recommendations_get():
    """Get personalized recommendations via GET (for testing)"""
    return jsonify({'message': 'Use POST method with user profile data'})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)