import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is term insurance?",
    answer:
      "Term insurance is a life insurance policy that provides coverage for a specific period. If the insured person passes away during the term, the nominee gets the sum assured.",
  },
  {
    question: "How does a SIP work?",
    answer:
      "A SIP (Systematic Investment Plan) allows you to invest a fixed amount in mutual funds at regular intervals, helping you build wealth over time.",
  },
  {
    question: "What is an emergency fund?",
    answer:
      "An emergency fund is money set aside to cover unexpected expenses or financial emergencies, usually 6-12 months of your living expenses.",
  },
  {
    question: "How can I avoid loan traps?",
    answer:
      "Read all loan terms carefully, compare lenders, check the total cost (not just EMI), and avoid unnecessary add-ons or insurance bundling.",
  },
  {
    question: "How do I detect financial fraud?",
    answer:
      "Never share OTPs or passwords, verify links before clicking, and check the legitimacy of financial companies with RBI/IRDAI.",
  },
];

const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="card mt-8">
      <div className="flex items-center space-x-2 mb-4">
        <HelpCircle className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
      </div>
      <div className="divide-y">
        {faqs.map((faq, idx) => (
          <div key={idx} className="py-4">
            <button
              className="flex items-center justify-between w-full text-left"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            >
              <span className="font-medium text-gray-900">{faq.question}</span>
              {openIdx === idx ? (
                <ChevronUp className="h-5 w-5 text-blue-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-blue-600" />
              )}
            </button>
            {openIdx === idx && (
              <div className="mt-2 text-gray-700 text-sm">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection; 