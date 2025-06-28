# BFSI (Banking, Financial Services, and Insurance) App

A beginner-friendly financial app that helps you learn about money, get personalized investment advice, and manage your insurance - all powered by AI! 🚀

## ✨ What This App Does

Think of this as your personal financial advisor that:
- **Teaches you** about money in simple terms
- **Recommends investments** based on YOUR situation
- **Helps with insurance claims** using AI
- **Keeps your files safe** by checking for threats
- **Answers your questions** 24/7

## 🎯 Key Features

### 📊 **Smart Investment Recommendations**
- **AI analyzes your profile** (age, income, goals, risk tolerance)
- **Suggests 4 perfect investments** just for you
- **Shows detailed info** like minimum amount, returns, risks
- **Explains why** each investment suits you
- **Works even without internet** (fallback mode)

### 🏥 **Insurance Claims Made Easy**
- **Select your policy** from your existing insurance
- **Upload documents** (bills, prescriptions, etc.)
- **AI analyzes everything** and tells you:
  - Will your claim be approved?
  - What's missing?
  - How long will it take?
- **Get a claim ID** to track progress

### 🛡️ **Security File Checker**
- **Upload text or JSON files** (max 5MB)
- **AI scans for threats** and fraud
- **Tells you if it's safe** to use
- **Gives you recommendations** on what to do

### 📚 **Learn About Money**
- **4 easy modules** covering basics
- **Interactive lessons** with quizzes
- **Track your progress** as you learn
- **Topics**: Insurance, Investing, Loans, Financial Planning

### 🤖 **AI Financial Assistant**
- **Ask any money question** 24/7
- **Gets to know you** and gives personalized advice
- **Explains complex terms** in simple language
- **Remembers your conversations**

## 🛠️ How It's Built

### Frontend (What You See)
- **React** - Makes the app interactive
- **Tailwind CSS** - Makes it look beautiful
- **Framer Motion** - Smooth animations
- **Firebase** - Keeps your data safe

### Backend (The Brain)
- **Flask** - Handles all the logic
- **Google Gemini AI** - Powers the smart features
- **Ollama (Llama)** - Backup AI when needed

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Install frontend packages
npm install

# Install backend packages
cd backend
pip install flask flask-cors python-dotenv google-generativeai pillow ollama
```

### 2. Set Up Environment
Create a `.env` file in the backend folder:
```env
GEMINI_API_KEY=your-gemini-api-key-here
FLASK_ENV=development
```

### 3. Start the App
```bash
# Start frontend (in one terminal)
npm run dev

# Start backend (in another terminal)
cd backend
python app.py
```

### 4. Open Your Browser
Go to `http://localhost:3000` and start exploring!

## 📱 How to Use the App

### Step 1: Create Your Profile
1. **Sign up** with your email
2. **Complete 6 steps**:
   - Personal info (name, age, job)
   - Financial info (income, expenses, savings)
   - Your goals (retirement, home, education)
   - Family info (married, kids)
   - **Add your existing insurance policies** (important!)
   - What products interest you

### Step 2: Get Personalized Recommendations
1. Go to **"Investments"** tab
2. **AI analyzes your profile** automatically
3. **See 4 recommendations** perfect for you
4. **Click to expand** each one for full details
5. **Check suitability** - why it's good for YOU

### Step 3: Submit Insurance Claims
1. Go to **"Claims"** tab
2. **Select your policy** (only if you added it in profile)
3. **Fill claim details** (date, amount, description)
4. **Upload documents** (PDF, JPG, PNG files)
5. **Get AI analysis** with approval likelihood

### Step 4: Check File Security
1. Go to **"Security"** tab
2. **Upload a file** (.txt or .json only)
3. **Get instant analysis** for threats
4. **See risk level** and recommendations

### Step 5: Learn and Ask Questions
1. **"Learning"** tab - Complete modules
2. **"AI Assistant"** tab - Ask any money question
3. **"FAQ"** tab - Common questions answered

