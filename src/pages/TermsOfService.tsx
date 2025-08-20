import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Shield, FileText, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Conditions d'Utilisation
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Les règles du jeu pour utiliser DigitalHub - Lisez bien, c'est important ! 📜
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            <span>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</span>
          </div>
        </div>

        {/* Warning Card */}
        <Card className="mb-8 border-amber-500/50 bg-amber-950/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <Eye className="h-5 w-5" />
              ⚠️ ATTENTION - À LIRE ABSOLUMENT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-200">
              En utilisant ce site, vous acceptez ces conditions. Si vous n'êtes pas d'accord, 
              veuillez fermer cette page immédiatement. Pas de drama, pas de problème ! 🚪
            </p>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* Section 1: Acceptance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-400" />
                1. Acceptation des Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Bienvenue sur <strong>DigitalHub</strong> ! En accédant à ce site, en créant un compte, 
                en téléchargeant, en achetant ou en utilisant nos services, vous acceptez automatiquement 
                et sans réserve ces conditions d'utilisation.
              </p>
              <p>
                Si vous n'acceptez pas ces conditions, vous devez immédiatement cesser d'utiliser nos services. 
                Pas de négociation possible sur ce point ! 🤝
              </p>
            </CardContent>
          </Card>

          {/* Section 2: Services */}
          <Card>
            <CardHeader>
              <CardTitle>2. Description des Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                DigitalHub propose une plateforme de vente de produits numériques incluant mais non limité à :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Scripts et outils de développement</li>
                <li>Templates et designs</li>
                <li>Ressources digitales</li>
                <li>Services de consultation</li>
                <li>Formations en ligne</li>
                <li>Et tout autre produit numérique que nous décidons de proposer</li>
              </ul>
              <p>
                Nous nous réservons le droit de modifier, suspendre ou arrêter tout service à tout moment 
                sans préavis. Parce que c'est notre site et qu'on fait ce qu'on veut ! 😎
              </p>
            </CardContent>
          </Card>

          {/* Section 3: No Refunds */}
          <Card className="border-red-500/50 bg-red-950/30">
            <CardHeader>
              <CardTitle className="text-red-400">
                3. 🚫 POLITIQUE DE NON-REMBOURSEMENT - ULTRA STRICTE
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-900/50 p-4 rounded-lg border border-red-500/50">
                <p className="font-bold text-red-300 text-lg mb-2">
                  ⚠️ AUCUN REMBOURSEMENT - ZÉRO - NADA - NOTHING ⚠️
                </p>
                <p>
                  Toutes les ventes sont <strong>DÉFINITIVES</strong> et <strong>NON-REMBOURSABLES</strong>. 
                  Une fois que vous avez acheté un produit, c'est fini, terminé, game over !
                </p>
              </div>
              <p>
                Cette politique s'applique dans TOUS les cas, y compris mais non limité à :
              </p>
              <ul className="list-disc pl-6 space-y-1 text-red-200">
                <li>Changement d'avis</li>
                <li>Incompatibilité technique (vous auriez dû vérifier avant !)</li>
                <li>Attentes non satisfaites</li>
                <li>Erreur d'achat</li>
                <li>Problèmes de votre côté</li>
                <li>Phase de la lune</li>
                <li>Météo défavorable</li>
                <li>Votre chat qui a marché sur le clavier</li>
              </ul>
              <p className="font-bold text-red-300">
                En gros : vous achetez, vous gardez. Point final ! 🔒
              </p>
            </CardContent>
          </Card>

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
