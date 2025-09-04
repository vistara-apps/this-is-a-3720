# AdSpin AI - API Documentation

This document outlines the API integrations and backend services used in AdSpin AI.

## 🔧 Service Architecture

AdSpin AI uses a modern serverless architecture with the following services:

- **Frontend**: React SPA hosted on Vercel/Netlify
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **AI Generation**: OpenAI DALL-E 3 & GPT-4
- **Payments**: Stripe
- **Social Media**: Instagram Graph API, TikTok API

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  userId UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  subscriptionTier VARCHAR(50) DEFAULT 'basic',
  usage JSONB DEFAULT '{"generations": 0, "posts": 0, "limit": 100}',
  stripeCustomerId VARCHAR(255),
  stripeSubscriptionId VARCHAR(255)
);
```

### Uploaded Images Table
```sql
CREATE TABLE uploaded_images (
  imageId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES users(userId),
  imageUrl TEXT NOT NULL,
  uploadedAt TIMESTAMP DEFAULT NOW(),
  prompt TEXT,
  fileName VARCHAR(255),
  fileSize INTEGER
);
```

### Generated Ad Variations Table
```sql
CREATE TABLE generated_ad_variations (
  variationId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imageId UUID REFERENCES uploaded_images(imageId),
  userId UUID REFERENCES users(userId),
  imageUrl TEXT NOT NULL,
  platform VARCHAR(50) NOT NULL,
  style VARCHAR(50) NOT NULL,
  prompt TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  postStatus VARCHAR(50) DEFAULT 'draft',
  engagementRate DECIMAL(5,2),
  reach INTEGER,
  impressions INTEGER
);
```

### Social Accounts Table
```sql
CREATE TABLE social_accounts (
  accountId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES users(userId),
  platform VARCHAR(50) NOT NULL,
  accountHandle VARCHAR(255) NOT NULL,
  accessToken TEXT,
  refreshToken TEXT,
  tokenExpiresAt TIMESTAMP,
  connectedAt TIMESTAMP DEFAULT NOW(),
  isActive BOOLEAN DEFAULT true
);
```

## 🤖 OpenAI Integration

### Image Generation Service

**Endpoint**: OpenAI DALL-E 3 API
**Purpose**: Generate ad variations from product images

```javascript
// Service: src/services/openai.js
const response = await openai.images.generate({
  model: "dall-e-3",
  prompt: buildPrompt({ style, platform, customPrompt }),
  n: 1,
  size: platform === 'instagram' ? '1024x1024' : '1024x1792',
  quality: 'standard',
  style: 'vivid'
})
```

**Prompt Engineering**:
- Style-specific prompts (modern, vibrant, luxury, playful)
- Platform-specific formatting
- Custom user prompts integration
- Professional advertising context

### Ad Copy Generation

**Endpoint**: OpenAI GPT-4 API
**Purpose**: Generate engaging ad copy for social media posts

```javascript
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: prompt }],
  max_tokens: 150,
  temperature: 0.7
})
```

## 💳 Stripe Integration

### Subscription Plans

**Basic Plan**: $19/month
- Price ID: `price_basic_monthly`
- 100 generations/month
- 10 posts/month

**Pro Plan**: $49/month
- Price ID: `price_pro_monthly`
- Unlimited generations
- 50 posts/month

### Checkout Session Creation

```javascript
// Backend endpoint: /api/create-checkout-session
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price: priceId,
    quantity: 1,
  }],
  mode: 'subscription',
  success_url: `${domain}/dashboard?success=true`,
  cancel_url: `${domain}/billing?canceled=true`,
  customer_email: userEmail,
})
```

### Customer Portal

```javascript
// Backend endpoint: /api/create-portal-session
const portalSession = await stripe.billingPortal.sessions.create({
  customer: customerId,
  return_url: `${domain}/billing`,
})
```

## 📱 Social Media APIs

### Instagram Graph API

**Authentication**: OAuth 2.0
**Scopes**: `user_profile,user_media`

#### Post Creation Flow
1. Create media object
2. Publish media

```javascript
// Step 1: Create media
const mediaResponse = await fetch(
  `https://graph.facebook.com/v18.0/${accountId}/media`,
  {
    method: 'POST',
    body: JSON.stringify({
      image_url: imageUrl,
      caption: caption,
      access_token: accessToken,
    }),
  }
)

