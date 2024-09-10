'use client';
import { Analytics } from '@vercel/analytics/react';
import { useEffect, useState } from 'react';
import * as CookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';

export default function Cookies() {
    const [cookies, setCookies] = useState(false);

    useEffect(() => {
        CookieConsent.run({
            cookie: {
                name: 'cc_cookie'
            },
            guiOptions: {
                consentModal: {
                    layout: 'cloud inline',
                    position: 'bottom center',
                    equalWeightButtons: true,
                    flipButtons: false
                },
                preferencesModal: {
                    layout: 'box',
                    equalWeightButtons: true,
                    flipButtons: false
                }
            },
            categories: {
                necessary: {
                    enabled: true,
                    readOnly: true
                },
                analytics: {
                    autoClear: {
                        cookies: [
                            {
                                name: /^_vcn/
                            },
                            {
                                name: '_vcnn'
                            }
                        ]
                    },
                    services: {
                        vercelAnalytics: {
                            label: 'Vercel Analytics',
                            onAccept: () => {
                                setCookies(true);
                            },
                            onReject: () => {
                                setCookies(false);
                            }
                        }
                    }
                },
                ads: {}
            },

            language: {
                default: 'fr',
                translations: {
                    fr: {
                        consentModal: {
                            title: 'Nous utilisons des cookies',
                            description:
                                'Nous utilisons des cookies essentiels et analytiques pour assurer le bon fonctionnement de notre site et améliorer votre expérience utilisateur.',
                            acceptAllBtn: 'Tout accepter',
                            acceptNecessaryBtn: 'Tout refuser',
                            showPreferencesBtn: 'Gérer les préférences individuelles',
                            footer: `
                      <a href="/mentions-legales">Mentions légales</a>
                      <a href="/politique-de-confidentialite">Politique de confidentialité</a>
                  `
                        },
                        preferencesModal: {
                            title: 'Gérer les préférences de cookies',
                            acceptAllBtn: 'Tout accepter',
                            acceptNecessaryBtn: 'Tout refuser',
                            savePreferencesBtn: 'Accepter la sélection actuelle',
                            closeIconLabel: 'Fermer la fenêtre',
                            serviceCounterLabel: 'Service|Services',
                            sections: [
                                {
                                    title: 'Vos choix de confidentialité',
                                    description: `Dans ce panneau, vous pouvez exprimer certaines préférences liées au traitement de vos informations personnelles. Vous pouvez revoir et modifier vos choix à tout moment en rouvrant ce panneau via le lien fourni. Pour refuser votre consentement aux activités de traitement spécifiques décrites ci-dessous, désactivez les interrupteurs ou utilisez le bouton "Tout refuser" et confirmez que vous souhaitez enregistrer vos choix.`
                                },
                                {
                                    title: 'Strictement nécessaire',
                                    description:
                                        'Ces cookies sont essentiels au bon fonctionnement du site web et ne peuvent pas être désactivés.',
                                    linkedCategory: 'necessary'
                                },
                                {
                                    title: 'Performance et Analyse',
                                    description:
                                        'Ces cookies collectent des informations sur la manière dont vous utilisez notre site web. Toutes les données sont anonymisées et ne peuvent pas être utilisées pour vous identifier.',
                                    linkedCategory: 'analytics',
                                    cookieTable: {
                                        caption: 'Tableau des cookies',
                                        headers: {
                                            name: 'Cookie',
                                            domain: 'Domaine',
                                            desc: 'Description'
                                        },
                                        body: [
                                            {
                                                name: '_vcn',
                                                domain: 'vercel.live',
                                                desc: 'Utilisé pour mesurer les performances et le comportement utilisateur.'
                                            },
                                            {
                                                name: '_vcnn',
                                                domain: 'vercel.live',
                                                desc: "Utilisé pour collecter des statistiques anonymes à des fins d'analyse."
                                            }
                                        ]
                                    }
                                },
                                {
                                    title: "Plus d'informations",
                                    description:
                                        'Pour toute question concernant ma politique sur les cookies et vos choix, veuillez nous contacter : <a href="mailto:team.glepoint@gmail.com">team.glepoint@gmail.com</a>'
                                }
                            ]
                        }
                    }
                }
            }
        });
    }, []);

    return cookies && <Analytics />;
}
