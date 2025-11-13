// Utility functions for handling image URLs

/**
 * Extracts the actual image URL from Google Images links
 * @param url - The URL which might be a Google Images link or direct image URL
 * @returns Clean image URL
 */
export function extractImageUrl(url: string): string {
  if (!url) return url;
  
  try {
    // Handle Google Images URLs
    if (url.includes('google.com/imgres') || url.includes('googleusercontent.com')) {
      const urlObj = new URL(url);
      
      // Extract imgurl parameter from Google Images
      const imgUrl = urlObj.searchParams.get('imgurl');
      if (imgUrl) {
        return decodeURIComponent(imgUrl);
      }
      
      // If it's already a googleusercontent URL, clean it
      if (url.includes('googleusercontent.com')) {
        return url.split('&')[0]; // Remove query parameters
      }
    }
    
    // Handle other image hosting services with query parameters
    if (url.includes('unsplash.com') || url.includes('pexels.com') || url.includes('pixabay.com')) {
      // For these services, we can usually remove query parameters safely
      return url.split('?')[0];
    }
    
    // Return original URL if no processing needed
    return url;
  } catch (error) {
    console.warn('Error processing image URL:', error);
    return url; // Return original URL if processing fails
  }
}

/**
 * Processes multiple image URLs (comma-separated) and cleans them
 * @param imageString - Comma-separated string of image URLs
 * @returns Array of clean image URLs
 */
export function processImageUrls(imageString: string): string[] {
  if (!imageString) return [];
  
  return imageString
    .split(',')
    .map(url => url.trim())
    .filter(url => url.length > 0)
    .map(url => extractImageUrl(url))
    .filter(url => isValidImageUrl(url));
}

/**
 * Validates if a URL is likely to be an image
 * @param url - URL to validate
 * @returns boolean indicating if URL is likely an image
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    
    // Check for common image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
    const pathname = urlObj.pathname.toLowerCase();
    
    // Direct extension check
    if (imageExtensions.some(ext => pathname.endsWith(ext))) {
      return true;
    }
    
    // Check for known image hosting domains
    const imageHosts = [
      'unsplash.com',
      'images.unsplash.com',
      'pexels.com',
      'images.pexels.com',
      'pixabay.com',
      'cdn.pixabay.com',
      'googleusercontent.com',
      'imgur.com',
      'i.imgur.com',
      'cloudinary.com',
      'amazonaws.com',
      'cloudfront.net'
    ];
    
    if (imageHosts.some(host => urlObj.hostname.includes(host))) {
      return true;
    }
    
    // If URL contains image-related paths
    if (pathname.includes('/image') || pathname.includes('/photo') || pathname.includes('/img')) {
      return true;
    }
    
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Formats image URLs for display in the admin form
 * @param urls - Array of image URLs
 * @returns Comma-separated string of URLs
 */
export function formatImageUrlsForForm(urls: string[]): string {
  return urls.join(', ');
}

/**
 * Generates a preview-friendly version of an image URL
 * @param url - Original image URL
 * @returns URL optimized for preview (if possible)
 */
export function getPreviewUrl(url: string): string {
  if (!url) return url;
  
  // For Unsplash, add preview parameters
  if (url.includes('unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=400&h=300&fit=crop`;
  }
  
  // For other services, return as-is
  return url;
}
