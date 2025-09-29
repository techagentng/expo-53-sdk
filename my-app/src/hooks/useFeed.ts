// src/hooks/useFeed.ts
import { useState } from 'react';

export const useFeedActions = () => {
    const [loading, setLoading] = useState(false);
  
    const handleLike = async (feedId: string) => {
      setLoading(true);
      try {
        // TODO: Implement actual like functionality
        // This could be an API call to your backend
        console.log('Liking feed:', feedId);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      } finally {
        setLoading(false);
      }
    };
  
    return { handleLike, loading };
  };