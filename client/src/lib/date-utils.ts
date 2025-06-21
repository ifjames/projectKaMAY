// Utility functions for handling dates and Firestore timestamps

export const formatFirestoreDate = (date: any): string => {
  if (!date) return 'Not available';
  
  try {
    let parsedDate: Date;
    
    if (date.toDate && typeof date.toDate === 'function') {
      // Firestore timestamp
      parsedDate = date.toDate();
    } else if (date.seconds) {
      // Firestore timestamp object
      parsedDate = new Date(date.seconds * 1000);
    } else {
      // Regular date string or Date object
      parsedDate = new Date(date);
    }
    
    return parsedDate.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error, date);
    return 'Recently';
  }
};

export const getTimeAgo = (date: any): string => {
  if (!date) return 'unknown time';
  
  try {
    const now = new Date();
    let past: Date;
    
    if (date.toDate && typeof date.toDate === 'function') {
      // Firestore timestamp
      past = date.toDate();
    } else if (date.seconds) {
      // Firestore timestamp object
      past = new Date(date.seconds * 1000);
    } else {
      // Regular date
      past = new Date(date);
    }
    
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } catch (error) {
    console.error('Error parsing date:', error, date);
    return 'recently';
  }
};
