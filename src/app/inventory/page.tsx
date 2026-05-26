'use client';

/**
 * Inventory Page
 * Main dashboard for inventory management
 */

import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/common';
import styles from '@/styles/Inventory.module.css';

// Mock data - Replace with actual API calls
const mockInventoryData = [
  {
    id: 1,
    name: 'Laptop',
    quantity: 5,
    price: 999.99,
    status: 'in-stock',
  },
  {
    id: 2,
    name: 'Mouse',
    quantity: 2,
    price: 29.99,
    status: 'low-stock',
  },
  {
    id: 3,
    name: 'Keyboard',
    quantity: 0,
    price: 79.99,
    status: 'out-of-stock',
  },
];

function InventoryContent() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Inventory Dashboard</h1>
        <div className={styles.actions}>
          <Button variant="primary">Add Item</Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Items</div>
          <div className={styles.statValue}>7</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>In Stock</div>
          <div className={styles.statValue}>5</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Low Stock</div>
          <div className={styles.statValue}>2</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Out of Stock</div>
          <div className={styles.statValue}>0</div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className={styles.card}>
        {mockInventoryData.length > 0 ? (
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th className={styles.tableHeadCell}>Item Name</th>
                <th className={styles.tableHeadCell}>Quantity</th>
                <th className={styles.tableHeadCell}>Price</th>
                <th className={styles.tableHeadCell}>Status</th>
                <th className={styles.tableHeadCell}>Actions</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {mockInventoryData.map((item) => (
                <tr key={item.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{item.name}</td>
                  <td className={styles.tableCell}>{item.quantity}</td>
                  <td className={styles.tableCell}>${item.price}</td>
                  <td className={styles.tableCell}>
                    <span
                      className={`${styles.badge} ${
                        item.status === 'in-stock'
                          ? styles.badgeSuccess
                          : item.status === 'low-stock'
                            ? styles.badgeWarning
                            : styles.badgeDanger
                      }`}
                    >
                      {item.status === 'in-stock'
                        ? 'In Stock'
                        : item.status === 'low-stock'
                          ? 'Low Stock'
                          : 'Out of Stock'}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>📭</div>
            <div className={styles.emptyStateText}>No items found</div>
            <Button variant="primary">Add First Item</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InventoryPage() {
  return (
    <MainLayout>
      <InventoryContent />
    </MainLayout>
  );
}
