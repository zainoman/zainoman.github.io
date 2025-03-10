export const getImageUrl = (base64String: string | null): string => {
  if (!base64String) {
    return '/vite.svg'; // Default fallback for null/empty
  }

  try {
    // Check if already a data URL
    if (base64String.startsWith('data:image/')) {
      return base64String;
    }

    // Clean the string and try to decode
    const cleanData = base64String.trim();
    try {
      // Try to detect image type from the first few bytes
      const decodedData = atob(cleanData.split(',').pop() || cleanData);
      const bytes = new Uint8Array(decodedData.length);
      for (let i = 0; i < decodedData.length; i++) {
        bytes[i] = decodedData.charCodeAt(i);
      }

      // Check magic numbers for image format
      let mimeType = 'image/jpeg'; // default
      if (bytes[0] === 0x89 && bytes[1] === 0x50) mimeType = 'image/png';
      if (bytes[0] === 0x47 && bytes[1] === 0x49) mimeType = 'image/gif';

      return `data:${mimeType};base64,${cleanData}`;
    } catch (decodeError) {
      // If decode fails, try as regular base64
      return `data:image/jpeg;base64,${cleanData}`;
    }
  } catch (error) {
    console.error('Error processing image data:', error);
    return '/vite.svg';
  }
};
