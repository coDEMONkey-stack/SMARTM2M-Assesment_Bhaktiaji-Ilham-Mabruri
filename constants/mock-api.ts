import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter'; // For filtering
// import { number } from 'zod';

export const base_url = "https://mock-api-production-18dc.up.railway.app";

type Gender = 'male' | 'female';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  gender: Gender;
  date_of_birth: string;
  job: string;
};

// Mock user data store
export const fakeUsers = {
  records: [] as User[],

  initialize() {
    const sampleUsers: User[] = [];
    function generateRandomUserData(id: number): User {
      if (id === 1) {
        return {
          id,
          first_name: 'Bhaktiaji Ilham Mabruri',
          last_name: 'Surname', 
          email: 'bhaktiaji1997@gmail.com',
          phone: `001-${Math.floor(Math.random() * 900) + 100}-${
            Math.floor(Math.random() * 900) + 100
          }-${Math.floor(Math.random() * 10000)}`,
          country: 'INDONESIA',
          gender: 'male',
          date_of_birth: faker.date
            .between({ from: '1980-01-01', to: '2000-01-01' })
            .toISOString()
            .split('T')[0],
          job: 'Senior Frontend Developer',
        };
      }
      // For other users, generate random data
      const genders = ['male', 'female'];
      const jobs = [
        'Software Engineer',
        'Data Scientist',
        'Marketing Manager',
        'Graphic Designer',
        'Sales Manager',
        'Product Manager'
      ];


      return {
        id,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: `${faker.internet.email()}`,
        phone: `001-${Math.floor(Math.random() * 900) + 100}-${
          Math.floor(Math.random() * 900) + 100
        }-${Math.floor(Math.random() * 10000)}`,
        country: 'INDONESIA',
        gender: faker.helpers.arrayElement(genders) as Gender,
        date_of_birth: faker.date
          .between({ from: '1980-01-01', to: '2000-01-01' })
          .toISOString()
          .split('T')[0],
        job: faker.helpers.arrayElement(jobs),
      };
    }

    // Initialize with user Bhaktiaji Ilham and two other users
    sampleUsers.push(generateRandomUserData(1));
    for (let i = 2; i <= 3; i++) {
      sampleUsers.push(generateRandomUserData(i));
    }

    this.records = sampleUsers;
  },

  // Get all users with optional gender filtering and search
  async getAll({
    genders = [],
    search
  }: {
    genders?: string[];
    search?: string;
  }) {
    let users = [...this.records];

    // Filter users based on selected genders
    if (genders.length > 0) {
      users = users.filter((user) => genders.includes(user.gender));
    }

    // Search functionality across multiple fields
    if (search) {
      users = matchSorter(users, search, {
        keys: [
          'first_name',
          'last_name',
          'email',
          'job',
          'city',
          'street',
          'state',
          'country'
        ]
      });
    }

    return users;
  },

  // Get paginated results with optional gender filtering and search
  async getUsers({
    page = 1,
    limit = 10,
    genders,
    search
  }: {
    page?: number;
    limit?: number;
    genders?: string;
    search?: string;
  }) {
    const gendersArray = genders ? genders.split('.') : [];
    console.log('gendersArray', gendersArray); // eslint-disable-line no-console
    const allUsers = await this.getAll({ genders: gendersArray, search });
    const totalUsers = allUsers.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedUsers = allUsers.slice(offset, offset + limit);

    // Mock current time
    const currentTime = new Date().toISOString();

    // Return paginated response
    return {
      success: true,
      time: currentTime,
      message: 'Sample data for testing and learning purposes',
      total_users: totalUsers,
      offset,
      limit,
      users: paginatedUsers
    };
  }
};


// Initialize sample users
fakeUsers.initialize();

export const mockCategories = ["Electronics", "Clothing", "Home", "Beauty", "Books", "Toys"];

const searchParamsCache = new Map<string, string>();

export default searchParamsCache;

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  status: string;
  stock: number;
  lastUpdated: string;
  description: string;
  thumbnail: string;
  manufacturer: string;
  sku: string;
};