## 🎯 Personalized Recommendations Explained

### How AI Chooses for You:
1. **Age**: Younger = more risk, Older = more safety
2. **Income**: Higher = bigger investments, Lower = smaller amounts
3. **Risk Tolerance**: Conservative = safe options, Aggressive = high returns
4. **Goals**: Retirement = long-term, Emergency = short-term
5. **Family**: More dependents = more protection needed
6. **Existing Insurance**: Avoid duplicates, suggest gaps

### What You Get:
- **4 investment schemes** with real company names
- **Detailed breakdown** of features, rules, pros/cons
- **Personalized suitability** explanation
- **Risk levels** and ratings
- **Minimum amounts** and expected returns

## 🔒 Safety Features

### File Upload Protection:
- **Only safe file types** (.txt, .json for security)
- **Size limits** (5MB security, 10MB claims)
- **AI threat detection** on all files
- **Fallback protection** if AI is down

### Data Protection:
- **Firebase security** for your profile
- **User-specific access** to your data
- **No permanent file storage** - files are deleted after analysis
- **Secure API calls** with authentication

## 🤖 AI Features with Fallbacks

### When AI Works:
- **Personalized recommendations** based on your profile
- **Smart claim analysis** with document review
- **Intelligent file security** scanning
- **Context-aware chat** responses

### When AI is Down:
- **Default recommendations** with profile customization
- **Basic claim processing** with standard responses
- **Simple security checks** with known patterns
- **Pre-written helpful responses**

## 📊 Example: How Recommendations Work

### For a 25-year-old with ₹50,000/month income:
```
AI Analysis:
- Age: Young, can take risks
- Income: Good, can invest ₹10,000/month
- Goals: Long-term wealth creation
- Risk: Moderate to aggressive

Recommendations:
1. HDFC Mid-Cap Fund (High growth potential)
2. ICICI Tech Fund (Sector-specific)
3. Term Insurance (Family protection)
4. Emergency Fund (Safety net)
```

### For a 60-year-old with ₹30,000/month income:
```
AI Analysis:
- Age: Senior, needs stability
- Income: Moderate, conservative approach
- Goals: Regular income and safety
- Risk: Very low to low

Recommendations:
1. Senior Citizen FD (Higher interest rates)
2. Conservative Mutual Fund (Stable returns)
3. Health Insurance (Medical protection)
4. Government Bonds (Guaranteed returns)
```

## 🐛 Troubleshooting

### Common Issues:

**"Can't upload file"**
- Check file type (.txt/.json for security, PDF/JPG/PNG for claims)
- Check file size (5MB for security, 10MB for claims)

**"No recommendations showing"**
- Complete your profile first
- Check if backend is running on port 5000
- Try refreshing the page

**"AI not responding"**
- Check your internet connection
- Verify Gemini API key is set
- App will work with fallback mode

**"Can't submit claim"**
- Add insurance policies in your profile first
- Make sure you have documents ready
- Check all required fields are filled

## 📞 Need Help?

1. **Check the FAQ** section in the app
2. **Ask the AI Assistant** any question
3. **Look at the troubleshooting** guide above
4. **Check browser console** for error messages

## 🚀 What's Next?

The app is designed to grow with you:
- **More learning modules** coming soon
- **Additional investment types** being added
- **Enhanced AI capabilities** with more features
- **Mobile app** in development

## 💡 Tips for Best Experience

1. **Complete your profile** fully for best recommendations
2. **Add all your insurance policies** to use claims feature
3. **Use the AI Assistant** to learn about financial terms
4. **Check file security** before uploading important documents
5. **Track your learning progress** to stay motivated

---

**Built with ❤️ to make financial literacy accessible to everyone!**

*Remember: This app provides educational content and general advice. For specific financial decisions, always consult with a qualified financial advisor.* 
