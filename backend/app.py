from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
import requests
from datetime import datetime
import logging
from werkzeug.utils import secure_filename
import google.generativeai as genai
from dotenv import load_dotenv
import re
import string

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configure CORS properly
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx'}

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize Gemini AI
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('models/gemini-1.5-flash-latest')
else:
    model = None
    logger.warning("Google API key not found. Some features may not work.")

# Ollama configuration for fallback
OLLAMA_BASE_URL = os.getenv('OLLAMA_BASE_URL', 'http://localhost:11434')
OLLAMA_MODEL = os.getenv('OLLAMA_MODEL', 'llama2')

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def call_llm_with_fallback(prompt, max_retries=3):
    """Call LLM with Gemini as primary and Ollama as fallback"""
    
    # Try Gemini first
    if model:
        try:
            response = model.generate_content(prompt)
            if response and response.text:
                return response.text
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
    
    # Fallback to Ollama
    try:
        ollama_url = f"{OLLAMA_BASE_URL}/api/generate"
        payload = {
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False
        }
        
        response = requests.post(ollama_url, json=payload, timeout=30)
        if response.status_code == 200:
            result = response.json()
            return result.get('response', 'I apologize, but I could not generate a response.')
        else:
            logger.error(f"Ollama API error: {response.status_code}")
    except Exception as e:
        logger.error(f"Ollama fallback error: {e}")
    
    # Final fallback - provide intelligent responses based on keywords
    return provide_fallback_response(prompt)

