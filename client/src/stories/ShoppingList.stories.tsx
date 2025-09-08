import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ShoppingList } from '../components/ShoppingList/ShoppingList';
import { ShoppingListManager } from '../components/ShoppingList/ShoppingListManager';

// Mock data for stories
const mockShoppingList = {
  id: "list_1",
  name: "Weekly Groceries",
  recipes: [
    { id: "1", title: "Fresh Caprese Salad" },
    { id: "2", title: "Garden Vegetable Stir Fry" }
  ],
  items: [
    {
      id: "item_1",
      name: "Tomatoes",
      normalizedName: "tomato",
      totalAmount: "6",
      unit: "large",
      recipes: ["1", "2"],
      conversions: [
        { from: "large", to: "cups", amount: "3", factor: 0.5 }
      ]
    },
    {
      id: "item_2", 
      name: "Garlic",
      normalizedName: "garlic",
      totalAmount: "7",
      unit: "cloves",
      recipes: ["1", "2"],
      conversions: []
    },
    {
      id: "item_3",
      name: "Olive oil",
      normalizedName: "olive oil", 
      totalAmount: "5",
      unit: "tbsp",
      recipes: ["1", "2"],
      conversions: [
        { from: "tbsp", to: "cups", amount: "0.31", factor: 0.0625 }
      ]
    }
  ],
  createdAt: "2024-09-01T10:00:00Z"
};

const mockShoppingLists = [
  {
    id: "list_1",
    name: "Weekly Groceries",
    recipeCount: 3,
    itemCount: 12,
    createdAt: "2024-09-01T10:00:00Z"
  },
  {
    id: "list_2", 
    name: "Dinner Party",
    recipeCount: 2,
    itemCount: 8,
    createdAt: "2024-09-03T15:30:00Z"
  }
];

// Mock query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof ShoppingList> = {
  title: 'Components/ShoppingList',
  component: ShoppingList,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="w-full max-w-2xl">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
  argTypes: {
    listId: {
      control: 'text',
      description: 'ID of the shopping list to display',
    },
    onClose: {
      action: 'closed',
      description: 'Callback when close button is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ShoppingList>;

// Mock the API responses
const mockApiClient = {
  get: async (url: string) => {
    if (url.includes('/api/shopping-lists/') && !url.includes('/api/shopping-lists')) {
      return mockShoppingList;
    }
    if (url === '/api/shopping-lists') {
      return mockShoppingLists;
    }
    throw new Error('Mock API endpoint not found');
  },
  post: async () => ({ success: true }),
  patch: async () => ({ success: true }),
  delete: async () => ({ success: true }),
};

// Mock the apiClient module
jest.mock('../lib/apiClient', () => ({
  apiClient: mockApiClient,
}));

export const Default: Story = {
  args: {
    listId: 'list_1',
  },
};

export const EmptyList: Story = {
  args: {
    listId: 'empty_list',
  },
  parameters: {
    mockData: [
      {
        url: '/api/shopping-lists/empty_list',
        method: 'GET',
        status: 200,
        response: {
          id: 'empty_list',
          name: 'Empty Shopping List',
          recipes: [],
          items: [],
          createdAt: '2024-09-01T10:00:00Z'
        },
      },
    ],
  },
};

export const WithConversions: Story = {
  args: {
    listId: 'list_with_conversions',
  },
  parameters: {
    mockData: [
      {
        url: '/api/shopping-lists/list_with_conversions',
        method: 'GET',
        status: 200,
        response: {
          ...mockShoppingList,
          items: [
            {
              id: "item_1",
              name: "Flour",
              normalizedName: "flour",
              totalAmount: "2.5",
              unit: "cups",
              recipes: ["1", "2"],
              conversions: [
                { from: "cups", to: "g", amount: "300", factor: 120 },
                { from: "cups", to: "oz", amount: "10.6", factor: 4.25 }
              ]
            },
            {
              id: "item_2",
              name: "Butter",
              normalizedName: "butter",
              totalAmount: "8",
              unit: "tbsp",
              recipes: ["1"],
              conversions: [
                { from: "tbsp", to: "cups", amount: "0.5", factor: 0.0625 },
                { from: "tbsp", to: "g", amount: "113", factor: 14.175 }
              ]
            }
          ]
        },
      },
    ],
  },
};

// ShoppingListManager stories
const metaManager: Meta<typeof ShoppingListManager> = {
  title: 'Components/ShoppingListManager',
  component: ShoppingListManager,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="p-6">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default metaManager;
type StoryManager = StoryObj<typeof ShoppingListManager>;

export const ManagerDefault: StoryManager = {
  parameters: {
    mockData: [
      {
        url: '/api/shopping-lists',
        method: 'GET',
        status: 200,
        response: mockShoppingLists,
      },
    ],
  },
};

export const ManagerEmpty: StoryManager = {
  parameters: {
    mockData: [
      {
        url: '/api/shopping-lists',
        method: 'GET',
        status: 200,
        response: [],
      },
    ],
  },
};
