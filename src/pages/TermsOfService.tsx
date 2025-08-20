import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-8 w-8 text-white" />
            <h1 className="text-4xl font-bold text-white">
              Terms of Service
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Effective Date: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                These Terms of Service ("Terms") govern your use of the DigitalHub website 
                and services operated by DigitalHub ("we," "us," or "our"). By accessing 
                or using our Service, you agree to be bound by these Terms.
              </p>
              <p>
                If you disagree with any part of these terms, then you may not access the Service.
              </p>
            </CardContent>
          </Card>

          {/* Section 1 */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">1. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                DigitalHub operates a digital marketplace platform that allows users to 
                purchase and download digital products, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Software applications and scripts</li>
                <li>Digital templates and designs</li>
                <li>Educational content and courses</li>
                <li>Digital assets and resources</li>
                <li>Consulting and professional services</li>
              </ul>
              <p>
                We reserve the right to modify, suspend, or discontinue any aspect 
                of the Service at any time without prior notice.
              </p>
            </CardContent>
          </Card>

          {/* Section 2 - No Refunds */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">2. No Refund Policy</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <div className="bg-gray-800/80 p-4 rounded-lg border border-gray-600">
                <p className="font-semibold text-white mb-2">
                  ALL SALES ARE FINAL - NO REFUNDS
                </p>
                <p>
                  Due to the nature of digital products, all purchases are final 
                  and non-refundable. This policy applies without exception.
                </p>
              </div>
              <p>This no-refund policy applies in all circumstances, including but not limited to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Change of mind after purchase</li>
                <li>Technical incompatibility with user systems</li>
                <li>User error in product selection</li>
                <li>Failure to meet user expectations</li>
                <li>User's inability to use the product</li>
                <li>Duplicate purchases</li>
                <li>Any other reason whatsoever</li>
              </ul>
              <p className="font-medium">
                By completing a purchase, you acknowledge and accept this no-refund policy.
              </p>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">3. User Accounts and Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>When using our Service, you agree to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not engage in fraudulent or deceptive practices</li>
                <li>Not interfere with or disrupt the Service</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">4. Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                The Service and its original content, features, and functionality are owned 
                by DigitalHub and are protected by international copyright, trademark, 
                patent, trade secret, and other intellectual property laws.
              </p>
              <p>
                Upon purchase of digital products, you receive a limited, non-exclusive, 
                non-transferable license to use the product for personal or business purposes 
                as specified in the product description.
              </p>
              <p className="font-medium">You may NOT:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Resell, redistribute, or share purchased products</li>
                <li>Modify products and claim them as your own work</li>
                <li>Use products in violation of applicable laws</li>
                <li>Reverse engineer or attempt to extract source code</li>
                <li>Remove or alter any proprietary notices</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">5. Disclaimers and Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis without 
                warranties of any kind, either express or implied.
              </p>
              <p>We do not warrant that:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>The Service will meet your specific requirements</li>
                <li>The Service will be uninterrupted, timely, secure, or error-free</li>
                <li>Results obtained from the Service will be accurate or reliable</li>
                <li>Defects will be corrected</li>
              </ul>
              <div className="bg-gray-800/80 p-4 rounded-lg border border-gray-600">
                <p className="font-semibold text-white mb-2">LIMITATION OF LIABILITY</p>
                <p>
                  In no event shall DigitalHub, its directors, employees, partners, agents, 
                  suppliers, or affiliates be liable for any indirect, incidental, special, 
                  consequential, or punitive damages, including without limitation, loss of 
                  profits, data, use, goodwill, or other intangible losses, resulting from 
                  your use of the Service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 6 */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">6. Account Termination</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                We may terminate or suspend your account and access to the Service 
                immediately, without prior notice or liability, for any reason, including:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Breach of these Terms</li>
                <li>Fraudulent or illegal activity</li>
                <li>Violation of intellectual property rights</li>
                <li>Abusive behavior toward other users or our team</li>
                <li>Any conduct that we deem harmful to the Service or other users</li>
              </ul>
              <p>
                Upon termination, your right to use the Service will cease immediately, 
                but downloaded products may continue to be used according to their license terms.
              </p>
            </CardContent>
          </Card>

          {/* Section 7 */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">7. Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                Your privacy is important to us. Our Privacy Policy explains how we collect, 
                use, and protect your information when you use our Service.
              </p>
              <p>By using our Service, you agree to the collection and use of information 
                in accordance with our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Section 8 */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">8. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                We reserve the right to modify or replace these Terms at any time at our 
                sole discretion. If a revision is material, we will try to provide at least 
                30 days' notice prior to any new terms taking effect.
              </p>
              <p>
                What constitutes a material change will be determined at our sole discretion. 
                By continuing to access or use our Service after those revisions become 
                effective, you agree to be bound by the revised terms.
              </p>
            </CardContent>
          </Card>

          {/* Section 9 */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">9. Governing Law and Jurisdiction</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                These Terms shall be interpreted and governed by the laws of France, 
                without regard to its conflict of law provisions.
              </p>
              <p>
                Any disputes arising out of or relating to these Terms or the Service 
                shall be subject to the exclusive jurisdiction of the courts of France.
              </p>
            </CardContent>
          </Card>

          {/* Section 10 */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">10. Severability</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                If any provision of these Terms is held to be invalid, illegal, or 
                unenforceable by a court of competent jurisdiction, the validity, legality, 
                and enforceability of the remaining provisions shall not in any way be 
                affected or impaired thereby.
              </p>
            </CardContent>
          </Card>

          {/* Section 11 */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">11. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                If you have any questions about these Terms of Service, please contact us 
                through the appropriate channels provided on our website.
              </p>
              <div className="bg-gray-800/80 p-4 rounded-lg border border-gray-600">
                <p className="font-semibold text-white mb-2">Important Notice</p>
                <p>
                  Please do not contact us regarding refund requests, as all sales are 
                  final. Contact us only for legitimate technical support, billing 
                  inquiries, or legal matters.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* Footer */}
        <div className="text-center space-y-4">
          <p className="text-gray-400">
            By using DigitalHub, you acknowledge that you have read, understood, 
            and agree to be bound by these Terms of Service.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Return to Home
            </Button>
            <Button 
              onClick={() => window.print()}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              Print Terms
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} DigitalHub. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