export const fakeProducts = {
  records: Array.from({ length: 50 }, (_, i) => ({
    id:  faker.number.int({ min: 0, max: 15 }),
    name: faker.commerce.productName(),
    category: faker.helpers.arrayElement(mockCategories),
    price: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
    status: faker.helpers.arrayElement(["In Stock", "Out of Stock"]),
    stock: faker.number.int({ min: 0, max: 500 }),
    lastUpdated: faker.date.recent().toISOString(),
    description: faker.commerce.productDescription(),
    thumbnail: faker.image.url(),
    manufacturer: faker.company.name(),
    sku: faker.string.uuid(),
  })),

  getProductById: (id: number) => {
    const product = fakeProducts.records.find((product) => product.id === id);
    return product || null;
  },

  fetchFilterProducts: async (filters: Record<string, any>) => {
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${base_url}/api/products?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data;
  },
};

export const fetchProductById = async (productId: number) => {
  try {
    const product = fakeProducts.getProductById(productId);

    if (!product) {
      return {
        success: false,
        message: `Product with ID ${productId} not found`,
      };
    }

    return {
      success: true,
      time: new Date().toISOString(),
      message: `Product with ID ${productId} found`,
      product: {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        status: product.status,
        stock: product.stock,
        lastUpdated: product.lastUpdated,
        description: product.description,
        thumbnail: product.thumbnail,
        manufacturer: product.manufacturer,
        sku: product.sku,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const fetchFilterProducts = async (filters: Record<string, any>) => {
  const params = new URLSearchParams(filters).toString();
  try {
    const response = await fetch(`${base_url}/api/products?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching products:', error);  // eslint-disable-line no-console
    return {
      success: false,
      message: error.message,
    };
  }
};

export const mockFetchProducts = async ({
  page = 1,
  limit = 10,
  search,
  category = "",
  sortBy = "name",
  order = "asc",
}: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}) => {
  await delay(500);

  try {
    const response = await fetch(
      `${base_url}/api/products?page=${page}&limit=${limit}&search=${search}&category=${category}&sortBy=${sortBy}&order=${order}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      data: result.data,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      message: result.error,
    };
  } catch (error: any) {
    console.error("Error fetching products:", error); // eslint-disable-line no-console
    return {
      data: [],
      total: 0,
      page,
      totalPages: 0,
      error: error.message,
    };
  }
};


export const mockFetchHealthCheck = async () => {
  await delay(100);
  return { status: "API is running" };
};

export const mockFetchDashboardStats = async () => {
  await delay(500);
  return {
    totalRevenue: 543789,
    totalOrders: 2345,
    averageOrderValue: 232,
    conversionRate: 3.45,
    revenueGrowth: 12.5,
    orderGrowth: 8.3,
  };
};

const mockRevenueTrend = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(Date.now() - i * 86400000);
  return {
    date: date.toISOString().split('T')[0],
    revenue: faker.number.int({ min: 500, max: 10000 }),
    orders: faker.number.int({ min: 500, max: 10000 }),
    customers: faker.number.int({ min: 500, max: 10000 }),

  };
});

export const mockFetchRevenueTrend = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500)); 
  return mockRevenueTrend.reverse();
};

export const mockFetchTopProducts = async () => {
  await delay(500);
  return fakeProducts.records.slice(0, 5).map((product) => ({
    id: product.id,
    name: product.name,
    revenue: faker.number.int({ min: 1000, max: 10000 }),
    sales: faker.number.int({ min: 1000, max: 10000 }),
    growth: faker.number.int({ min: 1, max: 100 }),

  }));
};

export const mockFetchSalesByCategory = async () => {
  await delay(500);
  return mockCategories.map((category) => ({
    category,
    sales: faker.number.int({ min: 100, max: 5000 }),
    revenue: faker.number.int({ min: 100, max: 5000 }),
    percentage: faker.number.int({ min: 1, max: 100 }),
  }));
};

export const mockFetchCategories = async (): Promise<string[]> => {
  try {
    await delay(300);
    const response = await fetch(
      `${base_url}/api/products?page=1&limit=10&sortBy=category`
    );
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    return data.categories || mockCategories;
  } catch (error) {
    console.error('Error fetching categories:', error); // eslint-disable-line no-console
    return mockCategories;
  }
};


