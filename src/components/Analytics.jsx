import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Google Analytics 4 Configuration
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX' // Replace with actual GA4 Measurement ID

// Initialize Google Analytics
export const initializeAnalytics = () => {
  // Load Google Analytics script
  const script1 = document.createElement('script')
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script1)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag

  gtag('js', new Date())
  gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: true,
    // Enhanced ecommerce and conversion tracking
    custom_map: {
      'custom_parameter_1': 'industry',
      'custom_parameter_2': 'company_size',
      'custom_parameter_3': 'application_area'
    }
  })

  // Set up enhanced ecommerce for lead tracking
  gtag('config', GA_MEASUREMENT_ID, {
    custom_map: {
      'custom_parameter_1': 'lead_source',
      'custom_parameter_2': 'lead_quality',
      'custom_parameter_3': 'conversion_type'
    }
  })
}

// Track page views
export const trackPageView = (path, title) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title,
      page_location: window.location.href
    })
  }
}

// Track custom events
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, {
      event_category: parameters.category || 'engagement',
      event_label: parameters.label || '',
      value: parameters.value || 0,
      ...parameters
    })
  }
}

// Track lead generation events
export const trackLead = (leadData) => {
  if (typeof window.gtag !== 'undefined') {
    // Track as conversion
    window.gtag('event', 'conversion', {
      send_to: `${GA_MEASUREMENT_ID}/lead_generation`,
      event_category: 'lead_generation',
      event_label: leadData.formType || 'unknown',
      value: 1,
      currency: 'USD',
      custom_parameter_1: leadData.industry || 'unknown',
      custom_parameter_2: leadData.companySize || 'unknown',
      custom_parameter_3: leadData.applicationArea || 'unknown'
    })

    // Track as enhanced ecommerce event
    window.gtag('event', 'generate_lead', {
      event_category: 'ecommerce',
      event_label: leadData.formType,
      value: 1,
      currency: 'USD',
      items: [{
        item_id: `lead_${leadData.formType}`,
        item_name: `Lead Generation - ${leadData.formType}`,
        item_category: 'lead_generation',
        item_variant: leadData.industry,
        quantity: 1,
        price: 1
      }]
    })
  }
}

// Track demo requests specifically
export const trackDemoRequest = (demoData) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'demo_request', {
      event_category: 'lead_generation',
      event_label: demoData.industry || 'unknown',
      value: 5, // Higher value for demo requests
      custom_parameter_1: demoData.industry,
      custom_parameter_2: demoData.companySize,
      custom_parameter_3: demoData.applicationArea
    })
  }
}

// Track product interest
export const trackProductInterest = (productId, action = 'view') => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'product_interest', {
      event_category: 'product_engagement',
      event_label: productId,
      product_id: productId,
      action: action,
      value: action === 'demo_request' ? 3 : 1
    })
  }
}

// Track application area interest
export const trackApplicationInterest = (applicationArea) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'application_interest', {
      event_category: 'content_engagement',
      event_label: applicationArea,
      application_area: applicationArea,
      value: 1
    })
  }
}

// Track scroll depth
export const trackScrollDepth = (percentage) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'scroll', {
      event_category: 'engagement',
      event_label: `${percentage}%`,
      value: percentage
    })
  }
}

// Track file downloads
export const trackDownload = (fileName, fileType) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'file_download', {
      event_category: 'engagement',
      event_label: fileName,
      file_name: fileName,
      file_type: fileType,
      value: 1
    })
  }
}

// Track external link clicks
export const trackExternalLink = (url, linkText) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'click', {
      event_category: 'outbound_link',
      event_label: url,
      link_text: linkText,
      link_url: url,
      value: 1
    })
  }
}

// Track search queries (if implementing site search)
export const trackSiteSearch = (searchTerm, resultsCount = 0) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'search', {
      search_term: searchTerm,
      event_category: 'site_search',
      event_label: searchTerm,
      search_results: resultsCount,
      value: 1
    })
  }
}

// Track video engagement
export const trackVideoEngagement = (videoTitle, action, progress = 0) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'video_engagement', {
      event_category: 'video',
      event_label: videoTitle,
      video_title: videoTitle,
      video_action: action, // play, pause, complete, etc.
      video_progress: progress,
      value: action === 'complete' ? 3 : 1
    })
  }
}

// Track form interactions
export const trackFormInteraction = (formName, action, fieldName = '') => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'form_interaction', {
      event_category: 'form',
      event_label: `${formName}_${action}`,
      form_name: formName,
      form_action: action, // start, progress, complete, abandon
      field_name: fieldName,
      value: action === 'complete' ? 2 : 1
    })
  }
}

// Analytics Hook Component
const Analytics = () => {
  const location = useLocation()

  useEffect(() => {
    // Initialize analytics on first load
    if (typeof window.gtag === 'undefined') {
      initializeAnalytics()
    }
  }, [])

  useEffect(() => {
    // Track page views on route changes
    trackPageView(location.pathname, document.title)
  }, [location])

  useEffect(() => {
    // Set up scroll tracking
    let scrollDepthMarkers = [25, 50, 75, 90, 100]
    let triggeredMarkers = new Set()

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)

      scrollDepthMarkers.forEach(marker => {
        if (scrollPercent >= marker && !triggeredMarkers.has(marker)) {
          triggeredMarkers.add(marker)
          trackScrollDepth(marker)
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location])

  useEffect(() => {
    // Track external link clicks
    const handleLinkClick = (event) => {
      const link = event.target.closest('a')
      if (link && link.href) {
        const url = new URL(link.href, window.location.origin)
        if (url.hostname !== window.location.hostname) {
          trackExternalLink(link.href, link.textContent || link.href)
        }
      }
    }

    document.addEventListener('click', handleLinkClick)
    return () => document.removeEventListener('click', handleLinkClick)
  }, [])

  return null // This component doesn't render anything
}

// Facebook Pixel Integration
export const initializeFacebookPixel = (pixelId) => {
  if (typeof window.fbq !== 'undefined') return

  const script = document.createElement('script')
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');
  `
  document.head.appendChild(script)
}

// LinkedIn Insight Tag Integration
export const initializeLinkedInInsight = (partnerId) => {
  const script = document.createElement('script')
  script.innerHTML = `
    _linkedin_partner_id = "${partnerId}";
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(_linkedin_partner_id);
  `
  document.head.appendChild(script)

  const script2 = document.createElement('script')
  script2.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js'
  script2.async = true
  document.head.appendChild(script2)
}

// Microsoft Clarity Integration
export const initializeMicrosoftClarity = (clarityId) => {
  const script = document.createElement('script')
  script.innerHTML = `
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${clarityId}");
  `
  document.head.appendChild(script)
}

// Hotjar Integration
export const initializeHotjar = (hotjarId, hotjarSv) => {
  const script = document.createElement('script')
  script.innerHTML = `
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${hotjarId},hjsv:${hotjarSv}};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  `
  document.head.appendChild(script)
}

export default Analytics

