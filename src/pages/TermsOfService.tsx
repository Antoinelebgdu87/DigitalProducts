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
          <Card>
            <CardHeader>
              <CardTitle>4. Responsabilités de l'Utilisateur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>En utilisant nos services, vous vous engagez à :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fournir des informations exactes et à jour</li>
                <li>Maintenir la sécurité de votre compte</li>
                <li>Ne pas partager vos identifiants</li>
                <li>Ne pas redistribuer nos produits sans autorisation</li>
                <li>Respecter les droits de propriété intellectuelle</li>
                <li>Ne pas utiliser nos services à des fins illégales</li>
                <li>Ne pas spammer ou harceler d'autres utilisateurs</li>
                <li>Garder votre sang-froid même si vous n'aimez pas ces conditions</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 5: Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>5. Propriété Intellectuelle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Tout le contenu de ce site (textes, images, logos, code, designs) est protégé par 
                les droits d'auteur et appartient à DigitalHub ou à ses partenaires licenciés.
              </p>
              <p>
                L'achat d'un produit vous donne une licence d'utilisation personnelle et non-exclusive. 
                Vous ne pouvez pas :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Revendre ou redistribuer nos produits</li>
                <li>Modifier et revendre comme votre propre travail</li>
                <li>Partager sur des plateformes de piratage</li>
                <li>Faire du reverse engineering pour créer des concurrents</li>
              </ul>
              <p className="font-bold">
                Violation = poursuites judiciaires. On rigole pas avec ça ! ⚖️
              </p>
            </CardContent>
          </Card>

          {/* Section 6: Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle>6. Avertissements et Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Nos produits sont fournis "en l'état" sans aucune garantie. Nous ne garantissons pas :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Que nos produits fonctionneront parfaitement sur votre système</li>
                <li>Qu'ils répondront à vos attentes spécifiques</li>
                <li>Qu'ils seront exempts de bugs (c'est de l'informatique, les bugs font partie du jeu !)</li>
                <li>Qu'ils vous rendront riche et célèbre</li>
                <li>Qu'ils résoudront tous vos problèmes de vie</li>
              </ul>
              <p>
                <strong>Limitation de responsabilité :</strong> Notre responsabilité ne peut en aucun cas 
                dépasser le montant que vous avez payé pour le produit concerné. Et encore, on sera généreux !
              </p>
            </CardContent>
          </Card>

          {/* Section 7: Account Management */}
          <Card>
            <CardHeader>
              <CardTitle>7. Gestion des Comptes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Nous nous réservons le droit de suspendre ou de supprimer votre compte à tout moment, 
                pour toute raison, sans préavis ni remboursement si :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Vous violez ces conditions d'utilisation</li>
                <li>Vous tentez de pirater ou d'endommager nos services</li>
                <li>Vous êtes désagréable avec notre équipe</li>
                <li>Vous réclamez des remboursements alors que c'est écrit partout qu'il n'y en a pas</li>
                <li>Vous nous causez des problèmes légaux</li>
                <li>On n'aime pas votre attitude (oui, c'est subjectif)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 8: Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>8. Confidentialité et Données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Nous collectons et utilisons vos données conformément à notre politique de confidentialité. 
                En gros :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>On garde vos infos personnelles privées</li>
                <li>On ne vend pas vos données à des tiers louches</li>
                <li>On utilise des cookies (les numériques, pas les gourmands)</li>
                <li>On peut vous envoyer des emails marketing (avec opt-out)</li>
                <li>On se conforme au RGPD parce qu'on est des gens bien</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 9: Modifications */}
          <Card>
            <CardHeader>
              <CardTitle>9. Modifications des Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Nous pouvons modifier ces conditions à tout moment. Les nouvelles conditions prendront 
                effet immédiatement après publication sur le site.
              </p>
              <p>
                C'est votre responsabilité de vérifier régulièrement ces conditions. 
                Continuer à utiliser nos services après modification = acceptation automatique.
              </p>
              <p className="text-amber-400">
                💡 Pro tip : Ajoutez cette page à vos favoris et revenez de temps en temps !
              </p>
            </CardContent>
          </Card>

          {/* Section 10: Legal */}
          <Card>
            <CardHeader>
              <CardTitle>10. Aspects Légaux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>Droit applicable :</strong> Ces conditions sont régies par le droit français.
              </p>
              <p>
                <strong>Juridiction :</strong> Tout litige sera soumis à la juridiction exclusive 
                des tribunaux français compétents.
              </p>
              <p>
                <strong>Divisibilité :</strong> Si une partie de ces conditions est jugée invalide, 
                le reste reste en vigueur.
              </p>
              <p>
                <strong>Force majeure :</strong> Nous ne sommes pas responsables des retards ou 
                défaillances dus à des causes indépendantes de notre volonté (guerre, pandémie, 
                invasion d'aliens, apocalypse zombie, etc.).
              </p>
            </CardContent>
          </Card>

          {/* Section 11: Contact */}
          <Card>
            <CardHeader>
              <CardTitle>11. Contact et Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Pour toute question concernant ces conditions d'utilisation, vous pouvez nous contacter.
                Mais attention :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>❌ Ne nous contactez PAS pour demander des remboursements</li>
                <li>❌ Ne nous contactez PAS pour contester ces conditions</li>
                <li>❌ Ne nous contactez PAS pour nous dire que c'est injuste</li>
                <li>✅ Contactez-nous pour des questions techniques légitimes</li>
                <li>✅ Contactez-nous pour des bugs avérés</li>
                <li>✅ Contactez-nous pour des clarifications sur les conditions</li>
              </ul>
              <p className="text-green-400">
                On est sympas quand on nous traite bien ! 😊
              </p>
            </CardContent>
          </Card>

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
