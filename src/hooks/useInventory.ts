import { useContext } from 'react';
import { InventoryContext } from '../context/InventoryContext';

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an AuthProvider');
  }
  return context;
};