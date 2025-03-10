export const getImageUrl = (base64String: string | null): string => {
  if (!base64String) return '';
  
  try {
    // Check if the string is already a data URL
    if (base64String.startsWith('data:image/')) {
      return base64String;
    }

    // Try to detect image type from the first few bytes
    const decodedData = atob(base64String.split(',').pop() || base64String);
    const bytes = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i++) {
      bytes[i] = decodedData.charCodeAt(i);
    }

    // Check magic numbers for common image formats
    let mimeType = 'image/jpeg'; // default
    if (bytes[0] === 0x89 && bytes[1] === 0x50) mimeType = 'image/png';
    if (bytes[0] === 0x47 && bytes[1] === 0x49) mimeType = 'image/gif';

    return `data:${mimeType};base64,${base64String}`;
  } catch (error) {
    console.error('Error decoding base64 image:', error);
    return ''; // Return empty string or a placeholder image URL
  }
};