import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

const content = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      products: 'Products',
      applications: 'Applications',
      about: 'About',
      contact: 'Contact'
    },
    
    // Home Page
    home: {
      hero: {
        tagline: 'Advanced Quadruped Robotics',
        title: 'The Future of Industrial Automation',
        subtitle: 'CHIRAL delivers cutting-edge robotic solutions engineered for the world\'s most demanding industrial environments. Experience unmatched performance, reliability, and intelligence.',
        cta: {
          primary: 'Get Started Today',
          secondary: 'Explore Products',
          demo: 'Watch Demo'
        }
      },
      stats: [
        { value: '50+', label: 'Deployed Systems', trend: '+15%' },
        { value: '25+', label: 'Industrial Facilities', trend: '+23%' },
        { value: '200+', label: 'Trained Personnel', trend: '+42%' },
        { value: '99.9%', label: 'Uptime Reliability', trend: 'Industry Leading' }
      ],
      products: {
        title: 'Explore Our Products',
        subtitle: 'Each robot in our lineup is meticulously engineered to deliver exceptional performance in specific industrial applications.',
        items: [
          {
            title: 'X30 Series',
            subtitle: 'Industrial Flagship',
            description: 'The pinnacle of industrial quadruped robotics, engineered for the most demanding operational environments.',
            badge: 'Most Advanced',
            features: ['IP67 Protection', '4m/s Max Speed', '2.5-4h Endurance', '10km Range']
          },
          {
            title: 'X20 Series', 
            subtitle: 'Patrol & Inspection',
            description: 'Designed for comprehensive industrial patrol and inspection operations with exceptional mobility.',
            badge: 'Best Seller',
            features: ['20kg Payload', 'IP66 Protection', '15km Range', 'All-Terrain']
          },
          {
            title: 'Lite3 Series',
            subtitle: 'Research Platform', 
            description: 'An accessible entry point into advanced robotics for research institutions and smaller operations.',
            badge: 'Entry Level',
            features: ['12kg Weight', '40° Slope', 'SDK Included', 'Research Platform']
          }
        ]
      },
      applications: {
        title: 'Transforming Industries',
        subtitle: 'Our robotic solutions are deployed across critical sectors, delivering unprecedented operational efficiency and safety.',
        items: [
          {
            title: 'Power & Utilities',
            description: 'Automated inspection capabilities for power plants, transmission lines, and distribution facilities.',
            features: ['Thermal Imaging', 'Gas Detection', 'Predictive Maintenance']
          },
          {
            title: 'Security & Surveillance',
            description: 'Advanced surveillance capabilities that complement traditional security measures.',
            features: ['24/7 Patrol', 'AI Detection', 'Real-time Alerts']
          },
          {
            title: 'Industrial Inspection',
            description: 'Automated inspection solutions for manufacturing facilities and processing centers.',
            features: ['Quality Control', 'Safety Monitoring', 'Process Optimization']
          }
        ]
      },
      cta: {
        title: 'Ready to Transform Your Operations?',
        subtitle: 'Join leading enterprises worldwide who trust CHIRAL for their critical industrial automation needs.',
        primary: 'Start Your Journey',
        secondary: 'View Case Studies'
      }
    },
    
    // Contact Page
    contact: {
      hero: {
        tagline: 'Get In Touch',
        title: 'Start Your Robotics Journey',
        subtitle: 'Tell us about your project and discover how CHIRAL\'s advanced robotic solutions can transform your operations.'
      },
      info: [
        {
          title: 'Phone',
          value: '+1 (555) 123-4567',
          description: 'Mon-Fri 9am-6pm EST'
        },
        {
          title: 'Email',
          value: 'info@chiral-robotics.com',
          description: 'We respond within 2 hours'
        },
        {
          title: 'Location',
          value: 'Tel Aviv, Israel',
          description: 'Serving customers globally'
        },
        {
          title: 'Response Time',
          value: '< 24 hours',
          description: 'Guaranteed response time'
        }
      ],
      form: {
        steps: [
          {
            title: 'Company Information',
            subtitle: 'Tell us about your organization'
          },
          {
            title: 'Contact Details',
            subtitle: 'How can we reach you?'
          },
          {
            title: 'Project Overview',
            subtitle: 'What are you looking to achieve?'
          },
          {
            title: 'Requirements',
            subtitle: 'Share your specific needs'
          }
        ],
        fields: {
          companyName: 'Company Name',
          contactPerson: 'Contact Person',
          role: 'Role/Title',
          email: 'Email Address',
          phone: 'Phone Number',
          location: 'Location/Region',
          industry: 'Industry',
          projectType: 'Project Type',
          timeline: 'Timeline',
          budget: 'Budget Range',
          message: 'Project Requirements',
          specificNeeds: 'Specific Technical Needs',
          preferredContact: 'Preferred Contact Method'
        },
        placeholders: {
          companyName: 'Your company name',
          contactPerson: 'Your full name',
          role: 'Your role at the company',
          email: 'your.email@company.com',
          phone: '+1 (555) 123-4567',
          location: 'City, State/Country',
          message: 'Please describe your project requirements, challenges, and how our robotic solutions can help...'
        },
        options: {
          industries: [
            'Power & Utilities',
            'Manufacturing', 
            'Chemical Processing',
            'Oil & Gas',
            'Mining',
            'Security & Defense',
            'Research & Education',
            'Construction',
            'Transportation',
            'Other'
          ],
          projectTypes: [
            'Equipment Inspection',
            'Security Patrol',
            'Industrial Monitoring',
            'Research & Development',
            'Emergency Response',
            'Infrastructure Assessment',
            'Environmental Monitoring',
            'Custom Application'
          ],
          timelines: [
            'Immediate (within 1 month)',
            'Short-term (1-3 months)',
            'Medium-term (3-6 months)',
            'Long-term (6+ months)',
            'Planning phase'
          ],
          budgets: [
            'Under $100K',
            '$100K - $500K',
            '$500K - $1M',
            '$1M - $5M',
            '$5M+',
            'To be discussed'
          ],
          needs: [
            'High-temperature operation',
            'Hazardous environment protection',
            'Extended battery life',
            'Custom sensor integration',
            'Real-time data streaming',
            'AI-powered analytics',
            '24/7 operation capability',
            'Multi-robot coordination'
          ],
          contact: ['email', 'phone', 'video-call']
        },
        buttons: {
          previous: 'Previous',
          next: 'Next Step',
          submit: 'Submit Request',
          submitting: 'Submitting...'
        },
        success: {
          title: 'Request Submitted Successfully!',
          subtitle: 'Thank you for your interest in CHIRAL\'s robotic solutions. Our team will contact you within 24 hours to discuss your requirements.',
          security: 'Your information is secure and will never be shared'
        },
        validation: {
          required: 'This field is required',
          email: 'Please enter a valid email address',
          phone: 'Please enter a valid phone number'
        }
      }
    },
    
    // Products Page  
    products: {
      hero: {
        title: 'Advanced Robotic Solutions',
        subtitle: 'Discover our comprehensive lineup of industrial-grade quadruped robots designed for the most demanding applications.'
      },
      filters: {
        all: 'All Products',
        industrial: 'Industrial',
        research: 'Research',
        patrol: 'Patrol & Security'
      }
    },
    
    // Applications Page
    applications: {
      hero: {
        title: 'Industry Applications',
        subtitle: 'See how CHIRAL\'s robotic solutions are transforming operations across diverse industries worldwide.'
      }
    },
    
    // About Page
    about: {
      hero: {
        title: 'About CHIRAL',
        subtitle: 'Leading the future of industrial automation with cutting-edge quadruped robotics technology.'
      },
      mission: {
        title: 'Our Mission',
        content: 'To revolutionize industrial operations through advanced robotic solutions that enhance safety, efficiency, and reliability in the world\'s most challenging environments.'
      },
      values: [
        {
          title: 'Innovation',
          description: 'Pushing the boundaries of robotic technology to solve complex industrial challenges.'
        },
        {
          title: 'Reliability',
          description: 'Engineering robust solutions that perform consistently in demanding operational environments.'
        },
        {
          title: 'Safety',
          description: 'Prioritizing worker safety and operational security in every solution we develop.'
        }
      ]
    },
    
    // Footer
    footer: {
      company: {
        title: 'Company',
        links: ['About', 'Careers', 'News', 'Contact']
      },
      products: {
        title: 'Products', 
        links: ['X30 Series', 'X20 Series', 'Lite3 Series', 'Compare']
      },
      applications: {
        title: 'Applications',
        links: ['Power & Utilities', 'Security', 'Industrial', 'Research']
      },
      support: {
        title: 'Support',
        links: ['Documentation', 'Training', 'Support', 'Downloads']
      },
      contact: {
        title: 'Contact',
        email: 'info@chiral-robotics.com',
        phone: '+1 (555) 123-4567',
        address: 'Tel Aviv, Israel'
      },
      legal: {
        copyright: '© 2024 CHIRAL Robotics Solutions Ltd. All rights reserved.',
        links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy']
      }
    },
    
    // Common UI
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Try Again',
      close: 'Close',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      download: 'Download',
      upload: 'Upload',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      more: 'Learn More',
      less: 'Show Less',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      continue: 'Continue',
      finish: 'Finish',
      submit: 'Submit',
      confirm: 'Confirm',
      required: 'Required'
    }
  },
  
  he: {
    // Navigation  
    nav: {
      home: 'בית',
      products: 'מוצרים',
      applications: 'יישומים',
      about: 'אודות',
      contact: 'צור קשר'
    },
    
    // Home Page
    home: {
      hero: {
        tagline: 'רובוטיקה רב-רגלית מתקדמת',
        title: 'עתיד האוטומציה התעשייתית',
        subtitle: 'CHIRAL מספקת פתרונות רובוטיים חדשניים המהונדסים לסביבות התעשייתיות המאתגרות ביותר בעולם. חווה ביצועים, אמינות ותבונה שאין שני להם.',
        cta: {
          primary: 'התחל היום',
          secondary: 'חקור מוצרים',
          demo: 'צפה בהדגמה'
        }
      },
      stats: [
        { value: '50+', label: 'מערכות פרוסות', trend: '+15%' },
        { value: '25+', label: 'מתקנים תעשייתיים', trend: '+23%' },
        { value: '200+', label: 'עובדים מוכשרים', trend: '+42%' },
        { value: '99.9%', label: 'אמינות זמן פעילות', trend: 'מוביל בענף' }
      ],
      products: {
        title: 'חקור את המוצרים שלנו',
        subtitle: 'כל רובוט במערך שלנו מהונדס בקפידה כדי לספק ביצועים יוצאי דופן ביישומים תעשייתיים ספציפיים.',
        items: [
          {
            title: 'סדרת X30',
            subtitle: 'דגל תעשייתי',
            description: 'פסגת הרובוטיקה הרב-רגלית התעשייתית, מהונדסת לסביבות התפעול המאתגרות ביותר.',
            badge: 'הכי מתקדם',
            features: ['הגנת IP67', 'מהירות מקס 4 מ/ש', 'סיבולת 2.5-4 שעות', 'טווח 10 ק"מ']
          },
          {
            title: 'סדרת X20',
            subtitle: 'סיור ובדיקה',
            description: 'מעוצבת לפעולות סיור ובדיקה תעשייתיות מקיפות עם ניידות יוצאת דופן.',
            badge: 'הכי נמכר',
            features: ['משא 20 ק"ג', 'הגנת IP66', 'טווח 15 ק"מ', 'כל שטח']
          },
          {
            title: 'סדרת Lite3',
            subtitle: 'פלטפורמת מחקר',
            description: 'נקודת כניסה נגישה לרובוטיקה מתקדמת עבור מוסדות מחקר ופעילויות קטנות יותר.',
            badge: 'רמת כניסה',
            features: ['משקל 12 ק"ג', 'שיפוע 40°', 'SDK כלול', 'פלטפורמת מחקר']
          }
        ]
      },
      applications: {
        title: 'מהפכת תעשיות',
        subtitle: 'הפתרונות הרובוטיים שלנו פרוסים במגזרים קריטיים, מספקים יעילות תפעולית ובטיחות חסרי תקדים.',
        items: [
          {
            title: 'חשמל ותשתיות',
            description: 'יכולות בדיקה אוטומטיות לתחנות כוח, קווי הולכה ומתקני הפצה.',
            features: ['הדמיה תרמית', 'זיהוי גזים', 'תחזוקה חזויה']
          },
          {
            title: 'אבטחה ומעקב',
            description: 'יכולות מעקב מתקדמות המשלימות אמצעי אבטחה מסורתיים.',
            features: ['סיור 24/7', 'זיהוי AI', 'התראות בזמן אמת']
          },
          {
            title: 'בדיקה תעשייתית',
            description: 'פתרונות בדיקה אוטומטיים למתקני ייצור ומרכזי עיבוד.',
            features: ['בקרת איכות', 'ניטור בטיחות', 'אופטימיזציה של תהליכים']
          }
        ]
      },
      cta: {
        title: 'מוכן לשנות את הפעילות שלך?',
        subtitle: 'הצטרף לחברות מובילות ברחבי העולם הסומכות על CHIRAL לצרכי האוטומציה התעשייתית הקריטיים שלהן.',
        primary: 'התחל את המסע שלך',
        secondary: 'צפה במקרים'
      }
    },
    
    // Contact Page
    contact: {
      hero: {
        tagline: 'יצירת קשר',
        title: 'התחל את מסע הרובוטיקה שלך',
        subtitle: 'ספר לנו על הפרויקט שלך וגלה איך הפתרונות הרובוטיים המתקדמים של CHIRAL יכולים לשנות את הפעילות שלך.'
      },
      info: [
        {
          title: 'טלפון',
          value: '+1 (555) 123-4567',
          description: 'א׳-ה׳ 9:00-18:00'
        },
        {
          title: 'אימייל',
          value: 'info@chiral-robotics.com',
          description: 'אנו מגיבים תוך 2 שעות'
        },
        {
          title: 'מיקום',
          value: 'תל אביב, ישראל',
          description: 'משרתים לקוחות ברחבי העולם'
        },
        {
          title: 'זמן תגובה',
          value: '< 24 שעות',
          description: 'זמן תגובה מובטח'
        }
      ],
      form: {
        steps: [
          {
            title: 'פרטי החברה',
            subtitle: 'ספר לנו על הארגון שלך'
          },
          {
            title: 'פרטי התקשרות',
            subtitle: 'איך נוכל להגיע אליך?'
          },
          {
            title: 'סקירת הפרויקט',
            subtitle: 'מה אתה מחפש להשיג?'
          },
          {
            title: 'דרישות',
            subtitle: 'שתף את הצרכים הספציפיים שלך'
          }
        ],
        fields: {
          companyName: 'שם החברה',
          contactPerson: 'איש קשר',
          role: 'תפקיד/תואר',
          email: 'כתובת אימייל',
          phone: 'מספר טלפון',
          location: 'מיקום/אזור',
          industry: 'תעשייה',
          projectType: 'סוג פרויקט',
          timeline: 'לוח זמנים',
          budget: 'טווח תקציב',
          message: 'דרישות הפרויקט',
          specificNeeds: 'צרכים טכניים ספציפיים',
          preferredContact: 'אמצעי קשר מועדף'
        },
        placeholders: {
          companyName: 'שם החברה שלך',
          contactPerson: 'השם המלא שלך',
          role: 'התפקיד שלך בחברה',
          email: 'your.email@company.com',
          phone: '+972 50-123-4567',
          location: 'עיר, מדינה',
          message: 'אנא תאר את דרישות הפרויקט שלך, האתגרים ואיך הפתרונות הרובוטיים שלנו יכולים לעזור...'
        },
        options: {
          industries: [
            'חשמל ותשתיות',
            'ייצור',
            'עיבוד כימי',
            'נפט וגז',
            'כרייה',
            'אבטחה והגנה',
            'מחקר וחינוך',
            'בנייה',
            'תחבורה',
            'אחר'
          ],
          projectTypes: [
            'בדיקת ציוד',
            'סיור אבטחה',
            'ניטור תעשייתי',
            'מחקר ופיתוח',
            'תגובה לחירום',
            'הערכת תשתיות',
            'ניטור סביבתי',
            'יישום מותאם'
          ],
          timelines: [
            'מיידי (תוך חודש)',
            'קצר טווח (1-3 חודשים)',
            'בינוני טווח (3-6 חודשים)',
            'ארוך טווח (6+ חודשים)',
            'שלב תכנון'
          ],
          budgets: [
            'מתחת ל-$100K',
            '$100K - $500K',
            '$500K - $1M',
            '$1M - $5M',
            '$5M+',
            'לדיון'
          ],
          needs: [
            'הפעלה בטמפרטורה גבוהה',
            'הגנה בסביבה מסוכנת',
            'חיי סוללה מורחבים',
            'אינטגרציה מותאמת של חיישנים',
            'הזרמת נתונים בזמן אמת',
            'אנליטיקה מונעת AI',
            'יכולת הפעלה 24/7',
            'תיאום רב-רובוטי'
          ],
          contact: ['אימייל', 'טלפון', 'שיחת-וידאו']
        },
        buttons: {
          previous: 'קודם',
          next: 'השלב הבא',
          submit: 'שלח בקשה',
          submitting: 'שולח...'
        },
        success: {
          title: 'הבקשה נשלחה בהצלחה!',
          subtitle: 'תודה על העניין בפתרונות הרובוטיים של CHIRAL. הצוות שלנו ייצור איתך קשר תוך 24 שעות כדי לדון בדרישות שלך.',
          security: 'המידע שלך מאובטח ולעולם לא יישותף'
        },
        validation: {
          required: 'שדה חובה',
          email: 'אנא הכנס כתובת אימייל חוקית',
          phone: 'אנא הכנס מספר טלפון חוקי'
        }
      }
    },
    
    // Common UI
    common: {
      loading: 'טוען...',
      error: 'אירעה שגיאה',
      retry: 'נסה שוב',
      close: 'סגור',
      save: 'שמור',
      cancel: 'בטל',
      delete: 'מחק',
      edit: 'ערוך',
      view: 'צפה',
      download: 'הורד',
      upload: 'העלה',
      search: 'חפש',
      filter: 'סנן',
      sort: 'מיין',
      more: 'למד עוד',
      less: 'הראה פחות',
      back: 'חזור',
      next: 'הבא',
      previous: 'קודם',
      continue: 'המשך',
      finish: 'סיים',
      submit: 'שלח',
      confirm: 'אשר',
      required: 'חובה'
    }
  }
}

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en')

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('chiral-language')
    if (savedLanguage && ['en', 'he'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage)
    } else {
      // Check browser language
      const browserLang = navigator.language.split('-')[0]
      if (browserLang === 'he') {
        setCurrentLanguage('he')
      }
    }
  }, [])

  useEffect(() => {
    // Update document direction and language
    document.documentElement.lang = currentLanguage
    document.documentElement.dir = currentLanguage === 'he' ? 'rtl' : 'ltr'
    
    // Save language preference
    localStorage.setItem('chiral-language', currentLanguage)
  }, [currentLanguage])

  const switchLanguage = (lang) => {
    if (['en', 'he'].includes(lang)) {
      setCurrentLanguage(lang)
    }
  }

  const t = (path) => {
    const keys = path.split('.')
    let value = content[currentLanguage]
    
    for (const key of keys) {
      if (value && typeof value === 'object') {
        value = value[key]
      } else {
        return path // Return the path if translation not found
      }
    }
    
    return value || path
  }

  const value = {
    currentLanguage,
    switchLanguage,
    t,
    isRTL: currentLanguage === 'he'
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageProvider