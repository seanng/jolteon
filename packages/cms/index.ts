// Mock implementation until basehub is configured
// import { basehub as basehubClient, fragmentOn } from 'basehub';
// import { keys } from './keys';

// const basehub = basehubClient({
//   token: keys().BASEHUB_TOKEN,
// });

/* -------------------------------------------------------------------------------------------------
 * Mock Types
 * -----------------------------------------------------------------------------------------------*/

export type PostMeta = {
  _slug: string;
  _title: string;
  authors: Array<{
    _title: string;
    avatar: any;
    xUrl: string;
  }>;
  categories: Array<{
    _title: string;
  }>;
  date: string;
  description: string;
  image: any;
};

export type Post = PostMeta & {
  body: {
    plainText: string;
    json: {
      content: any;
      toc: any;
    };
    readingTime: number;
  };
};

export type LegalPostMeta = {
  _slug: string;
  _title: string;
  description: string;
};

export type LegalPost = LegalPostMeta & {
  body: {
    plainText: string;
    json: {
      content: any;
      toc: any;
    };
    readingTime: number;
  };
};

/* -------------------------------------------------------------------------------------------------
 * Mock Blog Implementation
 * -----------------------------------------------------------------------------------------------*/

export const blog = {
  postsQuery: {},
  latestPostQuery: {},
  postQuery: (slug: string) => ({}),
  
  getPosts: async (): Promise<PostMeta[]> => {
    return [];
  },

  getLatestPost: async (): Promise<Post | null> => {
    return null;
  },

  getPost: async (slug: string): Promise<Post | null> => {
    return null;
  },
};

/* -------------------------------------------------------------------------------------------------
 * Mock Legal Implementation
 * -----------------------------------------------------------------------------------------------*/

export const legal = {
  postsQuery: {},
  latestPostQuery: {},
  postQuery: (slug: string) => ({}),
  
  getPosts: async (): Promise<LegalPost[]> => {
    return [];
  },

  getLatestPost: async (): Promise<LegalPost | null> => {
    return null;
  },

  getPost: async (slug: string): Promise<LegalPost | null> => {
    return null;
  },
};

// Export mock basehub client and fragmentOn
export const basehubClient = () => ({
  query: async () => ({})
});

export const fragmentOn = Object.assign(
  (type: string, fragment: any) => fragment,
  {
    infer: (fragment: any) => ({} as any)
  }
);