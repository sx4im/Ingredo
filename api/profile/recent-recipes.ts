import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Mock recent recipes data
  const recentRecipes = [
    {
      id: "chicken-stir-fry",
      title: "Chicken Stir Fry",
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&w=600&h=400&fit=crop",
      cookTime: 20,
      rating: 4.7,
      reviewCount: 156,
      tags: ["Quick", "Asian"],
      lastCooked: "2024-01-22"
    },
    {
      id: "beef-tacos",
      title: "Beef Tacos",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&w=600&h=400&fit=crop",
      cookTime: 30,
      rating: 4.5,
      reviewCount: 98,
      tags: ["Mexican", "Family"],
      lastCooked: "2024-01-21"
    },
    {
      id: "salmon-teriyaki",
      title: "Salmon Teriyaki",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&w=600&h=400&fit=crop",
      cookTime: 25,
      rating: 4.8,
      reviewCount: 87,
      tags: ["Healthy", "Japanese"],
      lastCooked: "2024-01-19"
    }
  ];

  res.status(200).json(recentRecipes);
}

