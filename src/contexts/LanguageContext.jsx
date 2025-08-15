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
        title: 'Choose the Right Robotic Solution for Your Needs',
        subtitle: 'CHIRAL offers three distinct product lines, each engineered to address specific operational requirements and budget considerations.',
        items: [
          {
            title: 'X30 Series',
            subtitle: 'Industrial Flagship',
            description: 'The pinnacle of industrial quadruped robotics, engineered specifically for the most demanding operational environments.',
            badge: 'Most Popular',
            features: [
              'Extreme weather operation (-20°C to 55°C)',
              'Superior IP67 protection rating',
              'Advanced mobility (45° slopes, 20cm obstacles)',
              'Extended endurance (2.5-4 hours)'
            ],
            specs: {
              maxSpeed: '≥4m/s',
              slopeCapability: '≤45°',
              protectionRating: 'IP67',
              endurance: '2.5-4h',
              payload: 'High',
              range: '≥10km',
              primaryUse: 'Industrial'
            },
            pricing: 'Contact for Pricing'
          },
          {
            title: 'X20 Series', 
            subtitle: 'Patrol & Inspection Specialist',
            description: 'Designed for comprehensive industrial patrol and inspection operations with exceptional mobility and payload capacity.',
            badge: 'Best Value',
            features: [
              'All-terrain capability (30° slopes)',
              'Substantial payload capacity (20kg)',
              'Weather resistance (IP66)',
              'Extended operational range (15km)'
            ],
            specs: {
              maxSpeed: '≥4m/s',
              slopeCapability: '≥30°',
              protectionRating: 'IP66',
              endurance: '2-4h',
              payload: '20kg',
              range: '15km',
              primaryUse: 'Patrol/Inspection'
            },
            pricing: 'Contact for Pricing'
          },
          {
            title: 'Lite3 Series',
            subtitle: 'Advanced Research Platform', 
            description: 'An accessible entry point into advanced quadruped robotics while maintaining sophisticated capabilities for research and development.',
            badge: 'Research Ready',
            features: [
              'Enhanced agility (50% increased joint torque)',
              'Advanced algorithms and motion control',
              'Compact design (12kg lightweight)',
              'Steep slope capability (40°)'
            ],
            specs: {
              maxSpeed: '2.5m/s',
              slopeCapability: '40°',
              protectionRating: 'Standard',
              endurance: '1.5-2h',
              payload: '5kg',
              range: '5km',
              primaryUse: 'Research/Education'
            },
            pricing: 'Contact for Pricing'
          }
        ],
        comparison: {
          title: 'Product Comparison',
          subtitle: 'Compare key specifications across our product lineup',
          features: [
            { name: 'Max Speed', x30: '≥4m/s', x20: '≥4m/s', lite3: '2.5m/s' },
            { name: 'Slope Capability', x30: '≤45°', x20: '≥30°', lite3: '40°' },
            { name: 'Protection Rating', x30: 'IP67', x20: 'IP66', lite3: 'Standard' },
            { name: 'Endurance', x30: '2.5-4h', x20: '2-4h', lite3: '1.5-2h' },
            { name: 'Payload', x30: 'High', x20: '20kg', lite3: '5kg' },
            { name: 'Range', x30: '≥10km', x20: '15km', lite3: '5km' },
            { name: 'Primary Use', x30: 'Industrial', x20: 'Patrol/Inspection', lite3: 'Research/Education' }
          ]
        },
        support: {
          title: 'Need Help Choosing the Right Solution?',
          subtitle: 'Our experts are ready to help you select the perfect robotic solution for your specific needs and requirements.'
        }
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
        title: 'Connect with CHIRAL - Your Robotic Solutions Partner',
        subtitle: 'Our team of experts is ready to help you explore how advanced quadruped robotics can transform your operations.'
      },
      info: [
        {
          title: 'Headquarters',
          value: 'CHIRAL Robotics Solutions Ltd.\nTechnology Park, Tel Aviv, Israel\nBuilding 15, Floor 3',
          description: 'Our main office and demonstration center'
        },
        {
          title: 'Phone',
          value: 'Main: +972-3-XXX-XXXX\nSales: +972-3-XXX-XXXX\nSupport: +972-3-XXX-XXXX\nEmergency: +972-5X-XXX-XXXX (24/7)',
          description: 'Multiple contact lines for different needs'
        },
        {
          title: 'Email',
          value: 'info@chiral-robotics.co.il\nsales@chiral-robotics.co.il\nsupport@chiral-robotics.co.il\npartnerships@chiral-robotics.co.il',
          description: 'Specialized email addresses for different inquiries'
        },
        {
          title: 'Business Hours',
          value: 'Sunday - Thursday: 8:00 AM - 6:00 PM\nFriday: 8:00 AM - 2:00 PM\nSaturday: Closed\nEmergency Support: 24/7',
          description: 'Our operating schedule and availability'
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
        title: 'CHIRAL - Pioneering Robotic Excellence in Israel',
        subtitle: 'Founded with a vision to bring the world\'s most advanced quadruped robotic technologies to Israeli industry.'
      },
      story: {
        title: 'Our Story',
        content: 'CHIRAL was founded with a vision to bring the world\'s most advanced quadruped robotic technologies to Israeli industry. Recognizing the unique challenges and opportunities within Israel\'s industrial landscape, our founders assembled a team of robotics experts, industry specialists, and local market professionals.\n\nThrough strategic partnerships with leading global robotics manufacturers and deep collaboration with Israeli industrial leaders, CHIRAL has established itself as the premier provider of quadruped robotic solutions in Israel. Our success is built on a foundation of technical excellence, comprehensive support services, and unwavering commitment to customer success.'
      },
      mission: {
        title: 'Our Mission',
        content: 'CHIRAL is dedicated to transforming Israeli industry through the introduction and support of advanced quadruped robotic technologies.'
      },
      vision: {
        title: 'Our Vision',
        content: 'To establish Israel as a global leader in the adoption and application of advanced quadruped robotics across critical industrial sectors, while setting new standards for innovation, reliability, and customer success in the robotics industry.'
      },
      values: [
        {
          title: 'Excellence',
          description: 'We are committed to delivering the highest quality robotic solutions and support services.'
        },
        {
          title: 'Innovation',
          description: 'We embrace cutting-edge technologies and innovative approaches that deliver superior value.'
        },
        {
          title: 'Reliability',
          description: 'We ensure that our solutions consistently meet the highest standards of reliability and performance.'
        },
        {
          title: 'Partnership',
          description: 'We view our relationships with customers as true partnerships, working collaboratively.'
        }
      ],
      team: {
        title: 'Expert Team Driving Robotic Innovation',
        subtitle: 'Our professionals combine deep technical knowledge with extensive industry experience.',
        members: [
          {
            name: 'David Chen',
            role: 'Chief Executive Officer',
            education: 'M.S. in Robotics Engineering from Technion, MBA from Tel Aviv University',
            experience: '15+ years in robotics and automation',
            expertise: ['Strategic Planning', 'Technology Integration', 'International Business']
          },
          {
            name: 'Dr. Sarah Goldstein',
            role: 'Chief Technology Officer',
            education: 'Ph.D. in Computer Science from Hebrew University',
            experience: 'Extensive research in autonomous systems',
            expertise: ['Autonomous Navigation', 'Sensor Integration', 'Software Development']
          },
          {
            name: 'Michael Rosenberg',
            role: 'VP of Operations',
            education: 'B.S. in Industrial Engineering from Ben-Gurion University',
            experience: 'Operations management in Israeli industry',
            expertise: ['Operations Management', 'Supply Chain', 'Customer Support']
          },
          {
            name: 'Rachel Aviv',
            role: 'VP of Sales & Marketing',
            education: 'MBA from IDC Herzliya',
            experience: 'B2B technology sales expertise',
            expertise: ['B2B Sales', 'Market Development', 'Customer Relations']
          }
        ]
      },
      journey: {
        title: 'Our Journey',
        milestones: [
          {
            year: '2019',
            title: 'Company Founded',
            description: 'CHIRAL established with vision to bring advanced quadruped robotics to Israeli industry'
          },
          {
            year: '2020',
            title: 'Strategic Partnerships',
            description: 'Established partnerships with leading global robotics manufacturers'
          },
          {
            year: '2021',
            title: 'First Deployments',
            description: 'Completed pilot deployments in power utility and manufacturing sectors'
          },
          {
            year: '2022',
            title: 'Market Expansion',
            description: 'Expanded operations across multiple industrial sectors'
          },
          {
            year: '2023',
            title: 'ISO Certification',
            description: 'Achieved ISO 9001 certification for quality management'
          },
          {
            year: '2024',
            title: 'Market Leadership',
            description: 'Established as Israel\'s leading provider of industrial quadruped robotics'
          }
        ]
      },
      impact: {
        title: 'Our Impact',
        stats: [
          {
            value: '50+',
            label: 'Deployed Systems',
            description: 'Robotic systems successfully deployed'
          },
          {
            value: '25+',
            label: 'Industrial Facilities',
            description: 'Major facilities served across Israel'
          },
          {
            value: '200+',
            label: 'Trained Personnel',
            description: 'Professionals trained on our systems'
          },
          {
            value: '99.9%',
            label: 'Uptime Reliability',
            description: 'System availability and performance'
          }
        ]
      },
      certifications: {
        title: 'Certifications & Compliance',
        items: [
          {
            title: 'ISO 9001:2015',
            description: 'Quality Management Systems'
          },
          {
            title: 'ISO 14001',
            description: 'Environmental Management'
          },
          {
            title: 'Industrial Safety',
            description: 'Compliance with safety standards'
          },
          {
            title: 'Power Utility',
            description: 'Specialized certifications for power applications'
          }
        ]
      }
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