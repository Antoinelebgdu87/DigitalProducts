import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  ArrowLeft,
  Languages,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const TermsOfService = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<"en" | "fr">("en");

  const content = {
    en: {
      title: "Terms of Service",
      subtitle: "Legal Agreement & Usage Guidelines",
      lastUpdated: "Effective Date:",
      toggleBtn: "Français",
      backBtn: "Back to Home",
      printBtn: "Print Terms",
      returnBtn: "Return to Home",
      copyright: "All rights reserved.",
      footerText:
        "By using DigitalHub, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.",
      sections: {
        agreement: {
          title: "Agreement to Terms",
          content: [
            'These Terms of Service ("Terms") govern your use of the DigitalHub website and services operated by DigitalHub ("we," "us," or "our"). By accessing or using our Service, you agree to be bound by these Terms.',
            "If you disagree with any part of these terms, then you may not access the Service.",
          ],
        },
        description: {
          title: "1. Description of Service",
          content: [
            "DigitalHub operates a digital marketplace platform that allows users to purchase and download digital products, including but not limited to:",
            [
              "Software applications and scripts",
              "Digital templates and designs",
              "Educational content and courses",
              "Digital assets and resources",
              "Consulting and professional services",
            ],
            "We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time without prior notice.",
          ],
        },
        noRefund: {
          title: "2. No Refund Policy",
          highlight: "ALL SALES ARE FINAL - NO REFUNDS",
          content: [
            "Due to the nature of digital products, all purchases are final and non-refundable. This policy applies without exception.",
            "This no-refund policy applies in all circumstances, including but not limited to:",
            [
              "Change of mind after purchase",
              "Technical incompatibility with user systems",
              "User error in product selection",
              "Failure to meet user expectations",
              "User's inability to use the product",
              "Duplicate purchases",
              "Any other reason whatsoever",
            ],
            "By completing a purchase, you acknowledge and accept this no-refund policy.",
          ],
        },
        userResponsibilities: {
          title: "3. User Accounts and Responsibilities",
          content: [
            "When using our Service, you agree to:",
            [
              "Provide accurate, current, and complete information",
              "Maintain the security of your account credentials",
              "Accept responsibility for all activities under your account",
              "Notify us immediately of any unauthorized use",
              "Comply with all applicable laws and regulations",
              "Not engage in fraudulent or deceptive practices",
              "Not interfere with or disrupt the Service",
            ],
          ],
        },
        intellectualProperty: {
          title: "4. Intellectual Property Rights",
          content: [
            "The Service and its original content, features, and functionality are owned by DigitalHub and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.",
            "Upon purchase of digital products, you receive a limited, non-exclusive, non-transferable license to use the product for personal or business purposes as specified in the product description.",
            "You may NOT:",
            [
              "Resell, redistribute, or share purchased products",
              "Modify products and claim them as your own work",
              "Use products in violation of applicable laws",
              "Reverse engineer or attempt to extract source code",
              "Remove or alter any proprietary notices",
            ],
          ],
        },
        disclaimers: {
          title: "5. Disclaimers and Limitation of Liability",
          content: [
            'The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied.',
            "We do not warrant that:",
            [
              "The Service will meet your specific requirements",
              "The Service will be uninterrupted, timely, secure, or error-free",
              "Results obtained from the Service will be accurate or reliable",
              "Defects will be corrected",
            ],
            "LIMITATION OF LIABILITY",
            "In no event shall DigitalHub, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.",
          ],
        },
        termination: {
          title: "6. Account Termination",
          content: [
            "We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including:",
            [
              "Breach of these Terms",
              "Fraudulent or illegal activity",
              "Violation of intellectual property rights",
              "Abusive behavior toward other users or our team",
              "Any conduct that we deem harmful to the Service or other users",
            ],
            "Upon termination, your right to use the Service will cease immediately, but downloaded products may continue to be used according to their license terms.",
          ],
        },
        privacy: {
          title: "7. Privacy Policy",
          content: [
            "Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service.",
            "By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.",
          ],
        },
        changes: {
          title: "8. Changes to Terms",
          content: [
            "We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.",
            "What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.",
          ],
        },
        governing: {
          title: "9. Governing Law and Jurisdiction",
          content: [
            "These Terms shall be interpreted and governed by the laws of France, without regard to its conflict of law provisions.",
            "Any disputes arising out of or relating to these Terms or the Service shall be subject to the exclusive jurisdiction of the courts of France.",
          ],
        },
        severability: {
          title: "10. Severability",
          content: [
            "If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the validity, legality, and enforceability of the remaining provisions shall not in any way be affected or impaired thereby.",
          ],
        },
        contact: {
          title: "11. Contact Information",
          content: [
            "If you have any questions about these Terms of Service, please contact us through the appropriate channels provided on our website.",
            "Important Notice",
            "Please do not contact us regarding refund requests, as all sales are final. Contact us only for legitimate technical support, billing inquiries, or legal matters.",
          ],
        },
      },
    },
    fr: {
      title: "Conditions d'Utilisation",
      subtitle: "Accord Légal et Directives d'Usage",
      lastUpdated: "Date d'entrée en vigueur :",
      toggleBtn: "English",
      backBtn: "Retour à l'accueil",
      printBtn: "Imprimer les conditions",
      returnBtn: "Retour à l'accueil",
      copyright: "Tous droits réservés.",
      footerText:
        "En utilisant DigitalHub, vous reconnaissez avoir lu, compris et accepté d'être lié par ces Conditions d'Utilisation.",
      sections: {
        agreement: {
          title: "Accord aux Conditions",
          content: [
            'Ces Conditions d\'Utilisation ("Conditions") régissent votre utilisation du site web DigitalHub et des services exploités par DigitalHub ("nous", "notre" ou "nos"). En accédant ou en utilisant notre Service, vous acceptez d\'être lié par ces Conditions.',
            "Si vous n'êtes pas d'accord avec une partie de ces conditions, vous ne pouvez pas accéder au Service.",
          ],
        },
        description: {
          title: "1. Description du Service",
          content: [
            "DigitalHub exploite une plateforme de marché numérique qui permet aux utilisateurs d'acheter et de télécharger des produits numériques, incluant mais sans s'y limiter :",
            [
              "Applications logicielles et scripts",
              "Modèles et designs numériques",
              "Contenu éducatif et cours",
              "Ressources et actifs numériques",
              "Services de consultation et professionnels",
            ],
            "Nous nous réservons le droit de modifier, suspendre ou interrompre tout aspect du Service à tout moment sans préavis.",
          ],
        },
        noRefund: {
          title: "2. Politique de Non-Remboursement",
          highlight: "TOUTES LES VENTES SONT FINALES - AUCUN REMBOURSEMENT",
          content: [
            "En raison de la nature des produits numériques, tous les achats sont définitifs et non remboursables. Cette politique s'applique sans exception.",
            "Cette politique de non-remboursement s'applique dans toutes les circonstances, incluant mais sans s'y limiter :",
            [
              "Changement d'avis après achat",
              "Incompatibilité technique avec les systèmes utilisateur",
              "Erreur de sélection de produit par l'utilisateur",
              "Échec à répondre aux attentes de l'utilisateur",
              "Incapacité de l'utilisateur à utiliser le produit",
              "Achats en double",
              "Toute autre raison quelconque",
            ],
            "En complétant un achat, vous reconnaissez et acceptez cette politique de non-remboursement.",
          ],
        },
        userResponsibilities: {
          title: "3. Comptes Utilisateur et Responsabilités",
          content: [
            "En utilisant notre Service, vous acceptez de :",
            [
              "Fournir des informations exactes, actuelles et complètes",
              "Maintenir la sécurité de vos identifiants de compte",
              "Accepter la responsabilité de toutes les activités sous votre compte",
              "Nous notifier immédiatement de toute utilisation non autorisée",
              "Respecter toutes les lois et réglementations applicables",
              "Ne pas s'engager dans des pratiques frauduleuses ou trompeuses",
              "Ne pas interférer avec ou perturber le Service",
            ],
          ],
        },
        intellectualProperty: {
          title: "4. Droits de Propriété Intellectuelle",
          content: [
            "Le Service et son contenu original, ses fonctionnalités et sa fonctionnalité sont la propriété de DigitalHub et sont protégés par le droit d'auteur international, les marques de commerce, les brevets, les secrets commerciaux et autres lois de propriété intellectuelle.",
            "Lors de l'achat de produits numériques, vous recevez une licence limitée, non exclusive et non transférable pour utiliser le produit à des fins personnelles ou commerciales comme spécifié dans la description du produit.",
            "Vous ne pouvez PAS :",
            [
              "Revendre, redistribuer ou partager les produits achetés",
              "Modifier les produits et les revendiquer comme votre propre travail",
              "Utiliser les produits en violation des lois applicables",
              "Faire de l'ingénierie inverse ou tenter d'extraire le code source",
              "Retirer ou modifier les avis de propriété",
            ],
          ],
        },
        disclaimers: {
          title: "5. Avertissements et Limitation de Responsabilité",
          content: [
            'Le Service est fourni "TEL QUEL" et "SELON DISPONIBILITÉ" sans garanties d\'aucune sorte, expresses ou implicites.',
            "Nous ne garantissons pas que :",
            [
              "Le Service répondra à vos exigences spécifiques",
              "Le Service sera ininterrompu, ponctuel, sécurisé ou sans erreur",
              "Les résultats obtenus du Service seront exacts ou fiables",
              "Les défauts seront corrigés",
            ],
            "LIMITATION DE RESPONSABILITÉ",
            "En aucun cas DigitalHub, ses directeurs, employés, partenaires, agents, fournisseurs ou affiliés ne seront responsables de dommages indirects, accessoires, spéciaux, consécutifs ou punitifs, incluant sans limitation, la perte de profits, données, utilisation, goodwill ou autres pertes intangibles, résultant de votre utilisation du Service.",
          ],
        },
        termination: {
          title: "6. Résiliation de Compte",
          content: [
            "Nous pouvons résilier ou suspendre votre compte et l'accès au Service immédiatement, sans préavis ou responsabilité, pour toute raison, incluant :",
            [
              "Violation de ces Conditions",
              "Activité frauduleuse ou illégale",
              "Violation des droits de propriété intellectuelle",
              "Comportement abusif envers d'autres utilisateurs ou notre équipe",
              "Toute conduite que nous jugeons nuisible au Service ou aux autres utilisateurs",
            ],
            "Lors de la résiliation, votre droit d'utiliser le Service cessera immédiatement, mais les produits téléchargés peuvent continuer à être utilisés selon leurs conditions de licence.",
          ],
        },
        privacy: {
          title: "7. Politique de Confidentialité",
          content: [
            "Votre vie privée est importante pour nous. Notre Politique de Confidentialité explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre Service.",
            "En utilisant notre Service, vous acceptez la collecte et l'utilisation d'informations conformément à notre Politique de Confidentialité.",
          ],
        },
        changes: {
          title: "8. Modifications des Conditions",
          content: [
            "Nous nous réservons le droit de modifier ou remplacer ces Conditions à tout moment à notre seule discrétion. Si une révision est importante, nous essaierons de fournir un préavis d'au moins 30 jours avant l'entrée en vigueur de nouvelles conditions.",
            "Ce qui constitue un changement important sera déterminé à notre seule discrétion. En continuant d'accéder ou d'utiliser notre Service après l'entrée en vigueur de ces révisions, vous acceptez d'être lié par les conditions révisées.",
          ],
        },
        governing: {
          title: "9. Loi Applicable et Juridiction",
          content: [
            "Ces Conditions seront interprétées et régies par les lois de la France, sans égard à ses dispositions de conflit de lois.",
            "Tout litige découlant de ou relatif à ces Conditions ou au Service sera soumis à la juridiction exclusive des tribunaux de France.",
          ],
        },
        severability: {
          title: "10. Divisibilité",
          content: [
            "Si une disposition de ces Conditions est jugée invalide, illégale ou inapplicable par un tribunal de juridiction compétente, la validité, légalité et applicabilité des dispositions restantes ne seront en aucune façon affectées ou compromises.",
          ],
        },
        contact: {
          title: "11. Informations de Contact",
          content: [
            "Si vous avez des questions concernant ces Conditions d'Utilisation, veuillez nous contacter par les canaux appropriés fournis sur notre site web.",
            "Avis Important",
            "Veuillez ne pas nous contacter concernant des demandes de remboursement, car toutes les ventes sont finales. Contactez-nous uniquement pour un support technique légitime, des questions de facturation ou des questions légales.",
          ],
        },
      },
    },
  };

  const currentContent = content[language];

  const renderContent = (contentArray: any[]) => {
    return contentArray.map((item, index) => {
      if (Array.isArray(item)) {
        return (
          <ul key={index} className="list-disc pl-6 space-y-2">
            {item.map((listItem, listIndex) => (
              <li key={listIndex} className="text-gray-300">
                {listItem}
              </li>
            ))}
          </ul>
        );
      }
      return (
        <p key={index} className="text-gray-300 leading-relaxed">
          {item}
        </p>
      );
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background gradient matching site style */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/30" />

      {/* Background pattern */}
      <div
        className="fixed inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="group flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl backdrop-blur-xl transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
              <span className="text-gray-400 group-hover:text-white transition-colors">
                {currentContent.backBtn}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLanguage(language === "en" ? "fr" : "en")}
              className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/20 rounded-2xl backdrop-blur-xl transition-all duration-300"
            >
              <Languages className="h-5 w-5 text-red-400" />
              <span className="text-white font-medium">
                {currentContent.toggleBtn}
              </span>
            </motion.button>
          </div>

          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <div className="p-3 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-2xl border border-red-500/30">
                <FileText className="h-10 w-10 text-red-400" />
              </div>
              <div className="text-left">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">
                  {currentContent.title}
                </h1>
                <p className="text-xl text-gray-400 mt-2">
                  {currentContent.subtitle}
                </p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-gray-500 text-lg flex items-center justify-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              {currentContent.lastUpdated}{" "}
              {new Date().toLocaleDateString(
                language === "fr" ? "fr-FR" : "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Agreement */}
          <motion.div variants={itemVariants}>
            <Card className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl hover:shadow-red-500/10 transition-all duration-500">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600/10 via-red-500/5 to-red-400/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-white text-2xl">
                    <Shield className="h-6 w-6 text-red-400" />
                    {currentContent.sections.agreement.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {renderContent(currentContent.sections.agreement.content)}
                </CardContent>
              </div>
            </Card>
          </motion.div>

          {/* Service Description */}
          <motion.div variants={itemVariants}>
            <Card className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl hover:shadow-red-500/10 transition-all duration-500">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600/10 via-red-500/5 to-red-400/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-xl">
                    {currentContent.sections.description.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {renderContent(currentContent.sections.description.content)}
                </CardContent>
              </div>
            </Card>
          </motion.div>

          {/* No Refunds - Special highlight */}
          <motion.div variants={itemVariants}>
            <Card className="group relative bg-gradient-to-br from-red-950/30 to-red-900/20 backdrop-blur-xl border border-red-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-red-500/20">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 via-red-500/20 to-red-400/20 rounded-3xl blur-xl" />
              <div className="relative">
                <CardHeader className="pb-4">
                  <CardTitle className="text-red-400 text-xl font-bold">
                    {currentContent.sections.noRefund.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-red-950/40 p-6 rounded-2xl border border-red-500/40">
                    <p className="font-bold text-red-300 text-xl mb-3 text-center">
                      {currentContent.sections.noRefund.highlight}
                    </p>
                    <p className="text-red-200 text-center">
                      {currentContent.sections.noRefund.content[0]}
                    </p>
                  </div>
                  {renderContent(
                    currentContent.sections.noRefund.content.slice(1),
                  )}
                </CardContent>
              </div>
            </Card>
          </motion.div>

          {/* Remaining sections */}
          {Object.entries(currentContent.sections)
            .slice(3)
            .map(([key, section], index) => (
              <motion.div key={key} variants={itemVariants}>
                <Card className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl hover:shadow-red-500/10 transition-all duration-500">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-600/10 via-red-500/5 to-red-400/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-white text-xl">
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {key === "disclaimers" ? (
                        <>
                          {renderContent(section.content.slice(0, -2))}
                          <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700/50">
                            <p className="font-semibold text-red-400 mb-3 text-lg">
                              {section.content[4]}
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                              {section.content[5]}
                            </p>
                          </div>
                        </>
                      ) : key === "contact" ? (
                        <>
                          <p className="text-gray-300 leading-relaxed">
                            {section.content[0]}
                          </p>
                          <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700/50">
                            <p className="font-semibold text-red-400 mb-3">
                              {section.content[1]}
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                              {section.content[2]}
                            </p>
                          </div>
                        </>
                      ) : (
                        renderContent(section.content)
                      )}
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
        </motion.div>

        <Separator className="my-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center space-y-6"
        >
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              {currentContent.footerText}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/20 text-white rounded-2xl backdrop-blur-xl transition-all duration-300"
              >
                {currentContent.returnBtn}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.print()}
                className="px-8 py-3 bg-transparent hover:bg-white/5 border border-white/20 text-gray-400 hover:text-white rounded-2xl transition-all duration-300"
              >
                {currentContent.printBtn}
              </motion.button>
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} DigitalHub. {currentContent.copyright}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
