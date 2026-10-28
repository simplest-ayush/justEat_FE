import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import * as cartApi from '../api/cartApi';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [cart, setCart] = useState(null); // null = no active cart, or not yet loaded
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user?.role === 'CUSTOMER') {
            refreshCart();
        } else {
            setCart(null);
        }
    }, [user]);

    // Sorts items by a stable key so display order doesn't shift when the backend
    // re-orders by updatedAt after a quantity change (which would make it look like
    // the wrong item was modified).
    function applyStableSort(data) {
        if (data?.items) {
            data.items.sort((a, b) =>
                (a.menuItem?.id ?? '').localeCompare(b.menuItem?.id ?? '')
            );
        }
        return data;
    }

    // Full refresh — shows the loading spinner. Use only for initial load (on login).
    async function refreshCart() {
        setIsLoading(true);
        try {
            const data = await cartApi.getCart();
            setCart(applyStableSort(data));
        } catch {
            // No active cart yet is a normal, expected state, not an error worth surfacing -
            // the backend likely 404s or returns empty here depending on implementation.
            setCart(null);
        } finally {
            setIsLoading(false);
        }
    }

    // Silent re-sync — re-fetches without touching isLoading so the existing UI
    // stays visible. Used after every mutation so the page never flashes a loader.
    async function syncCart() {
        try {
            const data = await cartApi.getCart();
            setCart(applyStableSort(data));
        } catch {
            setCart(null);
        }
    }

    async function addItem(menuItemId, quantity = 1) {
        try {
            await cartApi.addCartItem(menuItemId, quantity);
            await syncCart();
            return { success: true };
        } catch (err) {
            if (err.response?.status === 409) {
                // Cross-restaurant conflict - the business rule from the blueprint: one
                // restaurant per cart. Let the caller (the component) decide how to prompt,
                // rather than this context making UI decisions on its own.
                return { success: false, conflict: true };
            }
            throw err;
        }
    }

    async function forceAddItem(menuItemId, quantity = 1) {
        // Used after the caller has confirmed clearing the existing cart.
        await cartApi.clearCart();
        await cartApi.addCartItem(menuItemId, quantity);
        await syncCart();
    }

    async function updateItemQuantity(itemId, quantity) {
        await cartApi.updateCartItem(itemId, quantity);
        await syncCart();
    }

    async function removeItem(itemId) {
        await cartApi.removeCartItem(itemId);
        await syncCart();
    }

    async function clearCurrentCart() {
        await cartApi.clearCart();
        setCart(null);
    }

    const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <CartContext.Provider
            value={{
                cart,
                isLoading,
                itemCount,
                refreshCart,
                addItem,
                forceAddItem,
                updateItemQuantity,
                removeItem,
                clearCurrentCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}