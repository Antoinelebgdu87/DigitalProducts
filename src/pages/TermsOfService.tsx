import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Shield, FileText, Eye, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/10 via-black to-red-950/5" />

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <FileText className="h-10 w-10 text-red-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">
              Terms of Service
            </h1>
          </div>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            Legal framework and usage guidelines for DigitalHub platform
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleDateString('en-US')}</span>
          </div>
        </motion.div>

        {/* Critical Notice */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="mb-8 border-red-500/30 bg-red-950/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Eye className="h-5 w-5" />
                MANDATORY READING
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-200">
                By accessing or using this website, you automatically agree to these terms.
                If you disagree with any part, discontinue use immediately.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-8">
          {/* Section 1: Acceptance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5 text-red-400" />
                  1. Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  Welcome to <strong className="text-red-400">DigitalHub</strong>. By accessing this website,
                  creating an account, downloading, purchasing, or using our services, you automatically accept
                  these terms of use without reservation.
                </p>
                <p>
                  If you do not accept these terms, you must immediately cease using our services.
                  This is non-negotiable.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 2: Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">2. Service Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  DigitalHub provides a platform for digital product sales including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Development scripts and tools</li>
                  <li>Templates and designs</li>
                  <li>Digital resources</li>
                  <li>Consultation services</li>
                  <li>Online training</li>
                  <li>Any other digital products we choose to offer</li>
                </ul>
                <p>
                  We reserve the right to modify, suspend, or discontinue any service at any time without notice.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 3: No Refunds */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="border-red-500/40 bg-red-950/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-red-400 text-xl">
                  3. NO REFUND POLICY - ABSOLUTE
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-900/40 p-6 rounded-xl border border-red-500/30">
                  <p className="font-bold text-red-300 text-xl mb-3">
                    ZERO REFUNDS - FINAL SALES ONLY
                  </p>
                  <p className="text-red-200">
                    All sales are <strong>FINAL</strong> and <strong>NON-REFUNDABLE</strong>.
                    Once purchased, the transaction is complete and irreversible.
                  </p>
                </div>
                <p className="text-gray-300">
                  This policy applies in ALL circumstances including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-400">
                  <li>Change of mind</li>
                  <li>Technical incompatibility</li>
                  <li>Unmet expectations</li>
                  <li>Purchase errors</li>
                  <li>User-side issues</li>
                  <li>Dissatisfaction with quality</li>
                  <li>Changed requirements</li>
                  <li>Any other reason whatsoever</li>
                </ul>
                <div className="bg-black/50 p-4 rounded-lg border border-red-500/20">
                  <p className="font-bold text-red-400">
                    Bottom line: You buy it, you own it. No exceptions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 4: User Responsibilities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">4. User Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>By using our services, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and current information</li>
                  <li>Maintain the security of your account</li>
                  <li>Not share your credentials</li>
                  <li>Not redistribute our products without authorization</li>
                  <li>Respect intellectual property rights</li>
                  <li>Not use our services for illegal purposes</li>
                  <li>Not spam or harass other users</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 5: Intellectual Property */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">5. Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  All site content (text, images, logos, code, designs) is protected by copyright
                  and belongs to DigitalHub or its licensed partners.
                </p>
                <p>
                  Purchasing a product grants you a personal, non-exclusive license. You may not:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Resell or redistribute our products</li>
                  <li>Modify and resell as your own work</li>
                  <li>Share on piracy platforms</li>
                  <li>Reverse engineer to create competitors</li>
                  <li>Use for commercial redistribution</li>
                </ul>
                <div className="bg-red-950/20 p-4 rounded-lg border border-red-500/30">
                  <p className="font-bold text-red-400">
                    Violation will result in legal action. We enforce our rights.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 6: Disclaimers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">6. Disclaimers and Limitations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  Our products are provided "as is" without any warranty. We do not guarantee:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Perfect functionality on your system</li>
                  <li>Compatibility with your specific requirements</li>
                  <li>Bug-free operation</li>
                  <li>Specific performance outcomes</li>
                  <li>Fitness for particular purposes</li>
                </ul>
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
                  <p>
                    <strong className="text-red-400">Liability Limitation:</strong> Our liability
                    cannot exceed the amount paid for the specific product. This is the maximum
                    extent of our responsibility.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 7: Account Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">7. Account Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  We reserve the right to suspend or terminate your account at any time,
                  for any reason, without notice or refund if:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>You violate these terms of use</li>
                  <li>You attempt to hack or damage our services</li>
                  <li>You engage in abusive behavior toward our team</li>
                  <li>You make refund demands despite clear no-refund policy</li>
                  <li>You cause legal issues for our platform</li>
                  <li>You engage in fraudulent activities</li>
                  <li>At our sole discretion for platform protection</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 8: Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">8. Privacy and Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  We collect and use your data in accordance with our privacy policy:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Personal information remains private and secure</li>
                  <li>No data sales to third parties</li>
                  <li>Necessary cookies for functionality</li>
                  <li>Optional marketing communications (with opt-out)</li>
                  <li>GDPR compliance maintained</li>
                  <li>Data encryption and security measures</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 9: Modifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">9. Terms Modifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  We may modify these terms at any time. New terms take effect
                  immediately upon publication on the site.
                </p>
                <p>
                  It is your responsibility to regularly check these terms.
                  Continued use after modifications constitutes automatic acceptance.
                </p>
                <div className="bg-yellow-950/20 p-3 rounded-lg border border-yellow-500/30">
                  <p className="text-yellow-400">
                    Recommendation: Bookmark this page and check periodically for updates.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 10: Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">10. Legal Framework</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  <strong className="text-red-400">Governing Law:</strong> These terms are governed by French law.
                </p>
                <p>
                  <strong className="text-red-400">Jurisdiction:</strong> All disputes will be subject to the exclusive
                  jurisdiction of competent French courts.
                </p>
                <p>
                  <strong className="text-red-400">Severability:</strong> If any part of these terms is deemed invalid,
                  the remainder remains in effect.
                </p>
                <p>
                  <strong className="text-red-400">Force Majeure:</strong> We are not responsible for delays or
                  failures due to causes beyond our control (war, pandemic, natural disasters, etc.).
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 11: Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">11. Contact and Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  For questions regarding these terms of use, you may contact us. However:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-950/20 p-4 rounded-lg border border-red-500/30">
                    <h4 className="text-red-400 font-semibold mb-2">DO NOT Contact Us For:</h4>
                    <ul className="space-y-1 text-red-200">
                      <li>• Refund requests</li>
                      <li>• Disputing these terms</li>
                      <li>• Complaints about fairness</li>
                      <li>• Emotional arguments</li>
                    </ul>
                  </div>
                  <div className="bg-green-950/20 p-4 rounded-lg border border-green-500/30">
                    <h4 className="text-green-400 font-semibold mb-2">Acceptable Inquiries:</h4>
                    <ul className="space-y-1 text-green-200">
                      <li>• Legitimate technical questions</li>
                      <li>• Verified bugs</li>
                      <li>• Terms clarification</li>
                      <li>• Product support</li>
                    </ul>
                  </div>
                </div>
                <p className="text-green-400">
                  Professional communication yields professional responses.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Final Warning */}
          <Card className="border-purple-500/50 bg-purple-950/30">
            <CardHeader>
              <CardTitle className="text-purple-400">
                🎯 Récapitulatif pour les Pressés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-bold">En résumé :</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Vous utilisez nos services = vous acceptez ces conditions</li>
                  <li>Aucun remboursement, jamais, pour aucune raison</li>
                  <li>Respectez nos droits et ceux des autres</li>
                  <li>On peut modifier ces conditions quand on veut</li>
                  <li>Droit français applicable</li>
                  <li>Soyez cool, on sera cool aussi</li>
                </ul>
                <p className="text-purple-300 font-medium mt-4">
                  Maintenant que vous savez tout, bienvenue sur DigitalHub ! 🚀
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Footer */}
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Ces conditions d'utilisation constituent l'accord complet entre vous et DigitalHub.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
            >
              Retour à l'accueil
            </Button>
            <Button 
              onClick={() => window.print()}
              variant="ghost"
            >
              Imprimer ces conditions
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DigitalHub. Tous droits réservés. 
            Ces conditions sont protégées par le droit d'auteur aussi ! 📝
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
