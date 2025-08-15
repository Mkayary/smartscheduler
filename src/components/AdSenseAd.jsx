import { useEffect } from 'react'

export function AdSenseAd({ 
  adSlot = "1234567890", 
  adFormat = "auto", 
  fullWidthResponsive = true,
  className = "",
  style = {}
}) {
  useEffect(() => {
    // Load AdSense script if not already loaded
    if (!window.adsbygoogle) {
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX'
      script.crossOrigin = 'anonymous'
      document.head.appendChild(script)
      
      window.adsbygoogle = window.adsbygoogle || []
    }

    // Push ad to AdSense queue
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({})
      }
    } catch (error) {
      console.log('AdSense error:', error)
    }
  }, [])

  return (
    <div className={`adsense-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-XXXXXXXXXX"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      ></ins>
    </div>
  )
}

// Placeholder AdSense component for development
export function AdSensePlaceholder({ 
  width = "320px", 
  height = "100px", 
  className = "",
  position = "banner"
}) {
  const placeholderStyles = {
    banner: "bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-dashed border-blue-300",
    sidebar: "bg-gradient-to-b from-green-100 to-blue-100 border-2 border-dashed border-green-300",
    footer: "bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-dashed border-purple-300"
  }

  return (
    <div 
      className={`flex items-center justify-center rounded-lg ${placeholderStyles[position]} ${className}`}
      style={{ width, height, minHeight: height }}
    >
      <div className="text-center p-4">
        <div className="text-xs text-gray-500 mb-1">Advertisement</div>
        <div className="text-sm font-medium text-gray-600">Google AdSense</div>
        <div className="text-xs text-gray-400 mt-1">{width} × {height}</div>
      </div>
    </div>
  )
}