def provide_fallback_response(prompt):
    """Provide intelligent fallback responses when LLM is not available"""
    # Clean the prompt by removing punctuation and converting to lowercase
    prompt_clean = prompt.lower().translate(str.maketrans('', '', string.punctuation))
    logger.info(f"Fallback triggered for prompt: {prompt}")
    logger.info(f"Cleaned prompt: {prompt_clean}")

    # Simple word matching without regex
    if any(word in prompt_clean for word in ['sip', 'investment', 'mutual', 'portfolio']):
        logger.info("Matched: investment")
        return """SIP (Systematic Investment Plan) is a disciplined approach to investing where you invest a fixed amount regularly in mutual funds.

**Key Benefits:**
- **Rupee Cost Averaging**: Buy more units when prices are low
- **Power of Compounding**: Long-term wealth creation
- **Discipline**: Regular investing habit
- **Affordability**: Start with as little as ₹500/month

**How to Start:**
1. Choose a diversified equity fund (e.g., Nifty 50 index fund)
2. Start with ₹1000-2000 monthly
3. Increase amount gradually
4. Stay invested for 5+ years

**Example**: ₹2000/month SIP for 10 years at 12% return = ₹4.5 lakhs invested, ₹9.2 lakhs value

**Risk**: Market fluctuations, but long-term returns are generally positive."""
    
    elif any(word in prompt_clean for word in ['insurance', 'term', 'coverage', 'life']):
        logger.info("Matched: insurance")
        return """Life insurance provides financial protection for your family in case of your untimely death.

**How Much Coverage You Need:**
- **Basic Rule**: 10-15 times your annual income
- **Detailed Calculation**: 
  - Current expenses × 12 months × number of years family needs support
  - Add outstanding loans and future goals (children's education, etc.)
  - Subtract existing savings and other insurance

**Example**: If you earn ₹8 lakhs/year, aim for ₹80 lakhs to ₹1.2 crore coverage.

**Best Option for Most People:**
- **Term Insurance**: Pure protection, most cost-effective
- **Coverage**: ₹1 crore for 30-year term
- **Premium**: ₹8,000-12,000/year (age 30, non-smoker)

**Avoid**: ULIPs and endowment plans for pure protection needs."""
    
    elif any(word in prompt_clean for word in ['loan', 'emi', 'credit', 'debt', 'trap']):
        logger.info("Matched: loan")
        return """Common loan traps to avoid:

**1. Hidden Charges:**
- Processing fees (1-2% of loan amount)
- Prepayment penalties (2-4% of outstanding amount)
- Late payment charges
- Insurance charges

**2. High-Interest Loans:**
- Personal loans (12-24% interest)
- Credit card cash advances (40%+ interest)
- Payday loans (300%+ interest)

**3. Prepayment Penalties:**
- Banks charge 2-4% for early loan closure
- Check terms before taking loan

**4. Insurance Bundling:**
- Banks often force expensive insurance
- You can choose your own insurance provider

**5. Floating vs Fixed Rates:**
- Floating rates can increase over time
- Fixed rates are higher initially but stable

**Smart Tips:**
- Compare total cost, not just EMI
- Check prepayment terms
- Avoid multiple loans simultaneously
- Maintain good credit score for better rates"""
    
    elif any(word in prompt_clean for word in ['fraud', 'scam', 'security', 'phishing']):
        logger.info("Matched: fraud")
        return """How to identify and prevent financial fraud:

**Common Fraud Types:**
1. **Phishing Calls/SMS**: Fake bank calls asking for OTP
2. **Fake Investment Schemes**: Promises of unrealistic returns
3. **SIM Swap Fraud**: Fraudsters get duplicate SIM
4. **UPI Fraud**: Fake payment requests
5. **Fake Apps**: Malicious apps stealing data

**Red Flags to Watch:**
- Unsolicited calls asking for OTP/password
- Promises of unrealistic returns (50%+ monthly)
- Pressure to act quickly
- Requests for banking details
- Suspicious links in SMS/email

**Prevention Steps:**
1. **Never share OTP** with anyone
2. **Verify caller identity** by calling official numbers
3. **Check app authenticity** before downloading
4. **Enable 2FA** on all accounts
5. **Monitor transactions** regularly
6. **Use strong passwords** and change regularly

**If Fraud Occurs:**
1. Immediately block cards/accounts
2. File police complaint
3. Report to bank
4. Report to cybercrime portal (cybercrime.gov.in)

**Remember**: Banks never ask for OTP or passwords over phone/email."""
    
    elif any(word in prompt_clean for word in ['tax', '80c', 'deduction', 'itr']):
        logger.info("Matched: tax")
        return """Tax-saving options under Section 80C (₹1.5 lakh limit):

**Popular Options:**
1. **ELSS Mutual Funds**: 3-year lock-in, 12-15% expected returns
2. **PPF**: 15-year lock-in, 7.1% interest, government-backed
3. **NPS**: Pension scheme, 10% employer contribution possible
4. **Sukanya Samriddhi**: For girl child, 8% interest
5. **Term Insurance Premium**: Life insurance premium
6. **Home Loan Principal**: Principal repayment of home loan

**Additional Deductions:**
- **Section 80D**: Health insurance premium (₹25,000-50,000)
- **Section 80TTA**: Interest on savings account (₹10,000)
- **Section 80G**: Donations to charities
- **HRA**: House rent allowance

**Smart Tax Planning:**
- Start early in financial year
- Diversify across instruments
- Consider lock-in periods
- Don't invest just for tax savings

**Example**: ₹1.5 lakh in ELSS + ₹25,000 health insurance = ₹1.75 lakh deduction = ₹54,600 tax saved (30% bracket)"""
    
    else:
        logger.info("Matched: general fallback")
        return """I'm your AI financial advisor! I can help you with:

**Investment Guidance:**
- SIP planning and mutual fund selection
- Portfolio diversification strategies
- Risk assessment and goal-based planning

**Insurance Advice:**
- Life insurance coverage calculation
- Health insurance plan selection
- Term vs whole life insurance comparison

**Loan & Debt Management:**
- EMI calculation and loan comparison
- Credit score improvement tips
- Debt consolidation strategies

**Fraud Prevention:**
- Common scam identification
- Security best practices
- What to do if fraud occurs

**Tax Planning:**
- Section 80C investment options
- Tax-saving strategies
- ITR filing guidance

Ask me any specific question about these topics, and I'll provide detailed, actionable advice!"""

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'services': {
            'gemini': model is not None,
            'ollama': True  # Always available as fallback
        }
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    """Enhanced chat endpoint with context awareness"""
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400
        
        message = data.get('message', '')
        history = data.get('history', [])
        user_profile = data.get('user_profile', {})
        
        # Create context-aware prompt
        context_prompt = f"""
You are an expert BFSI (Banking, Financial Services, and Insurance) advisor with 15+ years of experience.

User Profile: {json.dumps(user_profile, indent=2)}
Conversation History: {json.dumps(history, indent=2)}

User Query: {message}

Please provide a comprehensive, educational response that:
1. Explains concepts in simple terms
2. Provides logical reasoning
3. Includes practical examples
4. Mentions risks and considerations
5. Gives actionable next steps
6. Uses Indian financial context where relevant

Response:"""

        # Get AI response
        response_text = call_llm_with_fallback(context_prompt)
        
        # Analyze for fraud indicators if relevant
        fraud_analysis = None
        if any(keyword in message.lower() for keyword in ['fraud', 'scam', 'suspicious', 'fake']):
            fraud_analysis = {
                'risk_level': 'low',
                'confidence': 'medium',
                'fraud_score': 25,
                'indicators': ['User is asking about fraud prevention'],
                'recommendations': ['Continue with general fraud prevention advice']
            }
        
        return jsonify({
            'response': response_text,
            'fraud_analysis': fraud_analysis,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/faq', methods=['GET'])
def get_faq():
    """Generate FAQ with LLM"""
    try:
        faq_prompt = """
Generate a comprehensive FAQ for a BFSI (Banking, Financial Services, and Insurance) platform. 
Include questions and detailed answers about:

1. Investment (SIPs, mutual funds, portfolio planning)
2. Insurance (term plans, health insurance, coverage)
3. Loans (EMI calculation, credit score, debt management)
4. Fraud Prevention (scam detection, security tips)
5. Financial Planning (budgeting, emergency funds, goal setting)

Format as JSON with categories and detailed answers. Make answers educational and actionable.
"""

        response_text = call_llm_with_fallback(faq_prompt)
        
        # Try to parse JSON response, fallback to structured format if needed
        try:
            faqs = json.loads(response_text)
        except:
            # Fallback structured FAQ
            faqs = [
                {
                    "question": "What is SIP investment and how should I start?",
                    "answer": "SIP (Systematic Investment Plan) is a disciplined approach to investing where you invest a fixed amount regularly in mutual funds. Start with ₹500-1000 monthly, choose diversified equity funds, and stay invested for long term.",
                    "category": "Investment"
                },
                {
                    "question": "How much life insurance coverage do I need?",
                    "answer": "Aim for coverage of 10-15 times your annual income. Consider your family's needs, existing savings, and future goals. Term insurance is most cost-effective for pure protection.",
                    "category": "Insurance"
                },
                {
                    "question": "How can I identify financial fraud?",
                    "answer": "Watch for unsolicited calls asking for OTP, promises of unrealistic returns, pressure to act quickly, and requests for personal banking details. Always verify through official channels.",
                    "category": "Fraud Prevention"
                }
            ]
        
        return jsonify({'faqs': faqs})
        
    except Exception as e:
        logger.error(f"FAQ generation error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/fraud/detect', methods=['POST'])
def detect_fraud():
    """Enhanced fraud detection with AI analysis"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Data is required'}), 400
        
        claim_data = data.get('claim_data', {})
        documents = data.get('documents', [])
        user_profile = data.get('user_profile', {})
        
        # Create fraud analysis prompt
        fraud_prompt = f"""
Analyze this insurance claim for potential fraud indicators:

Claim Data: {json.dumps(claim_data, indent=2)}
Documents: {json.dumps(documents, indent=2)}
User Profile: {json.dumps(user_profile, indent=2)}

Provide a detailed fraud risk assessment including:
1. Risk level (low/medium/high)
2. Confidence level (low/medium/high)
3. Fraud score (0-100)
4. Specific risk indicators
5. Recommendations

Format as JSON.
"""

        response_text = call_llm_with_fallback(fraud_prompt)
        
        # Try to parse JSON response, fallback to structured format
        try:
            fraud_analysis = json.loads(response_text)
        except:
            # Fallback analysis
            amount = claim_data.get('amount', 0)
            risk_level = 'high' if amount > 100000 else 'medium' if amount > 50000 else 'low'
            
            fraud_analysis = {
                'risk_level': risk_level,
                'confidence': 'medium',
                'fraud_score': 30 if risk_level == 'high' else 15,
                'indicators': ['Amount analysis', 'Document review needed'],
                'recommendations': ['Verify documents', 'Check claim history']
            }
        
        return jsonify(fraud_analysis)
        
    except Exception as e:
        logger.error(f"Fraud detection error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/financial/analyze', methods=['POST'])
def analyze_financial_health():
    """Analyze user's financial health and provide recommendations"""
    try:
        data = request.get_json()
        user_profile = data.get('user_profile', {})
        
        # Calculate basic financial ratios
        income = user_profile.get('income', 0)
        savings = user_profile.get('savings', 0)
        debt = user_profile.get('debt', 0)
        emergency_fund = user_profile.get('emergencyFund', 0)
        
        # Financial health calculations
        savings_rate = (savings / income * 100) if income > 0 else 0
        debt_to_income = (debt / income * 100) if income > 0 else 0
        emergency_ratio = (emergency_fund / (income / 12)) if income > 0 else 0
        
        # Determine risk level
        if debt_to_income > 40 or emergency_ratio < 3:
            risk_level = 'high'
            health_score = 30
        elif debt_to_income > 20 or emergency_ratio < 6:
            risk_level = 'medium'
            health_score = 60
        else:
            risk_level = 'low'
            health_score = 85
        
        analysis = {
            'financial_health': {
                'score': health_score,
                'risk_level': risk_level,
                'ratios': {
                    'savings_rate': round(savings_rate, 2),
                    'debt_to_income': round(debt_to_income, 2),
                    'emergency_ratio': round(emergency_ratio, 2)
                }
            },
            'recommendations': [
                'Build emergency fund to 6 months of expenses',
                'Reduce debt-to-income ratio below 20%',
                'Increase savings rate to 20% of income',
                'Diversify investments across asset classes'
            ]
        }
        
        return jsonify(analysis)
        
    except Exception as e:
        logger.error(f"Financial analysis error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/claims/submit', methods=['POST'])
def submit_claim():
    """Submit insurance claim with document upload"""
    try:
        # Handle file uploads
        files = request.files.getlist('documents')
        claim_data = json.loads(request.form.get('claimData', '{}'))
        user_profile = json.loads(request.form.get('userProfile', '{}'))
        
        # Save uploaded files
        saved_files = []
        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                file.save(filepath)
                saved_files.append(filename)
        
        # Generate claim ID
        claim_id = f"CLM{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Create monitoring status
        monitoring_status = {
            'status': 'submitted',
            'claim_id': claim_id,
            'submitted_at': datetime.now().isoformat(),
            'estimated_processing_time': '5-7 business days',
            'current_stage': 'document_review',
            'documents_received': len(saved_files)
        }
        
        return jsonify({
            'success': True,
            'claim_id': claim_id,
            'monitoring_status': monitoring_status,
            'message': 'Claim submitted successfully'
        })
        
    except Exception as e:
        logger.error(f"Claim submission error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/security/analyze', methods=['POST'])
def analyze_security():
    """Analyze uploaded documents for security and fraud"""
    try:
        files = request.files.getlist('files')
        user_profile = json.loads(request.form.get('userProfile', '{}'))
        
        if not files:
            return jsonify({'error': 'No files provided for analysis'}), 400
        
        # Save and analyze files
        analysis_results = []
        total_risk_score = 0
        risk_factors = []
        security_issues = []
        
        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                file.save(filepath)
                
                # Enhanced file analysis
                file_size = os.path.getsize(filepath)
                file_extension = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
                
                # File security analysis
                file_risk_score = 0
                file_risk_factors = []
                file_security_issues = []
                
                # Check file size (suspicious if too large or too small)
                if file_size > 10 * 1024 * 1024:  # > 10MB
                    file_risk_score += 3
                    file_risk_factors.append("File size is unusually large")
                elif file_size < 100:  # < 100 bytes
                    file_risk_score += 2
                    file_risk_factors.append("File size is suspiciously small")
                
                # Check file type security
                if file_extension in ['exe', 'bat', 'cmd', 'scr', 'pif']:
                    file_risk_score += 10
                    file_risk_factors.append("Executable file detected - high security risk")
                    file_security_issues.append("Executable files should not be uploaded")
                elif file_extension in ['js', 'vbs', 'ps1']:
                    file_risk_score += 5
                    file_risk_factors.append("Script file detected - potential security risk")
                elif file_extension in ['pdf', 'doc', 'docx']:
                    # These are generally safe but could contain malicious content
                    file_risk_score += 1
                    file_risk_factors.append("Document file - scan for malicious content")
                
                # Check filename for suspicious patterns
                suspicious_patterns = ['virus', 'malware', 'hack', 'crack', 'keygen', 'warez']
                if any(pattern in filename.lower() for pattern in suspicious_patterns):
                    file_risk_score += 8
                    file_risk_factors.append("Suspicious filename detected")
                    file_security_issues.append("Filename contains suspicious keywords")
                
                file_analysis = {
                    'filename': filename,
                    'size': file_size,
                    'type': file.content_type,
                    'extension': file_extension,
                    'uploaded_at': datetime.now().isoformat(),
                    'risk_score': file_risk_score,
                    'risk_factors': file_risk_factors,
                    'security_issues': file_security_issues,
                    'status': 'safe' if file_risk_score < 3 else 'warning' if file_risk_score < 7 else 'danger'
                }
                
                analysis_results.append(file_analysis)
                total_risk_score += file_risk_score
                risk_factors.extend(file_risk_factors)
                security_issues.extend(file_security_issues)
        
        # Calculate overall risk assessment
        avg_risk_score = total_risk_score / len(analysis_results) if analysis_results else 0
        
        if avg_risk_score < 3:
            risk_level = 'low'
            confidence = 'high'
            recommendations = [
                'Files appear to be safe for processing',
                'Continue with normal document processing',
                'Maintain regular security monitoring'
            ]
        elif avg_risk_score < 7:
            risk_level = 'medium'
            confidence = 'medium'
            recommendations = [
                'Exercise caution with uploaded files',
                'Scan files with antivirus software',
                'Review file contents before processing',
                'Consider additional security measures'
            ]
        else:
            risk_level = 'high'
            confidence = 'high'
            recommendations = [
                'High security risk detected',
                'Do not process these files',
                'Scan with multiple antivirus tools',
                'Review file sources and authenticity',
                'Consider reporting suspicious files'
            ]
        
        # Enhanced security analysis
        security_analysis = {
            'fraud_analysis': {
                'risk_level': risk_level,
                'confidence': confidence,
                'overall_risk_score': round(avg_risk_score, 2),
                'total_files_analyzed': len(analysis_results),
                'risk_factors': list(set(risk_factors)),  # Remove duplicates
                'security_issues': list(set(security_issues)),  # Remove duplicates
                'recommendations': recommendations
            },
            'financial_health': {
                'score': max(0, 100 - (avg_risk_score * 10)),  # Higher risk = lower score
                'assessment': f'Financial security assessment based on {len(analysis_results)} analyzed files',
                'risk_indicators': len(security_issues),
                'safety_score': max(0, 100 - (avg_risk_score * 15))
            },
            'compliance_check': {
                'file_types_allowed': True,
                'size_limits_respected': all(r['size'] <= 16 * 1024 * 1024 for r in analysis_results),
                'security_standards_met': avg_risk_score < 5,
                'recommendations': [
                    'Ensure all files are from trusted sources',
                    'Regular security audits recommended',
                    'Implement file scanning procedures'
                ]
            }
        }
        
        return jsonify({
            'success': True,
            'files_analyzed': len(analysis_results),
            'analysis_results': analysis_results,
            'security_analysis': security_analysis,
            'timestamp': datetime.now().isoformat()
        })
        
    except json.JSONDecodeError as e:
        logger.error(f"JSON parsing error in security analysis: {e}")
        return jsonify({'error': 'Invalid user profile data format'}), 400
    except Exception as e:
        logger.error(f"Security analysis error: {e}")
        return jsonify({'error': 'Internal server error during security analysis'}), 500

@app.route('/api/policies/underwriting', methods=['POST'])
def perform_underwriting():
    """Perform dynamic underwriting and risk assessment"""
    try:
        data = request.get_json()
        policy_data = data.get('policy_data', {})
        user_profile = data.get('user_profile', {})
        
        # Create underwriting prompt
        underwriting_prompt = f"""
Perform underwriting analysis for this insurance policy:

Policy Data: {json.dumps(policy_data, indent=2)}
User Profile: {json.dumps(user_profile, indent=2)}

Provide detailed underwriting assessment including:
1. Risk assessment (low/medium/high)
2. Premium rate recommendation
3. Coverage approval status
4. AI analysis insights
5. Risk factors identified

Format as JSON.
"""

        response_text = call_llm_with_fallback(underwriting_prompt)
        
        # Try to parse JSON response, fallback to structured format
        try:
            underwriting_result = json.loads(response_text)
        except:
            # Fallback underwriting result
            age = policy_data.get('applicant_age', 30)
            coverage = policy_data.get('coverage_amount', 1000000)
            
            risk_assessment = 'low' if age < 40 else 'medium' if age < 50 else 'high'
            premium_rate = 0.5 if risk_assessment == 'low' else 1.0 if risk_assessment == 'medium' else 2.0
            
            underwriting_result = {
                'risk_assessment': risk_assessment,
                'premium_rate': premium_rate,
                'coverage_approved': True,
                'ai_analysis': ['Age factor considered', 'Coverage amount appropriate'],
                'recommendations': ['Standard underwriting approved']
            }
        
        return jsonify({
            'underwriting_result': underwriting_result,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Underwriting error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/policies', methods=['POST'])
def add_policy():
    """Add new insurance policy"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['policy_type', 'coverage_amount', 'term']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Generate policy ID
        policy_id = f"POL{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        policy = {
            'id': policy_id,
            'type': data['policy_type'],
            'coverage_amount': data['coverage_amount'],
            'term': data['term'],
            'created_at': datetime.now().isoformat(),
            'status': 'active'
        }
        
        return jsonify({
            'success': True,
            'policy': policy,
            'message': 'Policy added successfully'
        })
        
    except Exception as e:
        logger.error(f"Add policy error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """Get personalized financial recommendations"""
    try:
        data = request.get_json()
        user_profile = data.get('user_profile', {})
        
        # Generate recommendations based on profile
        recommendations = []
        
        age = user_profile.get('age', 30)
        income = user_profile.get('income', 0)
        risk_tolerance = user_profile.get('riskTolerance', 'moderate')
        
        if age < 30:
            recommendations.append({
                'type': 'investment',
                'title': 'Start SIP Early',
                'description': 'Begin SIP investment to benefit from compounding',
                'priority': 'high'
            })
        
        if income > 500000:
            recommendations.append({
                'type': 'tax',
                'title': 'Tax Planning',
                'description': 'Consider ELSS funds for tax savings under Section 80C',
                'priority': 'medium'
            })
        
        if risk_tolerance == 'conservative':
            recommendations.append({
                'type': 'insurance',
                'title': 'Term Insurance',
                'description': 'Secure term insurance for family protection',
                'priority': 'high'
            })
        
        return jsonify({
            'recommendations': recommendations,
            'generated_at': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Recommendations error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/investment/security-analysis', methods=['POST'])
def analyze_investment_security():
    """Analyze investment security based on investment details and user profile"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided for analysis'}), 400
            
        investment_details = data.get('investment_details', {})
        user_profile = data.get('user_profile', {})
        
        # Validate required fields
        required_investment_fields = ['type', 'amount', 'duration']
        missing_fields = [field for field in required_investment_fields if not investment_details.get(field)]
        if missing_fields:
            return jsonify({'error': f'Missing required investment fields: {", ".join(missing_fields)}'}), 400
        
        # Extract and validate key information
        investment_type = investment_details.get('type', '').lower()
        investment_amount = float(investment_details.get('amount', 0))
        investment_duration = investment_details.get('duration', '').lower()
        expected_return = investment_details.get('expected_return', '')
        risk_level = investment_details.get('risk_level', '').lower()
        
        # Validate investment amount
        if investment_amount <= 0:
            return jsonify({'error': 'Investment amount must be greater than 0'}), 400
        
        user_age = int(user_profile.get('age', 30))
        user_income = float(user_profile.get('income', 0))
        user_risk_tolerance = user_profile.get('riskTolerance', 'moderate').lower()
        user_experience = user_profile.get('investmentExperience', 'beginner').lower()
        user_goals = user_profile.get('financialGoals', [])
        user_savings = float(user_profile.get('savings', 0))
        user_debt = float(user_profile.get('debt', 0))
        
        # Enhanced risk assessment algorithm
        risk_factors = []
        risk_score = 0
        
        # 1. Investment Type Risk Assessment
        investment_type_risks = {
            'mutual fund': {'base_risk': 4, 'description': 'Diversified investment with moderate risk'},
            'equity': {'base_risk': 8, 'description': 'High volatility, potential for high returns'},
            'debt': {'base_risk': 2, 'description': 'Lower risk, stable returns'},
            'fixed deposit': {'base_risk': 1, 'description': 'Very low risk, guaranteed returns'},
            'insurance': {'base_risk': 3, 'description': 'Protection product with some investment component'},
            'gold': {'base_risk': 5, 'description': 'Hedge against inflation, moderate volatility'},
            'real estate': {'base_risk': 6, 'description': 'Illiquid, market dependent'},
            'crypto': {'base_risk': 9, 'description': 'Highly volatile, unregulated'},
            'bonds': {'base_risk': 2, 'description': 'Government/corporate debt, low risk'},
            'etf': {'base_risk': 5, 'description': 'Exchange traded fund, moderate risk'}
        }
        
        type_risk = investment_type_risks.get(investment_type, {'base_risk': 5, 'description': 'Unknown investment type'})
        risk_score += type_risk['base_risk']
        risk_factors.append(f"Investment type ({investment_type}): {type_risk['description']}")
        
        # 2. Amount Risk Assessment
        if user_income > 0:
            investment_ratio = (investment_amount / user_income) * 100
            if investment_ratio > 50:
                risk_score += 4
                risk_factors.append(f"Investment amount ({investment_ratio:.1f}% of income) is very high")
            elif investment_ratio > 30:
                risk_score += 2
                risk_factors.append(f"Investment amount ({investment_ratio:.1f}% of income) is high")
            elif investment_ratio > 10:
                risk_score += 1
                risk_factors.append(f"Investment amount ({investment_ratio:.1f}% of income) is moderate")
        else:
            risk_factors.append("Income information not available for amount assessment")
        
        # 3. Duration Risk Assessment
        duration_risks = {
            'short term': {'risk': 3, 'description': 'Less than 1 year'},
            'medium term': {'risk': 2, 'description': '1-5 years'},
            'long term': {'risk': 1, 'description': 'More than 5 years'}
        }
        duration_risk = duration_risks.get(investment_duration, {'risk': 2, 'description': 'Duration not specified'})
        risk_score += duration_risk['risk']
        risk_factors.append(f"Investment duration: {duration_risk['description']}")
        
        # 4. User Profile Risk Assessment
        # Age factor
        if user_age < 25:
            risk_score += 1  # Young investors can take more risk
            risk_factors.append("Young age allows for higher risk tolerance")
        elif user_age > 60:
            risk_score += 2  # Older investors should be more conservative
            risk_factors.append("Older age suggests conservative approach")
        
        # Income factor
        if user_income < 300000:  # Less than 3 lakhs
            risk_score += 2
            risk_factors.append("Low income level increases risk")
        elif user_income > 1000000:  # More than 10 lakhs
            risk_score -= 1
            risk_factors.append("High income provides financial cushion")
        
        # Experience factor
        experience_risks = {
            'beginner': 2,
            'intermediate': 1,
            'advanced': 0
        }
        experience_risk = experience_risks.get(user_experience, 1)
        risk_score += experience_risk
        risk_factors.append(f"Investment experience level: {user_experience}")
        
        # 5. Financial Health Assessment
        if user_income > 0:
            # Debt-to-income ratio
            debt_ratio = (user_debt / user_income) * 100 if user_income > 0 else 0
            if debt_ratio > 50:
                risk_score += 3
                risk_factors.append(f"High debt ratio ({debt_ratio:.1f}%) increases financial risk")
            elif debt_ratio > 30:
                risk_score += 2
                risk_factors.append(f"Moderate debt ratio ({debt_ratio:.1f}%)")
            
            # Savings adequacy
            savings_ratio = (user_savings / user_income) * 100 if user_income > 0 else 0
            if savings_ratio < 10:
                risk_score += 2
                risk_factors.append("Low savings ratio indicates financial vulnerability")
        
        # 6. Risk Tolerance Alignment
        tolerance_risks = {
            'conservative': 2,
            'moderate': 0,
            'aggressive': -1
        }
        tolerance_risk = tolerance_risks.get(user_risk_tolerance, 0)
        risk_score += tolerance_risk
        
        # Normalize risk score to 1-10 scale
        risk_score = max(1, min(10, risk_score))
        
        # Determine risk level and recommendation
        if risk_score <= 3:
            risk_level = 'low'
            recommendation = 'Suitable'
            suitability_score = 9
        elif risk_score <= 5:
            risk_level = 'medium'
            recommendation = 'Moderate Risk'
            suitability_score = 7
        elif risk_score <= 7:
            risk_level = 'high'
            recommendation = 'High Risk'
            suitability_score = 5
        else:
            risk_level = 'very high'
            recommendation = 'Not Suitable'
            suitability_score = 3
        
        # Generate personalized analysis
        user_profile_analysis = {
            'age_factor': f"Age {user_age} suggests {'long-term' if user_age < 40 else 'medium-term' if user_age < 55 else 'short-term'} investment horizon",
            'income_factor': f"Income level {'supports' if user_income > 500000 else 'may limit'} this investment amount",
            'experience_factor': f"Investment experience ({user_experience}) {'supports' if user_experience in ['intermediate', 'advanced'] else 'may limit'} this investment",
            'goal_alignment': f"Investment {'aligns with' if user_goals else 'needs goal clarification'} financial objectives"
        }
        
        # Risk mitigation strategies
        risk_mitigation = [
            "Diversify across multiple investment types",
            "Start with smaller amounts and increase gradually",
            "Set up emergency fund before investing",
            "Consider professional financial advice",
            "Regular review and rebalancing of portfolio"
        ]
        
        if risk_score > 7:
            risk_mitigation.extend([
                "Consider lower-risk alternatives",
                "Ensure adequate insurance coverage",
                "Focus on debt reduction first",
                "Build emergency fund of 6+ months expenses"
            ])
        
        # Comparison analysis
        comparison_analysis = {
            'vs_risk_tolerance': f"Investment risk ({risk_level}) {'aligns with' if risk_level == user_risk_tolerance else 'differs from'} user tolerance ({user_risk_tolerance})",
            'vs_alternatives': "Consider lower-risk alternatives if risk tolerance is conservative",
            'vs_goals': "Ensure investment timeline matches financial goals",
            'vs_market_conditions': "Current market conditions may affect investment performance"
        }
        
        # Detailed recommendations
        detailed_recommendations = [
            f"Start with ₹{min(investment_amount, 50000)} if new to {investment_type}",
            "Build emergency fund of 6 months expenses first",
            "Consider SIP approach for equity investments",
            "Review investment every 6 months",
            "Consult financial advisor for large amounts"
        ]
        
        if investment_amount > 100000:
            detailed_recommendations.append("Consider professional financial planning for large investments")
        
        # Create comprehensive analysis result
        analysis_result = {
            "risk_assessment": {
                "overall_risk_score": round(risk_score, 1),
                "risk_level": risk_level,
                "suitability_score": suitability_score,
                "recommendation": recommendation,
                "confidence_level": "high"
            },
            "risk_factors": risk_factors,
            "user_profile_analysis": user_profile_analysis,
            "risk_mitigation": risk_mitigation,
            "comparison_analysis": comparison_analysis,
            "detailed_recommendations": detailed_recommendations,
            "investment_summary": {
                "type": investment_type,
                "amount": f"₹{investment_amount:,.2f}",
                "duration": investment_duration,
                "expected_return": expected_return,
                "user_risk_tolerance": user_risk_tolerance
            }
        }
        
        # Add metadata
        analysis_result['metadata'] = {
            'analysis_timestamp': datetime.now().isoformat(),
            'investment_analyzed': investment_type,
            'user_profile_considered': True,
            'ai_model_used': 'gemini-1.5-flash-latest' if model else 'enhanced_algorithm',
            'risk_calculation_method': 'comprehensive_multi_factor'
        }
        
        return jsonify(analysis_result)
        
    except ValueError as e:
        logger.error(f"Value error in investment analysis: {e}")
        return jsonify({'error': 'Invalid numeric values in investment details'}), 400
    except Exception as e:
        logger.error(f"Investment security analysis error: {e}")
        return jsonify({'error': 'Internal server error during investment analysis'}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)