// Step 2: Publish media
const publishResponse = await fetch(
  `https://graph.facebook.com/v18.0/${accountId}/media_publish`,
  {
    method: 'POST',
    body: JSON.stringify({
      creation_id: mediaData.id,
      access_token: accessToken,
    }),
  }
)
```

### TikTok API

**Authentication**: OAuth 2.0
**Scopes**: `user.info.basic,video.upload`

#### Video Upload Flow
```javascript
const response = await fetch('https://open-api.tiktok.com/share/video/upload/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    video_url: videoUrl,
    text: caption,
    privacy_level: 'MUTUAL_FOLLOW_FRIENDS',
    disable_duet: false,
    disable_comment: false,
    disable_stitch: false,
  }),
})
```

## 🔐 Authentication Flow

### Supabase Auth Integration

```javascript
// Sign Up
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`
  }
})

// Sign In
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
})

// Get Current User
const { data: { user }, error } = await supabase.auth.getUser()
```

### Social OAuth Flow

1. **Initiate OAuth**: Redirect to platform OAuth URL
2. **Handle Callback**: Exchange code for access token
3. **Store Tokens**: Save encrypted tokens in database
4. **Account Verification**: Verify account access

## 📊 Analytics Data Flow

### Performance Metrics Collection

```javascript
// Mock analytics data structure
const analyticsData = {
  overview: {
    totalGenerations: 156,
    totalPosts: 42,
    avgEngagement: 4.2,
    totalReach: 125000,
    totalImpressions: 450000
  },
  platformBreakdown: {
    instagram: { posts: 24, engagement: 3.8, reach: 75000 },
    tiktok: { posts: 18, engagement: 4.7, reach: 50000 }
  },
  topPerformers: [
    {
      platform: 'tiktok',
      style: 'vibrant',
      engagement: 12.5,
      reach: 25300,
      date: '2024-12-01'
    }
  ]
}
```

## 🔄 Error Handling

### API Error Responses

```javascript
// Standard error response format
{
  success: false,
  error: {
    code: 'GENERATION_FAILED',
    message: 'Failed to generate variations',
    details: 'OpenAI API rate limit exceeded'
  }
}
```

### Fallback Mechanisms

1. **OpenAI Failures**: Fall back to mock data
2. **Social Media Failures**: Show error with retry option
3. **Payment Failures**: Redirect to billing page
4. **Network Issues**: Show offline indicator

## 🚀 Rate Limiting

### OpenAI API Limits
- **DALL-E 3**: 50 requests/minute
- **GPT-4**: 500 requests/minute
- **Tokens**: 10,000 tokens/minute

### Social Media API Limits
- **Instagram**: 200 requests/hour per user
- **TikTok**: 1000 requests/day per app

### Implementation
```javascript
// Rate limiting with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      )
    }
  }
}
```

## 🔒 Security Best Practices

### API Key Management
- Store in environment variables
- Use different keys for development/production
- Rotate keys regularly
- Monitor usage and set alerts

### Data Protection
- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Implement CORS properly
- Validate all inputs

### Access Control
- Row Level Security (RLS) in Supabase
- JWT token validation
- Rate limiting per user
- Audit logging

## 📝 API Endpoints (Backend)

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/user` - Get current user

### Image Generation
- `POST /api/generate/variations` - Generate ad variations
- `GET /api/generate/history` - Get generation history
- `DELETE /api/generate/:id` - Delete generated variation

### Social Media
- `GET /api/social/oauth/:platform` - Get OAuth URL
- `POST /api/social/callback/:platform` - Handle OAuth callback
- `POST /api/social/post` - Post to social media
- `GET /api/social/accounts` - Get connected accounts

### Billing
- `POST /api/billing/create-checkout` - Create Stripe checkout
- `POST /api/billing/create-portal` - Create customer portal
- `POST /api/billing/webhook` - Handle Stripe webhooks
- `GET /api/billing/usage` - Get usage statistics

### Analytics
- `GET /api/analytics/overview` - Get overview stats
- `GET /api/analytics/performance` - Get performance metrics
- `GET /api/analytics/export` - Export analytics data

## 🧪 Testing

### API Testing
```bash
# Test OpenAI integration
curl -X POST http://localhost:3000/api/generate/variations \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "...", "style": "modern", "platform": "instagram"}'

# Test Stripe integration
curl -X POST http://localhost:3000/api/billing/create-checkout \
  -H "Content-Type: application/json" \
  -d '{"priceId": "price_basic_monthly", "userId": "..."}'
```

### Environment Variables for Testing
```env
# Test environment
VITE_OPENAI_API_KEY=sk-test-...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_SUPABASE_URL=https://test-project.supabase.co
```

## 📈 Monitoring & Logging

### Key Metrics to Monitor
- API response times
- Error rates by service
- User generation/posting activity
- Subscription conversion rates
- Social media posting success rates

### Logging Strategy
```javascript
// Structured logging
console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  level: 'info',
  service: 'openai',
  action: 'generate_variations',
  userId: user.id,
  duration: 2500,
  success: true
}))
```

---

This API documentation provides a comprehensive overview of all integrations and backend services used in AdSpin AI. For specific implementation details, refer to the service files in the `src/services/` directory.
