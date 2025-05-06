import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  quantity: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  category: string;
  location: string;
  minimumStock: number;
  maximumStock: number;
  reorderPoint: number;
  supplier: string;
  lastRestocked: string;
  expiryDate?: string;
}

interface InventoryMovement {
  id: string;
  itemId: string;
  type: 'in' | 'out' | 'transfer';
  quantity: number;
  date: string;
  reference: string;
  notes: string;
  fromLocation?: string;
  toLocation?: string;
}

interface InventoryState {
  items: InventoryItem[];
  movements: InventoryMovement[];
  locations: string[];
  costingMethod: 'FIFO' | 'LIFO' | 'weighted-average';
  
  addItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  
  addMovement: (movement: Omit<InventoryMovement, 'id'>) => void;
  updateMovement: (id: string, movement: Partial<InventoryMovement>) => void;
  deleteMovement: (id: string) => void;
  
  getStock: (itemId: string, location?: string) => number;
  getLowStockItems: () => InventoryItem[];
  getItemMovements: (itemId: string) => InventoryMovement[];
  
  addLocation: (location: string) => void;
  removeLocation: (location: string) => void;
  
  setCostingMethod: (method: 'FIFO' | 'LIFO' | 'weighted-average') => void;
}

const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      items: [],
      movements: [],
      locations: ['Main Warehouse', 'Store Front'],
      costingMethod: 'FIFO',

      addItem: (item) => {
        const newItem = {
          ...item,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          items: [...state.items, newItem],
        }));
      },

      updateItem: (id, item) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, ...item } : i
          ),
        }));
      },

      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      addMovement: (movement) => {
        const newMovement = {
          ...movement,
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
        };
        set((state) => ({
          movements: [...state.movements, newMovement],
        }));

        // Update item quantity
        const { items } = get();
        const item = items.find((i) => i.id === movement.itemId);
        if (item) {
          const quantityChange = movement.type === 'in' ? movement.quantity : -movement.quantity;
          get().updateItem(item.id, {
            quantity: item.quantity + quantityChange,
          });
        }
      },

      updateMovement: (id, movement) => {
        set((state) => ({
          movements: state.movements.map((m) =>
            m.id === id ? { ...m, ...movement } : m
          ),
        }));
      },

      deleteMovement: (id) => {
        set((state) => ({
          movements: state.movements.filter((m) => m.id !== id),
        }));
      },

      getStock: (itemId, location) => {
        const { movements } = get();
        return movements
          .filter((m) => 
            m.itemId === itemId && 
            (!location || m.toLocation === location)
          )
          .reduce((stock, m) => {
            if (m.type === 'in') return stock + m.quantity;
            if (m.type === 'out') return stock - m.quantity;
            return stock;
          }, 0);
      },

      getLowStockItems: () => {
        const { items } = get();
        return items.filter((item) => 
          item.quantity <= item.reorderPoint
        );
      },

      getItemMovements: (itemId) => {
        const { movements } = get();
        return movements
          .filter((m) => m.itemId === itemId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      addLocation: (location) => {
        set((state) => ({
          locations: [...state.locations, location],
        }));
      },

      removeLocation: (location) => {
        set((state) => ({
          locations: state.locations.filter((l) => l !== location),
        }));
      },

      setCostingMethod: (method) => {
        set({ costingMethod: method });
      },
    }),
    {
      name: 'inventory-store',
    }
  )
);

export default useInventoryStore;