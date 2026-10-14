/**
 * ReviewFlow Security & Anti-Spam Engine
 * Server-side validation, profanity filter, rate limiting, duplicate detection,
 * and order lookup for Verified Buyer qualification.
 */

import { prisma } from './db.js';

// In-memory rate limiting tracker: ipOrEmail -> [timestamps]
const submissionHistory = new Map();

// Disposable / temporary email providers blacklist
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'trashmail.com',
  'spambotmail.xyz',
  'yopmail.com',
  'throwawaymail.com',
  'fakeinbox.com'
]);

// Curated list of spam triggers and profanity
const PROFANITY_AND_SPAM_PATTERNS = [
  /\b(viagra|cialis|crypto airdrop|free cash bonus|telegram @|whatsapp \+\d+|casino online)\b/i,
  /\b(scam link|free tokens|bitcoin profit|click here http)\b/i,
  /\b(fuck|shit|bitch|asshole|bastard|dick|pussy)\b/i
];

/**
 * Validate review submission payload and enforce anti-spam rules.
 */
export async function validateAndFilterReview({
  productId,
  shop,
  customerName,
  customerEmail,
  rating,
  title,
  body,
  ip
}) {
  // 1. Mandatory fields
  if (!productId || typeof productId !== 'string') {
    return { valid: false, error: 'Invalid or missing product ID.' };
  }
  if (!shop || typeof shop !== 'string') {
    return { valid: false, error: 'Invalid or missing shop identifier.' };
  }
  if (!customerName || customerName.trim().length < 2) {
    return { valid: false, error: 'Please provide a valid name (at least 2 characters).' };
  }

  // 2. Email format & disposable check
  const emailClean = (customerEmail || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailClean)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }
  const emailDomain = emailClean.split('@')[1];
  if (DISPOSABLE_EMAIL_DOMAINS.has(emailDomain)) {
    return { valid: false, error: 'Disposable and temporary email addresses are not accepted.' };
  }

  // 3. Rating validation (1 to 5 integers)
  const numRating = Number(rating);
  if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
    return { valid: false, error: 'Rating must be an integer between 1 and 5.' };
  }

  // 4. Content length checks
  const cleanTitle = (title || '').trim();
  const cleanBody = (body || '').trim();
  if (cleanTitle.length < 3 || cleanTitle.length > 100) {
    return { valid: false, error: 'Review title must be between 3 and 100 characters.' };
  }
  if (cleanBody.length < 10 || cleanBody.length > 2000) {
    return { valid: false, error: 'Review details must be between 10 and 2000 characters.' };
  }

  // 5. Profanity & spam text detection
  const combinedText = `${cleanTitle} ${cleanBody}`;
  for (const pattern of PROFANITY_AND_SPAM_PATTERNS) {
    if (pattern.test(combinedText)) {
      return {
        valid: false,
        error: 'Your review contains language or links flagged by our automated community guidelines.'
      };
    }
  }

  // 6. Rate Limiting (max 3 submissions per 10 minutes per IP/Email)
  const clientIdentifier = `${ip || 'local'}_${emailClean}`;
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const history = (submissionHistory.get(clientIdentifier) || []).filter(t => now - t < windowMs);
  if (history.length >= 3) {
    return {
      valid: false,
      error: 'Submission rate limit reached. Please wait a few minutes before submitting another review.'
    };
  }
  history.push(now);
  submissionHistory.set(clientIdentifier, history);

  // 7. Duplicate detection (same customer email, same productId submitted within 24 hours)
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
  const existingRecent = await prisma.review.findFirst({
    where: {
      shop,
      productId,
      customerEmail: emailClean,
      createdAt: { gte: oneDayAgo }
    }
  });
  if (existingRecent) {
    return {
      valid: false,
      error: 'You have already submitted a review for this product recently. Thank you for your feedback!'
    };
  }

  // 8. Verified Buyer Verification
  // Check if this email purchased this product in our order records
  let isVerified = false;
  try {
    const matchingOrder = await prisma.orderRecord.findFirst({
      where: {
        shop,
        productId,
        customerEmail: emailClean
      }
    });
    if (matchingOrder) {
      isVerified = true;
    }
  } catch (err) {
    console.error('Verified buyer check error:', err);
  }

  return {
    valid: true,
    cleanData: {
      productId,
      shop,
      customerName: customerName.trim(),
      customerEmail: emailClean,
      rating: numRating,
      title: cleanTitle,
      body: cleanBody,
      verified: isVerified
    }
  };
}
