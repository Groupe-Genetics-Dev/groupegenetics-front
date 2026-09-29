export type Lang = "fr" | "en"

export const contact = {
  email: "contact@groupegenetics.com",
  ceoPhone: { display: "+221 78 879 00 00", tel: "+221788790000" },
  offices: [
    {
      key: "senegal",
      address: ["Zac Mbao, Rond-Point SIPRES", "Dakar, Sénégal"],
      phone: { display: "+221 77 879 61 46", tel: "+221778796146" },
    },
    {
      key: "gambia",
      address: ["Baraka Estate, Bakoteh", "Gambia"],
      phone: { display: "+220 271 7816", tel: "+2202717816" },
    },
  ],
} as const

const fr = {
  meta: {
    title: "GENETICS - Solutions IT & Transformation Digitale",
    description:
      "GENETICS accompagne entreprises, résidences et collectivités avec des solutions de sécurité électronique, des services IT managés et la transformation digitale.",
  },
  nav: {
    home: "Accueil",
    about: "À propos",
    solutions: "Nos solutions",
    contact: "Contact",
    support: "Support",
    cta: "Contactez-nous",
    menu: "Menu",
  },
  hero: {
    badge: "Sécurité électronique · Services IT · Digital",
    title: ["Transformez votre", "business", "par la", "Technologie"],
    subtitle:
      "Nous mettons à votre disposition notre expertise en infrastructures informatiques et services managés pour sécuriser vos données et accompagner votre transformation numérique.",
    primary: "Découvrir nos services",
    secondary: "Consultation gratuite",
    stats: [
      { value: "10+", label: "Années d'expérience" },
      { value: "3", label: "Pôles d'expertise" },
      { value: "2", label: "Pays : Sénégal & Gambie" },
    ],
  },
  about: {
    eyebrow: "Qui sommes-nous ?",
    title: "Votre partenaire IT de confiance",
    tagline: "Transform your business by the digital",
    p1: "GENETICS est une entreprise technologique innovante, spécialisée dans les solutions de sécurité électronique, les services informatiques, et le développement de solutions digitales à forte valeur ajoutée.",
    p2: "Nous accompagnons les entreprises, résidences, promoteurs et collectivités dans la mise en place de systèmes de sécurité fiables, connectés et évolutifs, tout en offrant un ensemble de services destinés à moderniser leur environnement numérique.",
    vision: {
      title: "Notre Vision",
      text: "Être le leader de la sécurité technologique intelligente en Afrique, en fournissant des solutions innovantes qui intègrent le matériel de sécurité, les applications mobiles et les services informatiques.",
    },
    mission: {
      title: "Notre Mission",
      text: "Accompagner nos clients dans la protection intelligente de leurs environnements, grâce à une offre complète couvrant :",
      items: [
        "La sécurité électronique (vidéosurveillance, contrôle d'accès, alarmes)",
        "La sécurité mobile et digitale (pointage, QR visiteurs, alertes)",
        "Les infrastructures IT fiables et performantes",
        "La montée en compétences via des formations IT certifiantes",
      ],
    },
    years: "Années d'expérience",
    values: [
      { title: "Expertise", text: "Compétences avancées" },
      { title: "Agilité", text: "Adaptation rapide" },
      { title: "Efficacité", text: "Résultats optimaux" },
      { title: "Discipline", text: "Rigueur constante" },
    ],
    ceo: {
      title: "CEO, Groupe Genetics",
      role: "Direction & Vision Stratégique",
      call: "Appeler pour poser une question",
    },
  },
  solutions: {
    eyebrow: "Nos solutions",
    title: "Services IT",
    subtitle:
      "Des services managés aux infrastructures sécurisées, nous couvrons tous vos besoins technologiques.",
    poles: [
      {
        title: "Pôle Support et Intégration",
        subtitle: "Infrastructure et services managés",
        items: [
          "Monitoring et Supervision",
          "WiFi Professionnel",
          "Téléphonie sur IP (VoIP)",
          "Firewall et sécurité réseau",
          "Datacenter et Infrastructure",
          "Vidéosurveillance CCTV",
          "Access Control",
        ],
      },
      {
        title: "Pôle Cloud et Apps",
        subtitle: "Cloud computing et développement",
        items: [
          "Microsoft Office 365",
          "Data Backup et Replication",
          "Développement d'applications",
        ],
      },
      {
        title: "Pôle Conseil et Transformation Digitale",
        subtitle: "Conseil stratégique IT",
        items: [
          "Audit IT",
          "Schéma directeur IT",
          "Accompagnement à la digitalisation",
        ],
      },
    ],
    cta: {
      title: "Besoin d'une solution personnalisée ?",
      text: "Nos experts analysent vos besoins spécifiques pour vous proposer la solution IT la plus adaptée à votre entreprise.",
      button: "Consultation gratuite",
    },
  },
  contact: {
    eyebrow: "Contact",
    title: "Parlons de votre projet",
    subtitle:
      "Une question, un besoin, un projet ? Notre équipe vous répond rapidement.",
    offices: { senegal: "Bureau Sénégal", gambia: "Bureau Gambie" },
    email: "Écrivez-nous",
    write: "Envoyer un e-mail",
  },
  footer: {
    about:
      "Accélérer l'innovation avec des équipes techniques de classe mondiale. Nous vous mettrons en relation avec une équipe composée d'incroyables talents.",
    navigation: "Navigation",
    services: "Services IT",
    contact: "Contactez-nous",
    rights: "Tous droits réservés.",
  },
}

