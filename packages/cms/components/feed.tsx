// Mock Feed component until basehub is configured
export const Feed = ({ children, queries }: any) => {
  // Return mock data for now
  const mockData = [{
    blog: {
      posts: {
        items: [],
        item: null
      }
    },
    legalPages: {
      items: []
    }
  }];
  
  if (typeof children === 'function') {
    return children(mockData);
  }
  return null;
};
