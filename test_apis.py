#!/usr/bin/env python3
"""
Comprehensive API Testing Script for BFSI Finance Agent
Tests all endpoints and validates responses
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:5000"
HEADERS = {"Content-Type": "application/json"}

def test_endpoint(endpoint, method="GET", data=None, expected_status=200):
    """Test a single endpoint and return results"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method == "GET":
            response = requests.get(url, headers=HEADERS)
        elif method == "POST":
            response = requests.post(url, headers=HEADERS, json=data)
        else:
            return {"error": f"Unsupported method: {method}"}
        
        result = {
            "endpoint": endpoint,
            "method": method,
            "status_code": response.status_code,
            "expected_status": expected_status,
            "success": response.status_code == expected_status,
            "response_time": response.elapsed.total_seconds(),
            "timestamp": datetime.now().isoformat()
        }
        
        try:
            result["response_data"] = response.json()
        except:
            result["response_data"] = response.text
            
        return result
        
    except requests.exceptions.RequestException as e:
        return {
            "endpoint": endpoint,
            "method": method,
            "error": str(e),
            "success": False,
            "timestamp": datetime.now().isoformat()
        }

def test_all_apis():
    """Test all API endpoints"""
    print("🚀 Starting Comprehensive API Testing...")
    print("=" * 60)
    
    test_results = []
    
    # Test 1: Health Check
    print("\n1. Testing Health Check...")
    result = test_endpoint("/api/health")
    test_results.append(result)
    print(f"   Status: {result['status_code']} | Success: {result['success']}")
    if result['success']:
        print(f"   Response: {result['response_data']}")
    
    # Test 2: Root Endpoint
    print("\n2. Testing Root Endpoint...")
    result = test_endpoint("/")
    test_results.append(result)
    print(f"   Status: {result['status_code']} | Success: {result['success']}")
    
    # Test 3: Chat API
    print("\n3. Testing Chat API...")
    chat_data = {
        "message": "What is SIP investment?",
        "history": [],
        "user_profile": {
            "age": 30,
            "income": 800000,
            "risk_tolerance": "moderate"
        }
    }
    result = test_endpoint("/api/chat", method="POST", data=chat_data)
    test_results.append(result)
    print(f"   Status: {result['status_code']} | Success: {result['success']}")
    if result['success'] and 'response_data' in result:
        response = result['response_data']
        if 'response' in response:
            print(f"   Response length: {len(response['response'])} characters")
    
    # Test 4: FAQ API
    print("\n4. Testing FAQ API...")
    result = test_endpoint("/api/faq")
    test_results.append(result)
    print(f"   Status: {result['status_code']} | Success: {result['success']}")
    if result['success'] and 'response_data' in result:
        response = result['response_data']
        if 'faqs' in response:
            print(f"   FAQs returned: {len(response['faqs'])} items")
    
    # Test 5: Fraud Detection API
    print("\n5. Testing Fraud Detection API...")
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
    result = test_endpoint("/api/fraud/detect", method="POST", data=fraud_data)
    test_results.append(result)
    print(f"   Status: {result['status_code']} | Success: {result['success']}")
    if result['success'] and 'response_data' in result:
        response = result['response_data']
        if 'risk_level' in response:
            print(f"   Risk Level: {response['risk_level']}")
    
    # Test 6: Financial Analysis API
    print("\n6. Testing Financial Analysis API...")
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
    result = test_endpoint("/api/financial/analyze", method="POST", data=financial_data)
    test_results.append(result)
    print(f"   Status: {result['status_code']} | Success: {result['success']}")
    
    # Test 7: Insurance Claim API
    print("\n7. Testing Insurance Claim API...")
    claim_data = {
        "policy_number": "POL789012",
        "claim_type": "health",
        "incident_date": "2024-02-20",
        "description": "Hospitalization for appendicitis",
        "amount": 75000,
        "location": "Mumbai"
    }
    result = test_endpoint("/api/claims/submit", method="POST", data=claim_data)
    test_results.append(result)
    print(f"   Status: {result['status_code']} | Success: {result['success']}")
    
    # Test 8: Security Analysis API
    print("\n8. Testing Security Analysis API...")
    security_data = {
        "file_content": "Sample document content for security analysis",
        "file_type": "pdf",
        "user_profile": {
            "age": 32,
            "income": 900000
        }
    }
    result = test_endpoint("/api/security/analyze", method="POST", data=security_data)
    test_results.append(result)
    print(f"   Status: {result['status_code']} | Success: {result['success']}")
    
    # Test 9: Policy Underwriting API
    print("\n9. Testing Policy Underwriting API...")
    underwriting_data = {
        "policy_type": "term_insurance",
        "coverage_amount": 1000000,
        "term": 20,
        "applicant_profile": {
            "age": 30,
            "gender": "male",
            "occupation": "software_engineer",
            "health_conditions": [],
            "smoking_status": "non_smoker"
        }
    }
    result = test_endpoint("/api/policies/underwriting", method="POST", data=underwriting_data)
    test_results.append(result)
    print(f"   Status: {result['status_code']} | Success: {result['success']}")
    
    # Test 10: Add Policy API
    print("\n10. Testing Add Policy API...")
    policy_data = {
        "policy_type": "term_insurance",
        "policy_number": "POL345678",
        "coverage_amount": 1500000,
        "premium_amount": 12000,
        "start_date": "2024-01-01",
        "end_date": "2044-01-01",
        "beneficiary": "Spouse"
    }
    result = test_endpoint("/api/policies", method="POST", data=policy_data)
    test_results.append(result)
    print(f"   Status: {result['status_code']} | Success: {result['success']}")
    
    # Test 11: Recommendations API
    print("\n11. Testing Recommendations API...")
    recommendations_data = {
        "user_profile": {
            "age": 25,
            "income": 500000,
            "risk_tolerance": "moderate",
            "investment_goals": ["retirement", "house_purchase"],
            "time_horizon": 10
        }
    }
    result = test_endpoint("/api/recommendations", method="POST", data=recommendations_data)
    test_results.append(result)
    print(f"   Status: {result['status_code']} | Success: {result['success']}")
    
    # Test 12: Investment Security Analysis API
    print("\n12. Testing Investment Security Analysis API...")
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
    result = test_endpoint("/api/investment/security-analysis", method="POST", data=investment_data)
    test_results.append(result)
    print(f"   Status: {result['status_code']} | Success: {result['success']}")
    
    # Summary Report
    print("\n" + "=" * 60)
    print("📊 API TESTING SUMMARY")
    print("=" * 60)
    
    successful_tests = sum(1 for result in test_results if result.get('success', False))
    total_tests = len(test_results)
    
    print(f"Total Tests: {total_tests}")
    print(f"Successful: {successful_tests}")
    print(f"Failed: {total_tests - successful_tests}")
    print(f"Success Rate: {(successful_tests/total_tests)*100:.1f}%")
    
    print("\nDetailed Results:")
    for i, result in enumerate(test_results, 1):
        status = "✅ PASS" if result.get('success', False) else "❌ FAIL"
        print(f"{i:2d}. {result['endpoint']:<30} {status}")
        if not result.get('success', False) and 'error' in result:
            print(f"    Error: {result['error']}")
    
    # Save detailed results to file
    with open('api_test_results.json', 'w') as f:
        json.dump(test_results, f, indent=2)
    
    print(f"\nDetailed results saved to: api_test_results.json")
    
    return test_results

if __name__ == "__main__":
    test_all_apis() 