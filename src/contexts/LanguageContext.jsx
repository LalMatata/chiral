import React, { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Content translations
const content = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      products: 'Products',
      applications: 'Applications',
      about: 'About',
      contact: 'Contact',
      requestDemo: 'Request Demo',
      downloadBrochure: 'Download Brochure'
    },
    // Home page
    home: {
      heroTitle: 'Revolutionizing Israeli Industry with Advanced Quadruped Robotics',
      heroSubtitle: 'CHIRAL brings cutting-edge robotic solutions to Israel\'s most demanding industrial environments. From power utilities to security applications, our autonomous quadruped robots deliver unmatched performance, reliability, and intelligence.',
      heroButton: 'Request a Demo Today',
      valueTitle: 'Why Choose CHIRAL for Your Industrial Robotics Needs?',
      valueText: 'In Israel\'s rapidly evolving industrial landscape, staying ahead requires embracing the most advanced technologies available. CHIRAL specializes in delivering state-of-the-art quadruped robotic solutions specifically tailored for Israeli enterprises across power utilities, manufacturing, security, and research sectors.',
      productsTitle: 'Advanced Robotic Solutions for Every Industrial Challenge',
      x30Title: 'X30 Series - Industrial Flagship',
      x30Description: 'The pinnacle of industrial quadruped robotics, engineered for the most demanding operational environments.',
      x20Title: 'X20 Series - Patrol & Inspection Specialist',
      x20Description: 'Designed for comprehensive industrial patrol and inspection operations with exceptional mobility.',
      lite3Title: 'Lite3 Series - Versatile Research Platform',
      lite3Description: 'An accessible entry point into advanced robotics for research institutions and smaller operations.',
      applicationsTitle: 'Transforming Israeli Industry Across Critical Sectors',
      powerTitle: 'Power & Utilities',
      powerDescription: 'Automated inspection capabilities for power plants, transmission lines, and distribution facilities.',
      securityTitle: 'Security & Surveillance',
      securityDescription: 'Advanced surveillance capabilities that complement traditional security measures.',
      industrialTitle: 'Industrial Inspection',
      industrialDescription: 'Automated inspection solutions for manufacturing facilities and processing centers.',
      trustTitle: 'Trusted by Leading Israeli Enterprises',
      trustDescription: 'CHIRAL has established itself as Israel\'s premier provider of industrial quadruped robotics solutions.'
    },
    // Products page
    products: {
      title: 'Choose the Right Robotic Solution for Your Needs',
      subtitle: 'CHIRAL offers three distinct product lines, each engineered to address specific operational requirements and budget considerations.',
      compareTitle: 'Product Comparison',
      specifications: 'Specifications',
      applications: 'Applications',
      learnMore: 'Learn More'
    },
    // Applications page
    applications: {
      title: 'Advancing Israeli Industry Through Robotic Innovation',
      subtitle: 'Israeli enterprises need robotic systems that can operate reliably in demanding conditions while delivering exceptional performance.',
      powerTitle: 'Power & Utilities',
      powerDescription: 'Revolutionizing power infrastructure management with automated inspection capabilities.',
      securityTitle: 'Security & Surveillance',
      securityDescription: 'Advanced security solutions for critical infrastructure protection.',
      industrialTitle: 'Industrial Inspection',
      industrialDescription: 'Transforming industrial maintenance and safety with robotic solutions.',
      researchTitle: 'Research & Development',
      researchDescription: 'Enabling innovation in Israeli technology sector with advanced platforms.'
    },
    // About page
    about: {
      title: 'CHIRAL - Pioneering Robotic Excellence in Israel',
      subtitle: 'Founded with a vision to bring the world\'s most advanced quadruped robotic technologies to Israeli industry.',
      missionTitle: 'Our Mission',
      missionText: 'CHIRAL is dedicated to transforming Israeli industry through the introduction and support of advanced quadruped robotic technologies.',
      valuesTitle: 'Our Values',
      excellence: 'Excellence',
      excellenceText: 'We are committed to delivering the highest quality robotic solutions and support services.',
      innovation: 'Innovation',
      innovationText: 'We embrace cutting-edge technologies and innovative approaches that deliver superior value.',
      reliability: 'Reliability',
      reliabilityText: 'We ensure that our solutions consistently meet the highest standards of reliability and performance.',
      partnership: 'Partnership',
      partnershipText: 'We view our relationships with customers as true partnerships, working collaboratively.',
      teamTitle: 'Expert Team Driving Robotic Innovation',
      teamDescription: 'Our professionals combine deep technical knowledge with extensive industry experience.'
    },
    // Contact page
    contact: {
      title: 'Connect with CHIRAL - Your Robotic Solutions Partner',
      subtitle: 'Our team of experts is ready to help you explore how advanced quadruped robotics can transform your operations.',
      demoTitle: 'Request a Personalized Demonstration',
      demoDescription: 'Experience the capabilities of CHIRAL\'s robotic solutions firsthand with a personalized demonstration.',
      salesTitle: 'Get Detailed Information About Our Solutions',
      salesDescription: 'Our sales team is ready to provide detailed information about our robotic solutions.',
      supportTitle: 'Comprehensive Support When You Need It',
      supportDescription: 'CHIRAL provides multiple support channels to ensure prompt, professional assistance.',
      companyName: 'Company Name',
      contactPerson: 'Contact Person',
      email: 'Email Address',
      phone: 'Phone Number',
      industry: 'Industry Sector',
      message: 'Message',
      submit: 'Submit Request'
    },
    // Common
    common: {
      learnMore: 'Learn More',
      getStarted: 'Get Started',
      contactUs: 'Contact Us',
      requestDemo: 'Request Demo',
      downloadBrochure: 'Download Brochure'
    }
  },
  he: {
    // Navigation
    nav: {
      home: 'בית',
      products: 'מוצרים',
      applications: 'יישומים',
      about: 'אודות',
      contact: 'צור קשר',
      requestDemo: 'בקש הדגמה',
      downloadBrochure: 'הורד חוברת'
    },
    // Home page
    home: {
      heroTitle: 'מהפכה בתעשייה הישראלית עם רובוטיקה מתקדמת רב-רגלית',
      heroSubtitle: 'CHIRAL מביאה פתרונות רובוטיים חדשניים לסביבות התעשייתיות המאתגרות ביותר בישראל. מחברות חשמל ועד יישומי אבטחה, הרובוטים האוטונומיים הרב-רגליים שלנו מספקים ביצועים, אמינות ואינטליגנציה ללא תחרות.',
      heroButton: 'בקש הדגמה היום',
      valueTitle: 'למה לבחור ב-CHIRAL לצרכי הרובוטיקה התעשייתית שלכם?',
      valueText: 'בנוף התעשייתי המתפתח במהירות של ישראל, להישאר בחזית דורש אימוץ הטכנולוגיות המתקדמות ביותר הזמינות. CHIRAL מתמחה במתן פתרונות רובוטיים רב-רגליים מתקדמים המותאמים במיוחד לארגונים ישראליים.',
      productsTitle: 'פתרונות רובוטיים מתקדמים לכל אתגר תעשייתי',
      x30Title: 'סדרת X30 - דגל התעשייה',
      x30Description: 'פסגת הרובוטיקה התעשייתית הרב-רגלית, מהונדס לסביבות התפעוליות המאתגרות ביותר.',
      x20Title: 'סדרת X20 - מומחה סיור ובדיקה',
      x20Description: 'מעוצב לפעולות סיור ובדיקה תעשייתיות מקיפות עם ניידות יוצאת דופן.',
      lite3Title: 'סדרת Lite3 - פלטפורמת מחקר רב-תכליתית',
      lite3Description: 'נקודת כניסה נגישה לרובוטיקה מתקדמת למוסדות מחקר ופעולות קטנות יותר.',
      applicationsTitle: 'שינוי התעשייה הישראלית במגזרים קריטיים',
      powerTitle: 'חשמל ושירותים',
      powerDescription: 'יכולות בדיקה אוטומטיות לתחנות כוח, קווי הולכה ומתקני הפצה.',
      securityTitle: 'אבטחה ומעקב',
      securityDescription: 'יכולות מעקב מתקדמות המשלימות אמצעי אבטחה מסורתיים.',
      industrialTitle: 'בדיקה תעשייתית',
      industrialDescription: 'פתרונות בדיקה אוטומטיים למתקני ייצור ומרכזי עיבוד.',
      trustTitle: 'מהימן על ידי ארגונים ישראליים מובילים',
      trustDescription: 'CHIRAL ביססה את עצמה כספקית המובילה בישראל של פתרונות רובוטיקה תעשייתית רב-רגלית.'
    },
    // Products page
    products: {
      title: 'בחרו את הפתרון הרובוטי הנכון לצרכיכם',
      subtitle: 'CHIRAL מציעה שלושה קווי מוצרים נפרדים, כל אחד מהונדס לטפל בדרישות תפעוליות ושיקולי תקציב ספציפיים.',
      compareTitle: 'השוואת מוצרים',
      specifications: 'מפרטים',
      applications: 'יישומים',
      learnMore: 'למד עוד'
    },
    // Applications page
    applications: {
      title: 'קידום התעשייה הישראלית באמצעות חדשנות רובוטית',
      subtitle: 'ארגונים ישראליים זקוקים למערכות רובוטיות שיכולות לפעול באמינות בתנאים מאתגרים תוך מתן ביצועים יוצאי דופן.',
      powerTitle: 'חשמל ושירותים',
      powerDescription: 'מהפכה בניהול תשתיות החשמל עם יכולות בדיקה אוטומטיות.',
      securityTitle: 'אבטחה ומעקב',
      securityDescription: 'פתרונות אבטחה מתקדמים להגנה על תשתיות קריטיות.',
      industrialTitle: 'בדיקה תעשייתית',
      industrialDescription: 'שינוי תחזוקה ובטיחות תעשייתית עם פתרונות רובוטיים.',
      researchTitle: 'מחקר ופיתוח',
      researchDescription: 'מאפשרים חדשנות במגזר הטכנולוגיה הישראלי עם פלטפורמות מתקדמות.'
    },
    // About page
    about: {
      title: 'CHIRAL - חלוצת מצוינות רובוטית בישראל',
      subtitle: 'נוסדה עם חזון להביא את הטכנולוגיות הרובוטיות הרב-רגליות המתקדמות ביותר בעולם לתעשייה הישראלית.',
      missionTitle: 'המשימה שלנו',
      missionText: 'CHIRAL מוקדשת לשינוי התעשייה הישראלית באמצעות הכנסה ותמיכה בטכנולוגיות רובוטיות רב-רגליות מתקדמות.',
      valuesTitle: 'הערכים שלנו',
      excellence: 'מצוינות',
      excellenceText: 'אנו מחויבים למתן פתרונות רובוטיים ושירותי תמיכה באיכות הגבוהה ביותר.',
      innovation: 'חדשנות',
      innovationText: 'אנו מאמצים טכנולוגיות חדישות וגישות חדשניות המספקות ערך מעולה.',
      reliability: 'אמינות',
      reliabilityText: 'אנו מבטיחים שהפתרונות שלנו עומדים בעקביות בסטנדרטים הגבוהים ביותר.',
      partnership: 'שותפות',
      partnershipText: 'אנו רואים את הקשרים שלנו עם לקוחות כשותפויות אמיתיות.',
      teamTitle: 'צוות מומחים המניע חדשנות רובוטית',
      teamDescription: 'האנשי מקצוע שלנו משלבים ידע טכני עמוק עם ניסיון תעשייתי נרחב.'
    },
    // Contact page
    contact: {
      title: 'התחברו ל-CHIRAL - השותף שלכם לפתרונות רובוטיים',
      subtitle: 'צוות המומחים שלנו מוכן לעזור לכם לחקור כיצד רובוטיקה רב-רגלית מתקדמת יכולה לשנות את הפעילות שלכם.',
      demoTitle: 'בקשו הדגמה אישית',
      demoDescription: 'חוו את היכולות של הפתרונות הרובוטיים של CHIRAL ממקור ראשון עם הדגמה אישית.',
      salesTitle: 'קבלו מידע מפורט על הפתרונות שלנו',
      salesDescription: 'צוות המכירות שלנו מוכן לספק מידע מפורט על הפתרונות הרובוטיים שלנו.',
      supportTitle: 'תמיכה מקיפה כשאתם זקוקים לה',
      supportDescription: 'CHIRAL מספקת ערוצי תמיכה מרובים כדי להבטיח סיוע מהיר ומקצועי.',
      companyName: 'שם החברה',
      contactPerson: 'איש קשר',
      email: 'כתובת דוא"ל',
      phone: 'מספר טלפון',
      industry: 'מגזר תעשייתי',
      message: 'הודעה',
      submit: 'שלח בקשה'
    },
    // Common
    common: {
      learnMore: 'למד עוד',
      getStarted: 'התחל',
      contactUs: 'צור קשר',
      requestDemo: 'בקש הדגמה',
      downloadBrochure: 'הורד חוברת'
    }
  }
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')
  const [isRTL, setIsRTL] = useState(false)

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'he' : 'en'
    setLanguage(newLanguage)
    setIsRTL(newLanguage === 'he')
    
    // Update document direction
    document.documentElement.dir = newLanguage === 'he' ? 'rtl' : 'ltr'
    document.documentElement.lang = newLanguage
  }

  const t = (key) => {
    const keys = key.split('.')
    let value = content[language]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }

  return (
    <LanguageContext.Provider value={{
      language,
      isRTL,
      toggleLanguage,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

