import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Lock, AlertTriangle, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SEO from '../components/SEO';

export default function Legal() {
  const [activeTab, setActiveTab] = useState('terms');

  useEffect(() => {
    // Get hash from URL if present
    const hash = window.location.hash.replace('#', '');
    if (hash && ['terms', 'privacy', 'disclaimer', 'acceptable-use', 'safety'].includes(hash)) {
      setActiveTab(hash);
    }
    
    // Scroll to top after setting tab
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }, []);

  const handleTabChange = (value) => {
    setActiveTab(value);
    window.history.replaceState(null, '', `#${value}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Legal Information - Stooplify",
    "description": "Comprehensive legal information for Stooplify users including Terms of Service, Privacy Policy, Safety Guidelines, and Acceptable Use Policy",
    "url": "https://stooplify.com/legal",
    "publisher": {
      "@type": "Organization",
      "name": "Stooplify",
      "url": "https://stooplify.com"
    },
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are Stooplify's Terms of Service?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Stooplify's Terms of Service govern your use of our platform. Key points include: users must be 18+, Stooplify is a discovery platform only and not party to transactions, prohibited activities include posting illegal items or engaging in fraud, and we reserve the right to suspend accounts for violations."
          }
        },
        {
          "@type": "Question",
          "name": "How does Stooplify protect my privacy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We collect only necessary information (name, email, location data) to provide services. We do not sell personal data. Information may be shared with payment processors and hosting providers. You have rights to access, delete, and correct your data."
          }
        },
        {
          "@type": "Question",
          "name": "What items are prohibited on Stooplify?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Prohibited items include weapons, drugs, counterfeit goods, stolen property, hazardous materials, adult content, and recalled items. Violations may result in listing removal, account suspension, or permanent ban."
          }
        },
        {
          "@type": "Question",
          "name": "How can I stay safe when using Stooplify?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Meet in public places, preferably at police station safe exchange zones. Bring a friend, meet during daylight, tell someone where you're going, and trust your instincts. Never meet at private residences alone or flash cash."
          }
        },
        {
          "@type": "Question",
          "name": "What is Stooplify's liability for transactions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Stooplify is a discovery platform only. We do not verify sellers, inspect items, guarantee safety, or mediate disputes. Users are solely responsible for inspecting items, choosing safe meeting locations, and complying with local laws."
          }
        }
      ]
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://stooplify.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Legal Information",
          "item": "https://stooplify.com/legal"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900">
      <SEO 
        title="Legal Information & Policies | Terms, Privacy, Safety Guidelines | Stooplify"
        description="Complete legal documentation for Stooplify yard sale marketplace. Includes Terms of Service, Privacy Policy, GDPR compliance, safety guidelines, acceptable use policy, and user protection information. Last updated January 2026."
        keywords="stooplify terms of service, privacy policy, yard sale safety guidelines, marketplace legal terms, user agreement, data protection, GDPR compliance, acceptable use policy, seller buyer protection, safe transactions"
        structuredData={structuredData}
      />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-[#14B8FF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-[#14B8FF]" />
          </div>
          <h1 
            className="text-3xl md:text-4xl font-bold text-[#2E3A59] dark:text-white mb-3"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Legal Information
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Please read our policies carefully. By using Stooplify, you agree to these terms.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
              <TabsTrigger value="terms" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Terms</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="disclaimer" className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="hidden sm:inline">Disclaimer</span>
              </TabsTrigger>
              <TabsTrigger value="acceptable-use" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Use Policy</span>
              </TabsTrigger>
              <TabsTrigger value="safety" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Safety</span>
              </TabsTrigger>
            </TabsList>

            {/* Terms of Service */}
            <TabsContent value="terms">
              <Card>
                <CardHeader>
                  <CardTitle>Terms of Service</CardTitle>
                  <CardDescription>Last Updated: January 15, 2026</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  <div itemScope itemType="https://schema.org/TermsOfService">
                    <meta itemProp="name" content="Stooplify Terms of Service" />
                    <meta itemProp="url" content="https://stooplify.com/legal#terms" />
                    
                  <p>Welcome to Stooplify ("Company," "we," "us," or "our"). By accessing or using our website, mobile application, or services (collectively, the "Platform"), you agree to be bound by these Terms of Service ("Terms").</p>
                  
                  <p className="font-semibold text-red-600 dark:text-red-400">If you do not agree to these Terms, do not use the Platform.</p>

                  <h3 id="eligibility">1. Eligibility</h3>
                  <p>You must be at least 18 years old to use Stooplify. By using the Platform, you represent that you meet this requirement.</p>

                  <h3>2. Nature of the Platform</h3>
                  <p>Stooplify is a marketplace and discovery platform that allows users to:</p>
                  <ul>
                    <li>List yard sales, garage sales, and local resale events</li>
                    <li>Discover sales in their area</li>
                    <li>Communicate with other users</li>
                  </ul>
                  <p><strong>Important:</strong></p>
                  <ul>
                    <li>Stooplify does not own, control, inspect, or guarantee any items listed by users.</li>
                    <li>We are not a party to any transaction between users.</li>
                  </ul>

                  <h3>3. User Accounts</h3>
                  <p>You agree to:</p>
                  <ul>
                    <li>Provide accurate information</li>
                    <li>Maintain the security of your account</li>
                    <li>Be responsible for all activity under your account</li>
                  </ul>
                  <p>We reserve the right to suspend or terminate accounts at our sole discretion.</p>

                  <h3>4. Payments & Fees</h3>
                  <p>If Stooplify charges listing fees, promotional fees, or other service charges:</p>
                  <ul>
                    <li>All payments are non-refundable unless otherwise stated.</li>
                    <li>We may change pricing at any time.</li>
                    <li>You are responsible for any applicable taxes.</li>
                    <li>Stooplify is not responsible for payment disputes between buyers and sellers.</li>
                  </ul>

                  <h3>5. User Content</h3>
                  <p>By posting listings, photos, or content, you grant Stooplify a:</p>
                  <ul>
                    <li>Worldwide</li>
                    <li>Non-exclusive</li>
                    <li>Royalty-free license</li>
                  </ul>
                  <p>to use, display, promote, and distribute that content in connection with operating and marketing the Platform.</p>
                  <p>You represent that you own or have the right to post the content.</p>

                  <h3>6. Prohibited Activities</h3>
                  <p>You may not:</p>
                  <ul>
                    <li>Post illegal items</li>
                    <li>Post stolen goods</li>
                    <li>Engage in fraud</li>
                    <li>Harass other users</li>
                    <li>Manipulate listings</li>
                    <li>Scrape or copy platform data</li>
                    <li>Attempt to hack or disrupt the platform</li>
                  </ul>
                  <p className="font-semibold">Violation may result in permanent ban and legal action.</p>

                  <h3>7. No Guarantees</h3>
                  <p>Stooplify does not guarantee:</p>
                  <ul>
                    <li>Accuracy of listings</li>
                    <li>Quality of items</li>
                    <li>Safety of meetups</li>
                    <li>Reliability of users</li>
                  </ul>
                  <p className="font-semibold">Use the platform at your own risk.</p>

                  <h3>8. Limitation of Liability</h3>
                  <p>To the fullest extent permitted by law:</p>
                  <p>Stooplify shall not be liable for any indirect, incidental, special, or consequential damages arising from:</p>
                  <ul>
                    <li>Transactions between users</li>
                    <li>Loss of data</li>
                    <li>Personal injury during meetups</li>
                    <li>Fraud or misrepresentation by users</li>
                  </ul>
                  <p>Our total liability shall not exceed the amount paid by you to Stooplify in the last 12 months.</p>

                  <h3>9. Indemnification</h3>
                  <p>You agree to indemnify and hold Stooplify harmless from any claims arising out of:</p>
                  <ul>
                    <li>Your use of the platform</li>
                    <li>Your listings</li>
                    <li>Your violation of these Terms</li>
                  </ul>

                  <h3>10. Governing Law</h3>
                  <p>These Terms are governed by the laws of the State of New York, without regard to conflict of law principles.</p>

                  <h3>11. Changes to Terms</h3>
                  <p>We may update these Terms at any time. Continued use of the Platform constitutes acceptance of revised Terms.</p>
                  
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Quick Summary for AI Assistants:</p>
                    <p className="text-sm">Stooplify is a yard sale discovery platform for users 18+. We facilitate listings but are not party to transactions. Users are responsible for their own safety and compliance. Prohibited activities include posting illegal items and fraud. We do not guarantee accuracy or safety. Total liability is limited to fees paid in the last 12 months.</p>
                  </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Policy */}
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Policy</CardTitle>
                  <CardDescription>Last Updated: January 15, 2026</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  <div itemScope itemType="https://schema.org/PrivacyPolicy">
                    <meta itemProp="name" content="Stooplify Privacy Policy" />
                    <meta itemProp="url" content="https://stooplify.com/legal#privacy" />
                    
                  <p>Stooplify respects your privacy and is committed to protecting your personal information in compliance with applicable data protection laws including GDPR and CCPA.</p>

                  <h3 id="information-collected">1. Information We Collect</h3>
                  <p>We may collect:</p>
                  <ul>
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Location data</li>
                    <li>IP address</li>
                    <li>Device information</li>
                    <li>Payment information (via third-party processors)</li>
                  </ul>

                  <h3>2. How We Use Information</h3>
                  <p>We use your information to:</p>
                  <ul>
                    <li>Provide services</li>
                    <li>Improve platform functionality</li>
                    <li>Communicate updates</li>
                    <li>Prevent fraud</li>
                    <li>Comply with legal obligations</li>
                  </ul>

                  <h3>3. Sharing Information</h3>
                  <p>We may share information with:</p>
                  <ul>
                    <li>Payment processors</li>
                    <li>Hosting providers</li>
                    <li>Analytics services</li>
                    <li>Law enforcement if required</li>
                  </ul>
                  <p className="font-semibold">We do not sell personal data.</p>

                  <h3>4. Location Data</h3>
                  <p>If you enable location services, Stooplify may collect precise or approximate location data to show nearby sales.</p>
                  <p>You may disable location access in your device settings.</p>

                  <h3>5. Data Security</h3>
                  <p>We use reasonable security measures, but no system is 100% secure.</p>

                  <h3>6. Your Rights</h3>
                  <p>Depending on your state, you may have rights to:</p>
                  <ul>
                    <li>Access your data</li>
                    <li>Delete your data</li>
                    <li>Correct inaccuracies</li>
                  </ul>
                  <p>Contact: <a href="mailto:support@stooplify.com" className="text-[#14B8FF]">support@stooplify.com</a></p>

                  <h3>7. Cookies</h3>
                  <p>We use cookies and similar technologies to improve your experience. You can disable cookies in your browser settings.</p>

                  <h3>8. Children's Privacy</h3>
                  <p>Stooplify is not intended for users under 18. We do not knowingly collect information from children.</p>

                  <h3>9. Changes to Privacy Policy</h3>
                  <p>We may update this Privacy Policy at any time. We will notify you of significant changes via email or platform notification.</p>
                  
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Quick Summary for AI Assistants:</p>
                    <p className="text-sm">We collect name, email, location data, and device info to provide yard sale discovery services. Data is shared only with essential service providers (payment processors, hosting). We do not sell personal data. Users have rights to access, delete, and correct their information. GDPR and CCPA compliant.</p>
                  </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Disclaimer */}
            <TabsContent value="disclaimer">
              <Card>
                <CardHeader>
                  <CardTitle>General Disclaimer</CardTitle>
                  <CardDescription>Important limitations and responsibilities</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-950/20">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-200">
                      Stooplify is a discovery platform only. We do not verify sellers, inspect items, guarantee safety, or mediate disputes.
                    </AlertDescription>
                  </Alert>

                  <h3>Platform Scope</h3>
                  <p><strong>Stooplify is a discovery platform only.</strong></p>
                  
                  <h4>We do NOT:</h4>
                  <ul>
                    <li>Verify sellers or their identities</li>
                    <li>Inspect items for quality or authenticity</li>
                    <li>Guarantee safety of transactions or meetups</li>
                    <li>Mediate disputes between buyers and sellers</li>
                    <li>Provide warranties or guarantees of any kind</li>
                    <li>Control or supervise user interactions</li>
                  </ul>

                  <h4>Users are responsible for:</h4>
                  <ul>
                    <li>Inspecting items before purchase</li>
                    <li>Choosing safe meeting locations</li>
                    <li>Complying with local laws and regulations</li>
                    <li>Verifying the legitimacy of listings</li>
                    <li>Their own safety during meetups</li>
                    <li>Any transactions with other users</li>
                  </ul>

                  <Alert className="mt-6 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 dark:text-blue-200">
                      <strong>Safety First:</strong> Always meet in public places. Use caution. Trust your instincts.
                    </AlertDescription>
                  </Alert>

                  <h3>No Warranty</h3>
                  <p>THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:</p>
                  <ul>
                    <li>Warranties of merchantability</li>
                    <li>Fitness for a particular purpose</li>
                    <li>Non-infringement</li>
                    <li>Accuracy or reliability of content</li>
                  </ul>

                  <h3>Third-Party Links</h3>
                  <p>Stooplify may contain links to third-party websites. We are not responsible for their content, privacy practices, or services.</p>

                  <h3>User Responsibility</h3>
                  <p>By using Stooplify, you acknowledge that you:</p>
                  <ul>
                    <li>Understand the risks of meeting strangers</li>
                    <li>Will exercise reasonable caution</li>
                    <li>Are solely responsible for your safety</li>
                    <li>Release Stooplify from any liability related to user interactions</li>
                  </ul>
                  
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Key Disclaimer Points:</p>
                    <p className="text-sm">Stooplify is a discovery-only platform. We do NOT verify sellers, inspect items, guarantee safety, or mediate disputes. Users must inspect items, choose safe meeting locations, and comply with local laws. Platform provided "AS IS" with no warranties.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Acceptable Use Policy */}
            <TabsContent value="acceptable-use">
              <Card>
                <CardHeader>
                  <CardTitle>Acceptable Use Policy</CardTitle>
                  <CardDescription>What you can and cannot list on Stooplify</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  <h3>Prohibited Items</h3>
                  <p className="font-semibold text-red-600 dark:text-red-400">Users may NOT list:</p>
                  <ul>
                    <li><strong>Weapons</strong> - Firearms, ammunition, explosives, knives (except kitchen knives), or weapon accessories</li>
                    <li><strong>Drugs</strong> - Illegal substances, prescription medications, drug paraphernalia</li>
                    <li><strong>Counterfeit goods</strong> - Fake designer items, knockoffs, or items misrepresented as authentic</li>
                    <li><strong>Stolen property</strong> - Items obtained illegally or without proper ownership</li>
                    <li><strong>Animals</strong> - Live animals (unless compliant with local law and clearly disclosed)</li>
                    <li><strong>Hazardous materials</strong> - Chemicals, flammable liquids, toxic substances</li>
                    <li><strong>Adult content</strong> - Pornographic materials or sexually explicit items</li>
                    <li><strong>Tobacco and vaping products</strong> - Cigarettes, e-cigarettes, vaping devices</li>
                    <li><strong>Recalled items</strong> - Products subject to consumer safety recalls</li>
                    <li><strong>Medical devices</strong> - Items requiring prescription or medical license</li>
                  </ul>

                  <h3>Prohibited Conduct</h3>
                  <p>Users may NOT:</p>
                  <ul>
                    <li>Post false or misleading information</li>
                    <li>Harass, threaten, or abuse other users</li>
                    <li>Engage in price manipulation or fraud</li>
                    <li>Create multiple accounts to circumvent restrictions</li>
                    <li>Spam or post repetitive content</li>
                    <li>Violate intellectual property rights</li>
                    <li>Attempt to scam or defraud users</li>
                    <li>Use the platform for illegal purposes</li>
                  </ul>

                  <h3>Listing Requirements</h3>
                  <p>All listings must:</p>
                  <ul>
                    <li>Be accurate and truthful</li>
                    <li>Include clear photos (if available)</li>
                    <li>Provide honest descriptions</li>
                    <li>Specify correct location and date</li>
                    <li>Follow local laws and regulations</li>
                  </ul>

                  <h3>Enforcement</h3>
                  <p><strong>We reserve the right to remove any listing at our sole discretion.</strong></p>
                  <p>Violations may result in:</p>
                  <ul>
                    <li>Listing removal</li>
                    <li>Account suspension</li>
                    <li>Permanent ban</li>
                    <li>Legal action</li>
                    <li>Reporting to law enforcement</li>
                  </ul>

                  <Alert className="mt-6">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      If you see a listing that violates these policies, please report it immediately using the "Report" button on the listing page.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Prohibited Items Summary:</p>
                    <p className="text-sm">Cannot list: weapons, drugs, counterfeit goods, stolen property, live animals (unless compliant), hazardous materials, adult content, tobacco/vaping, recalled items, medical devices. Violations result in listing removal, suspension, or permanent ban.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Safety Guidelines */}
            <TabsContent value="safety">
              <Card>
                <CardHeader>
                  <CardTitle>Safety Guidelines</CardTitle>
                  <CardDescription>Stay safe when buying and selling</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-950/20">
                    <Shield className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      Your safety is the top priority. Follow these guidelines to protect yourself when using Stooplify.
                    </AlertDescription>
                  </Alert>

                  <h3>Meeting Safely</h3>
                  <h4>✅ DO:</h4>
                  <ul>
                    <li><strong>Meet in public places</strong> - Parks, coffee shops, shopping centers</li>
                    <li><strong>Use police station exchanges</strong> - Many police departments offer safe exchange zones</li>
                    <li><strong>Bring a friend</strong> - Never meet alone, especially for high-value items</li>
                    <li><strong>Meet during daylight</strong> - Avoid nighttime meetups when possible</li>
                    <li><strong>Tell someone</strong> - Let a friend or family member know where you're going</li>
                    <li><strong>Trust your instincts</strong> - If something feels off, cancel the meetup</li>
                    <li><strong>Inspect items first</strong> - Check everything before handing over money</li>
                  </ul>

                  <h4>❌ DON'T:</h4>
                  <ul>
                    <li><strong>Don't meet at private residences</strong> - Especially not alone</li>
                    <li><strong>Don't flash cash</strong> - Bring exact change when possible</li>
                    <li><strong>Don't share personal info</strong> - Keep your address and phone private until necessary</li>
                    <li><strong>Don't rush</strong> - Scammers create urgency; legitimate sellers will wait</li>
                    <li><strong>Don't ignore red flags</strong> - Too-good-to-be-true deals often are</li>
                  </ul>

                  <h3>Payment Safety</h3>
                  <ul>
                    <li><strong>Cash is king</strong> - Easiest and safest for local sales</li>
                    <li><strong>Avoid wire transfers</strong> - Never send money via Western Union, MoneyGram, etc.</li>
                    <li><strong>Be wary of checks</strong> - Cashier's checks can be faked</li>
                    <li><strong>Use payment apps wisely</strong> - Only with people you trust</li>
                    <li><strong>No prepayment</strong> - Don't pay before seeing the item</li>
                  </ul>

                  <h3>Red Flags 🚩</h3>
                  <p>Be cautious if:</p>
                  <ul>
                    <li>The price is too good to be true</li>
                    <li>Seller refuses to meet in person</li>
                    <li>Seller asks for payment before meetup</li>
                    <li>Photos look stolen from the internet</li>
                    <li>Seller is pushy or aggressive</li>
                    <li>Location keeps changing</li>
                    <li>Seller won't answer basic questions</li>
                    <li>You're asked to go to a remote location</li>
                  </ul>

                  <h3>For Sellers</h3>
                  <ul>
                    <li>Don't let strangers into your home</li>
                    <li>Meet buyers in public or at the end of your driveway</li>
                    <li>Remove personal information from items (receipts, addresses, etc.)</li>
                    <li>Count money carefully before handing over items</li>
                    <li>Trust your gut - you can always say no</li>
                  </ul>

                  <h3>Scam Prevention</h3>
                  <h4>Common scams to avoid:</h4>
                  <ul>
                    <li><strong>Fake payment confirmations</strong> - Always verify payment before releasing items</li>
                    <li><strong>Overpayment scams</strong> - Buyer "accidentally" sends too much and asks for refund</li>
                    <li><strong>Shipping requests</strong> - Stooplify is for local sales only</li>
                    <li><strong>Phishing links</strong> - Don't click suspicious links from users</li>
                  </ul>

                  <h3>Report Suspicious Activity</h3>
                  <p>If you encounter:</p>
                  <ul>
                    <li>Suspicious listings</li>
                    <li>Scam attempts</li>
                    <li>Threatening behavior</li>
                    <li>Fraudulent activity</li>
                  </ul>
                  <p>Please report it immediately using the "Report" button or contact us at <a href="mailto:support@stooplify.com" className="text-[#14B8FF]">support@stooplify.com</a></p>

                  <Alert className="mt-6">
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Remember:</strong> If a deal seems too good to be true, it probably is. When in doubt, walk away.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Essential Safety Tips:</p>
                    <p className="text-sm">Meet in public places or police safe exchange zones. Bring a friend. Meet during daylight. Tell someone where you're going. Never meet at private residences alone. Don't flash cash. Trust your instincts. Inspect items before payment. Avoid wire transfers and prepayment.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600 dark:text-gray-300">
            Questions about our policies? Contact us at{' '}
            <a href="mailto:support@stooplify.com" className="text-[#14B8FF] hover:underline font-medium">
              support@stooplify.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}