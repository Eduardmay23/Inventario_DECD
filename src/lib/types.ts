
export type Product = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  location: string;
  reorderPoint: number;
};

export type Loan = {
  id: string;
  productId: string;
  productName: string;
  requester: string;
  loanDate: string;
  returnDate?: string;
  quantity: number;
  status: 'Prestado' | 'Devuelto';
};

export type StockMovement = {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    type: 'descuento' | 'incremento';
    reason: string;
    date: string;
};

export type User = {
    id: string; // This will be the Firebase Auth UID
    uid: string; // Explicitly keep uid as it's used in Firestore doc
    username: string; 
    password?: string; // Only used for creation, not stored in Firestore
    name: string;
    role: 'admin' | 'user';
    permissions: string[];
};
