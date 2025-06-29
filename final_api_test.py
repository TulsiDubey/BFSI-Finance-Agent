#!/usr/bin/env python3
"""
Final Comprehensive API Test for BFSI Finance Agent
Verifies all endpoints and provides detailed analysis
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:5000"
HEADERS = {"Content-Type": "application/json"}

def test_endpoint(endpoint, method="GET", data=None, expected_status=200, files=None, description=""):
    """Test a single endpoint and return detailed results"""
    url = f"{BASE_URL}{endpoint}"
    
    print(f"\n🔍 Testing: {description}")
    print(f"   Endpoint: {method} {endpoint}")
    
    try:
        start_time = time.time()
        
        if method == "GET":
            response = requests.get(url, headers=HEADERS)
        elif method == "POST":
            if files:
                response = requests.post(url, files=files, data=data)
            else:
                response = requests.post(url, headers=HEADERS, json=data)
        else:
            return {"error": f"Unsupported method: {method}"}
        
        end_time = time.time()
        response_time = end_time - start_time
        
        result = {
            "endpoint": endpoint,
            "method": method,
            "description": description,
            "status_code": response.status_code,
            "expected_status": expected_status,
            "success": response.status_code == expected_status,
            "response_time": response_time,
            "timestamp": datetime.now().isoformat()
        }
        
        try:
            result["response_data"] = response.json()
        except:
            result["response_data"] = response.text
            
        # Print results
        status_icon = "✅" if result['success'] else "❌"
        print(f"   {status_icon} Status: {result['status_code']} | Time: {response_time:.2f}s")
        
        if result['success']:
            print(f"   ✅ SUCCESS")
            if 'response_data' in result and isinstance(result['response_data'], dict):
                # Show key response data
                if 'response' in result['response_data']:
                    response_text = result['response_data']['response']
                    print(f"   📝 Response: {response_text[:100]}...")
                elif 'faqs' in result['response_data']:
                    faqs = result['response_data']['faqs']
                    print(f"   📋 FAQs: {len(faqs)} items returned")
                elif 'risk_level' in result['response_data']:
                    risk = result['response_data']['risk_level']
                    print(f"   🎯 Risk Level: {risk}")
                elif 'success' in result['response_data']:
                    success = result['response_data']['success']
                    print(f"   ✅ Success: {success}")
        else:
            print(f"   ❌ FAILED")
            if 'response_data' in result:
                print(f"   💥 Error: {result['response_data']}")
            
        return result
        
    except requests.exceptions.RequestException as e:
        error_result = {
            "endpoint": endpoint,
            "method": method,
            "description": description,
            "error": str(e),
            "success": False,
            "timestamp": datetime.now().isoformat()
        }
        print(f"   ❌ ERROR: {str(e)}")
        return error_result

def run_comprehensive_test():
    """Run comprehensive test of all API endpoints"""
    print("🚀 BFSI Finance Agent - Final API Test")
    print("=" * 80)
    print(f"📅 Test Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 Base URL: {BASE_URL}")
    print("=" * 80)
    
    test_results = []
    
    # Test 1: Health Check
    result = test_endpoint(
        "/api/health", 
        description="Health Check - Verify API is running"
    )
    test_results.append(result)
    
    # Test 2: Root Endpoint
    result = test_endpoint(
        "/", 
        description="Root Endpoint - Basic health check"
    )
    test_results.append(result)
    
    # Test 3: AI Chat
    chat_data = {
        "message": "What is SIP investment and how should I start?",
        "history": [],
        "user_profile": {
            "age": 30,
            "income": 800000,
            "risk_tolerance": "moderate"
        }
    }
    result = test_endpoint(
        "/api/chat", 
        method="POST", 
        data=chat_data,
        description="AI Chat - Financial advisory with context"
    )
    test_results.append(result)
    
    # Test 4: FAQ Generation
    result = test_endpoint(
        "/api/faq", 
        description="FAQ Generation - AI-powered questions and answers"
    )
    test_results.append(result)
    
    # Test 5: Fraud Detection
    fraud_data = {
        "claim_data": {
            "policy_number": "POL123456",
            "claim_type": "health",
            "amount": 50000,
            "incident_date": "2024-01-15"
        },
        "user_profile": {
            "age": 35,
            "income": 600000,
            "claim_history": []
        }
    }
    result = test_endpoint(
        "/api/fraud/detect", 
        method="POST", 
        data=fraud_data,
        description="Fraud Detection - Insurance claim analysis"
    )
    test_results.append(result)
    
    # Test 6: Financial Analysis
    financial_data = {
        "user_profile": {
            "age": 28,
            "income": 750000,
            "savings": 200000,
            "debt": 500000,
            "monthly_expenses": 45000,
            "emergency_fund": 100000
        }
    }
    result = test_endpoint(
        "/api/financial/analyze", 
        method="POST", 
        data=financial_data,
        description="Financial Analysis - Health assessment and recommendations"
    )
    test_results.append(result)
    
    # Test 7: Insurance Claims
    claim_data = {
        "policy_number": "POL789012",
        "claim_type": "health",
        "incident_date": "2024-02-20",
        "description": "Hospitalization for appendicitis",
        "amount": 75000,
        "location": "Mumbai"
    }
    result = test_endpoint(
        "/api/claims/submit", 
        method="POST", 
        data=claim_data,
        description="Insurance Claims - Submit and monitor claims"
    )
    test_results.append(result)
    
    # Test 8: Security Analysis
    files = {
        'files': ('test_document.txt', 'This is a test document for security analysis.', 'text/plain')
    }
    data = {
        'userProfile': json.dumps({
            "age": 32,
            "income": 900000
        })
    }
    result = test_endpoint(
        "/api/security/analyze", 
        method="POST", 
        data=data, 
        files=files,
        description="Security Analysis - Document security assessment"
    )
    test_results.append(result)
    
    # Test 9: Policy Underwriting
    underwriting_data = {
        "policy_data": {
            "policy_type": "term_insurance",
            "coverage_amount": 1000000,
            "applicant_age": 30,
            "term": 20
        },
        "user_profile": {
            "age": 30,
            "gender": "male",
            "occupation": "software_engineer",
            "health_conditions": [],
            "smoking_status": "non_smoker"
        }
    }
    result = test_endpoint(
        "/api/policies/underwriting", 
        method="POST", 
        data=underwriting_data,
        description="Policy Underwriting - Risk assessment and approval"
    )
    test_results.append(result)
    
    # Test 10: Add Policy
    policy_data = {
        "policy_type": "term_insurance",
        "coverage_amount": 1500000,
        "term": 20,
        "premium_amount": 12000,
        "start_date": "2024-01-01",
        "end_date": "2044-01-01",
        "beneficiary": "Spouse"
    }
    result = test_endpoint(
        "/api/policies", 
        method="POST", 
        data=policy_data,
        description="Add Policy - Create new insurance policy"
    )
    test_results.append(result)
    
    # Test 11: Recommendations
    recommendations_data = {
        "user_profile": {
            "age": 25,
            "income": 500000,
            "risk_tolerance": "moderate",
            "investment_goals": ["retirement", "house_purchase"],
            "time_horizon": 10
        }
    }
    result = test_endpoint(
        "/api/recommendations", 
        method="POST", 
        data=recommendations_data,
        description="Recommendations - Personalized financial advice"
    )
    test_results.append(result)
    
    # Test 12: Investment Security Analysis
    investment_data = {
        "investment_details": {
            "type": "mutual_fund",
            "name": "HDFC Mid-Cap Opportunities Fund",
            "amount": 100000,
            "duration": "5_years",
            "expected_return": "12_percent"
        },
        "user_profile": {
            "age": 35,
            "income": 800000,
            "risk_tolerance": "moderate"
        }
    }
    result = test_endpoint(
        "/api/investment/security-analysis", 
        method="POST", 
        data=investment_data,
        description="Investment Security - Risk assessment and safety analysis"
    )
    test_results.append(result)
    
    # Comprehensive Summary
    print("\n" + "=" * 80)
    print("📊 COMPREHENSIVE API TEST RESULTS")
    print("=" * 80)
    
    successful_tests = sum(1 for result in test_results if result.get('success', False))
    total_tests = len(test_results)
    success_rate = (successful_tests/total_tests)*100
    
    print(f"📈 Overall Results:")
    print(f"   Total Tests: {total_tests}")
    print(f"   Successful: {successful_tests}")
    print(f"   Failed: {total_tests - successful_tests}")
    print(f"   Success Rate: {success_rate:.1f}%")
    
    # Performance Analysis
    response_times = [r.get('response_time', 0) for r in test_results if r.get('success', False)]
    if response_times:
        avg_response_time = sum(response_times) / len(response_times)
        max_response_time = max(response_times)
        min_response_time = min(response_times)
        
        print(f"\n⚡ Performance Analysis:")
        print(f"   Average Response Time: {avg_response_time:.2f}s")
        print(f"   Fastest Response: {min_response_time:.2f}s")
        print(f"   Slowest Response: {max_response_time:.2f}s")
    
    print(f"\n📋 Detailed Results:")
    for i, result in enumerate(test_results, 1):
        status = "✅ PASS" if result.get('success', False) else "❌ FAIL"
        response_time = result.get('response_time', 0)
        print(f"   {i:2d}. {result['description']:<40} {status} ({response_time:.2f}s)")
        
        if not result.get('success', False):
            if 'error' in result:
                print(f"       💥 Error: {result['error']}")
            elif 'response_data' in result and isinstance(result['response_data'], dict):
                if 'error' in result['response_data']:
                    print(f"       💥 API Error: {result['response_data']['error']}")
    
    # API Health Assessment
    print(f"\n🏥 API Health Assessment:")
    if success_rate >= 90:
        print(f"   🟢 EXCELLENT - API is performing exceptionally well")
    elif success_rate >= 80:
        print(f"   🟡 GOOD - API is working well with minor issues")
    elif success_rate >= 70:
        print(f"   🟠 FAIR - API has some issues that need attention")
    else:
        print(f"   🔴 POOR - API has significant issues requiring immediate attention")
    
    # Recommendations
    print(f"\n💡 Recommendations:")
    if success_rate < 100:
        failed_tests = [r for r in test_results if not r.get('success', False)]
        for test in failed_tests:
            print(f"   🔧 Fix {test['description']} - {test.get('error', 'Unknown error')}")
    
    if success_rate >= 90:
        print(f"   🚀 API is ready for production deployment")
        print(f"   📊 Consider implementing monitoring and alerting")
        print(f"   🔒 Ensure all security measures are in place")
    
    # Save detailed results
    with open('final_api_test_results.json', 'w') as f:
        json.dump(test_results, f, indent=2)
    
    print(f"\n💾 Detailed results saved to: final_api_test_results.json")
    
    return test_results

if __name__ == "__main__":
    run_comprehensive_test() 