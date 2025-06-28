import { auth } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};

export const getPasswordStrength = (password) => {
  let strength = 0;
  
  if (password.length >= 6) strength++;
  if (password.match(/[a-z]/)) strength++;
  if (password.match(/[A-Z]/)) strength++;
  if (password.match(/[0-9]/)) strength++;
  if (password.match(/[^a-zA-Z0-9]/)) strength++;
  
  if (strength < 2) return { level: 'weak', color: 'red' };
  if (strength < 4) return { level: 'medium', color: 'yellow' };
  return { level: 'strong', color: 'green' };
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-IN').format(number);
};

export const calculateEMI = (principal, rate, time) => {
  const monthlyRate = rate / (12 * 100);
  const months = time * 12;
  
  if (monthlyRate === 0) return principal / months;
  
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
              (Math.pow(1 + monthlyRate, months) - 1);
  
  return Math.round(emi);
};

export const calculateSIPReturns = (monthlyAmount, years, expectedReturn) => {
  const monthlyRate = expectedReturn / (12 * 100);
  const months = years * 12;
  
  const futureValue = monthlyAmount * 
    (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate * (1 + monthlyRate);
  
  return Math.round(futureValue);
}; 