export type Dictionary = typeof fr

const en: Dictionary = {
  meta: {
    title: "GENETICS - IT Solutions & Digital Transformation",
    description:
      "GENETICS helps businesses, residences and public bodies with electronic security, managed IT services and digital transformation.",
  },
  nav: {
    home: "Home",
    about: "About",
    solutions: "Solutions",
    contact: "Contact",
    support: "Support",
    cta: "Contact us",
    menu: "Menu",
  },
  hero: {
    badge: "Electronic security · IT services · Digital",
    title: ["Transform your", "business", "through", "Technology"],
    subtitle:
      "We put our expertise in IT infrastructure and managed services at your disposal to secure your data and support your digital transformation.",
    primary: "Discover our services",
    secondary: "Free consultation",
    stats: [
      { value: "10+", label: "Years of experience" },
      { value: "3", label: "Areas of expertise" },
      { value: "2", label: "Countries: Senegal & Gambia" },
    ],
  },
  about: {
    eyebrow: "Who are we?",
    title: "Your trusted IT partner",
    tagline: "Transform your business by the digital",
    p1: "GENETICS is an innovative technology company specialising in electronic security solutions, IT services and the development of high value-added digital solutions.",
    p2: "We help businesses, residences, developers and local authorities deploy reliable, connected and scalable security systems, while offering a range of services to modernise their digital environment.",
    vision: {
      title: "Our Vision",
      text: "To be the leader in smart technological security in Africa, delivering innovative solutions that combine security hardware, mobile applications and IT services.",
    },
    mission: {
      title: "Our Mission",
      text: "To help our clients protect their environments intelligently, through a complete offering covering:",
      items: [
        "Electronic security (CCTV, access control, alarms)",
        "Mobile and digital security (time tracking, visitor QR codes, alerts)",
        "Reliable, high-performance IT infrastructure",
        "Upskilling through certified IT training",
      ],
    },
    years: "Years of experience",
    values: [
      { title: "Expertise", text: "Advanced skills" },
      { title: "Agility", text: "Fast adaptation" },
      { title: "Efficiency", text: "Optimal results" },
      { title: "Discipline", text: "Constant rigour" },
    ],
    ceo: {
      title: "CEO, Groupe Genetics",
      role: "Leadership & Strategic Vision",
      call: "Call us with a question",
    },
  },
  solutions: {
    eyebrow: "Our solutions",
    title: "IT Services",
    subtitle:
      "From managed services to secure infrastructure, we cover all your technology needs.",
    poles: [
      {
        title: "Support & Integration",
        subtitle: "Infrastructure and managed services",
        items: [
          "Monitoring & Supervision",
          "Professional WiFi",
          "IP Telephony (VoIP)",
          "Firewall & network security",
          "Datacenter & Infrastructure",
          "CCTV video surveillance",
          "Access Control",
        ],
      },
      {
        title: "Cloud & Apps",
        subtitle: "Cloud computing and development",
        items: [
          "Microsoft Office 365",
          "Data Backup & Replication",
          "Application development",
        ],
      },
      {
        title: "Consulting & Digital Transformation",
        subtitle: "Strategic IT consulting",
        items: ["IT Audit", "IT master plan", "Digitalisation support"],
      },
    ],
    cta: {
      title: "Need a tailored solution?",
      text: "Our experts analyse your specific needs to offer the IT solution best suited to your business.",
      button: "Free consultation",
    },
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's talk about your project",
    subtitle: "A question, a need, a project? Our team will get back to you quickly.",
    offices: { senegal: "Senegal Office", gambia: "Gambia Office" },
    email: "Write to us",
    write: "Send an email",
  },
  footer: {
    about:
      "Accelerating innovation with world-class technical teams. We will connect you with a team of incredible talent.",
    navigation: "Navigation",
    services: "IT Services",
    contact: "Contact us",
    rights: "All rights reserved.",
  },
}

export const dictionaries: Record<Lang, Dictionary> = { fr, en }
