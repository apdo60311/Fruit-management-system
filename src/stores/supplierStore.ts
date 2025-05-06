import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Supplier {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    rating: number;
    status: 'active' | 'inactive';
    paymentTerms: string;
    taxId: string;
}

interface PurchaseOrder {
    id: string;
    supplierId: string;
    orderDate: string;
    expectedDelivery: string;
    status: 'draft' | 'pending' | 'approved' | 'delivered' | 'cancelled';
    items: {
        id: string;
        itemId: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }[];
    total: number;
    notes: string;
    paymentStatus: 'unpaid' | 'partial' | 'paid';
}

interface SupplierState {
    suppliers: Supplier[];
    purchaseOrders: PurchaseOrder[];

    // Supplier management
    addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
    updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
    removeSupplier: (id: string) => void;

    // Purchase order management
    createPurchaseOrder: (order: Omit<PurchaseOrder, 'id'>) => void;
    updatePurchaseOrder: (id: string, order: Partial<PurchaseOrder>) => void;
    deletePurchaseOrder: (id: string) => void;

    // Queries
    getSupplierOrders: (supplierId: string) => PurchaseOrder[];
    getUnpaidOrders: () => PurchaseOrder[];
    getPendingDeliveries: () => PurchaseOrder[];
    getSupplierRating: (supplierId: string) => number;
}

const useSupplierStore = create<SupplierState>()(
    persist(
        (set, get) => ({
            suppliers: [],
            purchaseOrders: [],

            addSupplier: (supplier) => {
                const newSupplier = {
                    ...supplier,
                    id: crypto.randomUUID(),
                };
                set((state) => ({
                    suppliers: [...state.suppliers, newSupplier],
                }));
            },

            updateSupplier: (id, supplier) => {
                set((state) => ({
                    suppliers: state.suppliers.map((s) =>
                        s.id === id ? { ...s, ...supplier } : s
                    ),
                }));
            },

            removeSupplier: (id) => {
                set((state) => ({
                    suppliers: state.suppliers.filter((s) => s.id !== id),
                }));
            },

            createPurchaseOrder: (order) => {
                const newOrder = {
                    ...order,
                    id: crypto.randomUUID(),
                };
                set((state) => ({
                    purchaseOrders: [...state.purchaseOrders, newOrder],
                }));
            },

            updatePurchaseOrder: (id, order) => {
                set((state) => ({
                    purchaseOrders: state.purchaseOrders.map((o) =>
                        o.id === id ? { ...o, ...order } : o
                    ),
                }));
            },

            deletePurchaseOrder: (id) => {
                set((state) => ({
                    purchaseOrders: state.purchaseOrders.filter((o) => o.id !== id),
                }));
            },

            getSupplierOrders: (supplierId) => {
                const { purchaseOrders } = get();
                return purchaseOrders
                    .filter((o) => o.supplierId === supplierId)
                    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
            },

            getUnpaidOrders: () => {
                const { purchaseOrders } = get();
                return purchaseOrders.filter((o) => o.paymentStatus !== 'paid');
            },

            getPendingDeliveries: () => {
                const { purchaseOrders } = get();
                return purchaseOrders.filter(
                    (o) => o.status === 'approved' && new Date(o.expectedDelivery) > new Date()
                );
            },

            getSupplierRating: (supplierId) => {
                const { purchaseOrders, suppliers } = get();
                const supplier = suppliers.find((s) => s.id === supplierId);
                if (!supplier) return 0;

                const orders = purchaseOrders.filter((o) => o.supplierId === supplierId);
                if (orders.length === 0) return supplier.rating;

                const onTimeDeliveries = orders.filter(
                    (o) =>
                        o.status === 'delivered' &&
                        new Date(o.expectedDelivery) >= new Date(o.orderDate)
                );

                return (onTimeDeliveries.length / orders.length) * 5;
            },
        }),
        {
            name: 'supplier-store',
        }
    )
);

export default useSupplierStore;