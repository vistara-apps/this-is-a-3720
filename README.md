# AdSpin AI - AI-Powered Ad Variation Generator

AdSpin AI is a powerful web application that generates multiple ad creative variations using AI and automatically posts them to social media platforms for testing. Built with React, Tailwind CSS, and integrated with OpenAI, Supabase, and Stripe.

## 🚀 Features

### Core Features
- **AI-Powered Visual Remixing**: Upload a product image and generate 3-5 distinct ad variations using OpenAI DALL-E
- **Platform-Specific Adaptation**: Automatically optimizes creatives for Instagram (1:1) and TikTok (9:16) formats
- **Automated Social Media Deployment**: Post generated variations directly to connected test accounts
- **Test Account Management**: Setup and manage dedicated test accounts for performance evaluation

### Additional Features
- **Subscription Management**: Tiered pricing with usage limits and Stripe integration
- **Analytics Dashboard**: Track performance metrics, engagement rates, and top performers
- **Social Account Integration**: Connect Instagram and TikTok accounts via OAuth
- **Real-time Generation**: Live progress tracking with fallback mechanisms
- **Responsive Design**: Mobile-first design with glass morphism UI

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage)
- **AI Services**: OpenAI DALL-E 3, GPT-4
- **Payments**: Stripe
- **Social APIs**: Instagram Graph API, TikTok API
- **Icons**: Lucide React

## 📋 Prerequisites

Before running this application, you'll need:

1. **Node.js** (v16 or higher)
2. **Supabase Account** - For database and authentication
3. **OpenAI API Key** - For image generation
4. **Stripe Account** - For subscription management
5. **Instagram/TikTok Developer Accounts** - For social media integration

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/vistara-apps/this-is-a-3720.git
cd this-is-a-3720
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template and fill in your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your actual API keys:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_STRIPE_BASIC_PRICE_ID=your_basic_plan_price_id
VITE_STRIPE_PRO_PRICE_ID=your_pro_plan_price_id

# Instagram API Configuration
VITE_INSTAGRAM_CLIENT_ID=your_instagram_client_id

# TikTok API Configuration
VITE_TIKTOK_CLIENT_ID=your_tiktok_client_id
```

### 4. Database Setup

Create the following tables in your Supabase database:

```sql
-- Users table
CREATE TABLE users (
  userId UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  subscriptionTier VARCHAR(50) DEFAULT 'basic',
  usage JSONB DEFAULT '{"generations": 0, "posts": 0, "limit": 100}'
);

-- Uploaded Images table
CREATE TABLE uploaded_images (
  imageId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES users(userId),
  imageUrl TEXT NOT NULL,
  uploadedAt TIMESTAMP DEFAULT NOW(),
  prompt TEXT
);

-- Generated Ad Variations table
CREATE TABLE generated_ad_variations (
  variationId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imageId UUID REFERENCES uploaded_images(imageId),
  userId UUID REFERENCES users(userId),
  imageUrl TEXT NOT NULL,
  platform VARCHAR(50) NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  postStatus VARCHAR(50) DEFAULT 'draft'
);

-- Social Accounts table
CREATE TABLE social_accounts (
  accountId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES users(userId),
  platform VARCHAR(50) NOT NULL,
  accountHandle VARCHAR(255) NOT NULL,
  accessToken TEXT,
  connectedAt TIMESTAMP DEFAULT NOW()
);
```

### 5. Storage Setup

Create a storage bucket in Supabase for product images:

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `product-images`
3. Set it to public if you want direct access to images

### 6. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Configuration

### Stripe Setup

1. Create products and prices in your Stripe dashboard
2. Copy the price IDs to your environment variables
3. Set up webhooks for subscription events (optional)

### Social Media APIs

#### Instagram Setup
1. Create a Facebook App at developers.facebook.com
2. Add Instagram Basic Display product
3. Configure OAuth redirect URIs
4. Get your Client ID

#### TikTok Setup
1. Apply for TikTok for Developers access
2. Create an app and get API credentials
3. Configure OAuth settings

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AnalyticsDashboard.jsx
│   ├── BillingPanel.jsx
│   ├── GenerationPanel.jsx
│   ├── Header.jsx
│   ├── MainContent.jsx
│   ├── PreviewPanel.jsx
│   ├── Sidebar.jsx
│   ├── SocialAccountLinker.jsx
│   ├── SocialPostModal.jsx
│   ├── StatsCards.jsx
│   └── UploadArea.jsx
├── context/             # React context
│   └── AppContext.jsx
├── services/            # API services
│   ├── auth.js
│   ├── openai.js
│   ├── socialMedia.js
│   ├── stripe.js
│   └── supabase.js
├── App.jsx
├── index.css
└── main.jsx
```

## 🎨 Design System

The application uses a consistent design system with:

- **Colors**: Purple/pink gradients with glass morphism effects
- **Typography**: System fonts with proper hierarchy
- **Spacing**: 4px base unit with consistent scaling
- **Components**: Reusable UI components with variants
- **Animations**: Smooth transitions and hover effects

## 🔒 Security Considerations

- API keys are stored in environment variables
- Supabase handles authentication and authorization
- Social media tokens are encrypted in the database
- CORS is configured for production domains
- Input validation on all user inputs

## 📊 Business Model

### Subscription Tiers

**Basic Plan - $19/month**
- 100 ad generations per month
- 10 auto-posts per month
- Instagram & TikTok support
- Basic analytics
- Email support

**Pro Plan - $49/month**
- Unlimited ad generations
- 50 auto-posts per month
- Instagram & TikTok support
- Advanced analytics
- Priority support
- Custom prompts
- A/B testing insights

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy with automatic builds on push

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Email: support@adspin.ai
- Documentation: [docs.adspin.ai](https://docs.adspin.ai)

## 🔮 Roadmap

- [ ] Video ad generation support
- [ ] More social platforms (LinkedIn, Twitter)
- [ ] Advanced analytics with ML insights
- [ ] Team collaboration features
- [ ] API access for enterprise users
- [ ] White-label solutions

---

Built with ❤️ by the AdSpin AI team
