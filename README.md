# 🏦 BFSI Financial Security Platform

A comprehensive **Banking, Financial Services, and Insurance (BFSI)** platform that provides advanced security analysis, fraud detection, and personalized financial guidance using AI-powered risk assessment.

## 🎯 What This Platform Does

This is a **complete financial security and analysis platform** that helps users:
- 🔒 **Analyze investment security** and assess risks
- 📁 **Scan uploaded documents** for security threats
- 🚨 **Detect financial fraud** and suspicious activities
- 💡 **Get personalized financial recommendations**
- 📚 **Learn about financial products** through interactive modules
- 🤖 **Chat with AI assistant** for financial guidance
- 📋 **Manage insurance claims** and policies
- 📊 **Track financial health** and investment scores

## 🏗️ Project Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with Vite for fast development
- **Styling**: Tailwind CSS for modern, responsive design
- **Animations**: Framer Motion for smooth user interactions
- **State Management**: React Context API for user data
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore for user profiles

### Backend (Python Flask)
- **Framework**: Flask with CORS support
- **AI Integration**: Google Gemini AI + Ollama fallback
- **Security**: File validation, input sanitization, error handling
- **APIs**: RESTful endpoints for all financial services
- **File Processing**: Secure document upload and analysis

## 🚀 Key Features

### 1. 🔒 **Security Analysis**
- **Investment Risk Assessment**: Multi-factor algorithm (1-10 scale)
- **File Security Scanning**: Detects malicious files and patterns
- **Fraud Detection**: AI-powered suspicious activity identification
- **Real-time Risk Scoring**: Dynamic calculation based on user profile

### 2. 📊 **Investment Analysis**
- **Risk Scoring Algorithm**:
  - Investment Type Risk (1-9 points)
  - Amount Risk (0-4 points) 
  - Duration Risk (1-3 points)
  - User Profile Risk (0-4 points)
- **Personalized Recommendations**: Based on age, income, experience
- **Risk Mitigation Strategies**: Actionable advice for risk reduction

### 3. 🤖 **AI-Powered Features**
- **Smart Chatbot**: Financial guidance and Q&A
- **Fraud Detection**: Pattern recognition for suspicious activities
- **Document Analysis**: AI-powered document security scanning
- **Personalized Learning**: Adaptive financial education modules

### 4. 📚 **Learning System**
- **Interactive Modules**: Step-by-step financial education
- **Progress Tracking**: User learning journey monitoring
- **Certification**: Completion certificates for modules
- **Personalized Content**: Based on user profile and goals

### 5. 📋 **Insurance Management**
- **Policy Management**: Add, view, and manage insurance policies
- **Claims Processing**: Document upload and claim submission
- **Underwriting**: AI-powered risk assessment for policies
- **Recommendations**: Personalized insurance suggestions

## 🛠️ Technology Stack

### Frontend Technologies
```
React 18.2.0          - UI Framework
Vite 5.0.8           - Build Tool & Dev Server
Tailwind CSS 3.3.6   - Styling Framework
Framer Motion 10.16  - Animation Library
React Router 6.8.1   - Navigation
Axios 1.6.2          - HTTP Client
Firebase 10.7.1      - Authentication & Database
Lucide React 0.294   - Icon Library
React Hot Toast 2.4  - Notifications
```

### Backend Technologies
```
Flask 3.0.0              - Web Framework
Flask-CORS 4.0.0         - Cross-Origin Support
Google Generative AI     - AI Integration
Ollama 0.1.7            - Local AI Fallback
Pillow 10.0.0           - Image Processing
PyJWT 2.8.0             - JWT Authentication
Cryptography 41.0.7     - Security
NumPy & Pandas          - Data Processing
Python-dotenv 1.0.0     - Environment Variables
```

### AI & Machine Learning
- **Google Gemini AI**: Primary AI model for analysis
- **Ollama**: Local AI fallback for offline functionality
- **Custom Algorithms**: Risk assessment and scoring systems
- **Pattern Recognition**: Fraud detection and security analysis

## 📁 Project Structure

```
bfsi-platform/
├── src/                    # React Application
│   ├── components/        # Reusable UI Components
│   ├── pages/            # Page Components
│   ├── contexts/         # React Context Providers
│   ├── lib/             # Utility Functions & APIs
│   └── styles/          # Global Styles
├── backend/              # Flask API Server
│   ├── app.py           # Main Flask Application
│   ├── requirements.txt # Python Dependencies
│   └── uploads/        # File Upload Directory
├── firebase.js         # Firebase Configuration
└── README.md          # Project Documentation
```

## 🔧 Installation & Setup

### Prerequisites
- **Node.js 16+** and **npm**
- **Python 3.8+** and **pip**
- **Firebase Account** (for authentication)
- **Google AI API Key** (for Gemini AI)

### Quick Start

1. **Install Frontend Dependencies**
```bash
npm install
```

2. **Install Backend Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

3. **Set Up Environment Variables**
```bash
# Create .env file in backend directory
GEMINI_API_KEY=your_gemini_api_key
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

4. **Start the Application**
```bash
# Terminal 1: Start Backend
cd backend
python app.py

