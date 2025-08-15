import { useEffect } from 'react'

export function StructuredData() {
  useEffect(() => {
    // Organization Schema
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "SmartScheduler",
      "url": "https://smartscheduler.app",
      "logo": "https://smartscheduler.app/logo.png",
      "description": "AI-powered daily schedule optimization tool for maximum productivity",
      "sameAs": [
        "https://twitter.com/smartscheduler",
        "https://linkedin.com/company/smartscheduler"
      ]
    }

    // WebApplication Schema
    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "SmartScheduler",
      "url": "https://smartscheduler.app",
      "description": "Transform your productivity with AI-powered daily schedule optimization. Drag-and-drop task ordering, real-time optimization, and smart calendar tool for efficient time management.",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "AI-powered task optimization",
        "Drag-and-drop task reordering",
        "Real-time schedule updates",
        "Calendar synchronization",
        "Mobile-responsive design",
        "No login required"
      ],
      "screenshot": "https://smartscheduler.app/screenshot.png",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1247"
      }
    }

    // SoftwareApplication Schema
    const softwareSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "SmartScheduler",
      "description": "AI schedule planner and daily task optimizer with drag-and-drop functionality",
      "url": "https://smartscheduler.app",
      "applicationCategory": "Productivity",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Organization",
        "name": "SmartScheduler Team"
      }
    }

    // FAQ Schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does the AI optimization work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our AI algorithm considers multiple factors including task priority, deadlines, duration, time-of-day efficiency, and your working hours. It uses advanced scoring and optimization techniques to minimize conflicts and maximize productivity while respecting your preferences."
          }
        },
        {
          "@type": "Question",
          "name": "How does drag-and-drop reordering work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Simply drag tasks up or down in the task list to reorder them. The AI will automatically re-optimize your schedule based on the new order while maintaining efficiency. Your manual preferences are respected and incorporated into the optimization algorithm."
          }
        },
        {
          "@type": "Question",
          "name": "Is my data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all your data is processed locally in your browser and is not stored on our servers. Your tasks and schedule information remain completely private and secure. No account creation or personal information is required."
          }
        }
      ]
    }

    // Add schemas to head
    const addSchema = (schema, id) => {
      const existingScript = document.getElementById(id)
      if (existingScript) {
        existingScript.remove()
      }
      
      const script = document.createElement('script')
      script.id = id
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(schema)
      document.head.appendChild(script)
    }

    addSchema(organizationSchema, 'organization-schema')
    addSchema(webAppSchema, 'webapp-schema')
    addSchema(softwareSchema, 'software-schema')
    addSchema(faqSchema, 'faq-schema')

    return () => {
      // Cleanup schemas on unmount
      const schemas = ['organization-schema', 'webapp-schema', 'software-schema', 'faq-schema']
      schemas.forEach(id => {
        const script = document.getElementById(id)
        if (script) script.remove()
      })
    }
  }, [])

  return null
}