# Terminal 2: Start Frontend
npm run dev
```

5. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔌 API Endpoints

### Core Security Analysis
```http
POST /api/investment/security-analysis    # Investment risk assessment
POST /api/security/analyze               # File security scanning
POST /api/fraud/detect                   # Fraud detection
POST /api/financial/analyze              # Financial health analysis
```

### User Management
```http
POST /api/auth/login                     # User authentication
POST /api/auth/signup                    # User registration
GET  /api/profile                        # Get user profile
PUT  /api/profile                        # Update user profile
```

### Insurance & Claims
```http
POST /api/policies                       # Add insurance policy
POST /api/claims/submit                  # Submit insurance claim
POST /api/policies/underwriting          # Policy underwriting
```

### AI & Learning
```http
POST /api/chat                          # AI chatbot
GET  /api/learning/modules              # Learning modules
POST /api/recommendations               # Financial recommendations
```

## 🧮 Risk Assessment Algorithm

### Investment Risk Scoring (1-10 Scale)

1. **Investment Type Risk** (1-9 points)
   - Fixed Deposit: 1 point (Very Low Risk)
   - Bonds: 2 points (Low Risk)
   - Insurance: 3 points (Low-Medium Risk)
   - Mutual Funds: 4 points (Medium Risk)
   - Gold: 5 points (Medium Risk)
   - Real Estate: 6 points (Medium-High Risk)
   - Equity: 8 points (High Risk)
   - Crypto: 9 points (Very High Risk)

2. **Amount Risk** (0-4 points)
   - >50% of income: 4 points (Very High)
   - 30-50% of income: 2 points (High)
   - 10-30% of income: 1 point (Moderate)
   - <10% of income: 0 points (Low)

3. **Duration Risk** (1-3 points)
   - Short term: 3 points (Higher Risk)
   - Medium term: 2 points (Moderate Risk)
   - Long term: 1 point (Lower Risk)

4. **User Profile Risk** (0-4 points)
   - Age factors: 0-2 points
   - Income factors: 0-2 points
   - Experience factors: 0-2 points

### Risk Level Classification
- **Low Risk (1-3)**: Suitable for most investors
- **Medium Risk (4-6)**: Requires careful consideration
- **High Risk (7-8)**: Not suitable for conservative investors
- **Very High Risk (9-10)**: Extremely high risk, not recommended

## 🔒 Security Features

### File Security Analysis
- **File Type Validation**: Blocks executables and scripts
- **Size Analysis**: Flags suspicious file sizes
- **Pattern Detection**: Scans for malicious filenames
- **Content Analysis**: AI-powered content scanning
- **Compliance Checking**: Regulatory compliance verification

### Fraud Detection
- **Unrealistic Returns**: Flags >50% return promises
- **High Pressure Tactics**: Detects urgency in offers
- **Unregistered Entities**: Identifies unlicensed providers
- **Suspicious Patterns**: Recognizes common fraud patterns
- **Profile Mismatch**: Alerts when investment doesn't match user

### Data Security
- **Input Validation**: All inputs sanitized and validated
- **File Upload Security**: Strict file type and size restrictions
- **Error Handling**: Secure error messages
- **CORS Configuration**: Proper cross-origin setup
- **Authentication**: Firebase-based secure authentication

## 📊 Key Components

### 1. **Dashboard Component**
- Financial health overview
- Investment score calculation
- Learning progress tracking
- Recent activity monitoring
- Quick action buttons

### 2. **SecurityUpload Component**
- File upload interface
- Security analysis results
- Risk assessment display
- Investment analysis modal
- Financial health calculator

### 3. **Chatbot Component**
- AI-powered financial guidance
- Real-time Q&A support
- Context-aware responses
- Learning integration

### 4. **InsuranceClaim Component**
- Document upload for claims
- Claim status tracking
- Policy management
- Underwriting integration

## 🧪 Testing

### Run Security Analysis Tests
```bash
python test_api.py
```

### Test Coverage
- ✅ Investment security analysis
- ✅ File security scanning
- ✅ Fraud detection
- ✅ API connectivity
- ✅ Risk assessment accuracy

### Setup

1. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd BFSI-Finance-Agent-1
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

3. **Frontend Setup**
   ```bash
   npm install
   npm run dev
   ```

4. **Environment Variables**
   Create `.env` files in both root and backend directories with your API keys.

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/chat` - AI chat interface
- `GET /api/faq` - Get FAQ data
- `POST /api/fraud/detect` - Fraud detection
- `POST /api/financial/analyze` - Financial health analysis
- `POST /api/claims/submit` - Insurance claim submission
- `POST /api/security/analyze` - Security analysis
- `POST /api/policies/underwriting` - Policy underwriting
- `POST /api/policies` - Add new policy
- `POST /api/recommendations` - Get recommendations
- `POST /api/investment/security-analysis` - Investment security analysis

  Pictures:
  ![Screenshot 2025-06-29 172402](https://github.com/user-attachments/assets/69f27d51-ee80-45eb-b9ad-442c82806082)

Built with ❤️ for secure financial services
