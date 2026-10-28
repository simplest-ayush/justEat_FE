import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { browseRestaurants } from '../../api/restaurantApi';
import { getPreferences } from '../../api/preferenceApi';
import { useAuth } from '../../app/AuthContext';
import CustomerPageShell from '../customer/CustomerPageShell';
import { Menu, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BrowsePage() {
    const { user } = useAuth();
    const [restaurants, setRestaurants] = useState([]);
    const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState([]);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadRestaurants();
    }, []);

    async function loadRestaurants(searchQuery = '') {
        setIsLoading(true);

        try {
            const [restaurantsData, preferencesData] = await Promise.all([
                browseRestaurants({ query: searchQuery || undefined }),
                getPreferences(user.id),
            ]);

            setRestaurants(restaurantsData.content);
            setFavoriteRestaurantIds(
                (preferencesData.favoriteRestaurants || []).map(
                    (favorite) => favorite.restaurant.id
                )
            );
        } catch {
            toast.error('Could not load restaurants. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    function handleSearchSubmit(e) {
        e.preventDefault();
        loadRestaurants(query);
    }

    const favoriteRestaurants = restaurants.filter((restaurant) =>
        favoriteRestaurantIds.includes(restaurant.id)
    );

    const otherRestaurants = restaurants.filter(
        (restaurant) => !favoriteRestaurantIds.includes(restaurant.id)
    );

    return (
        <CustomerPageShell
            title="Browse Restaurants"
            subtitle="Pick your next meal from handpicked restaurants and cuisines near you."
        >
            {/* Search */}
            <form
                onSubmit={handleSearchSubmit}
                className="mb-8 rounded-3xl border border-[#D8D2C6] bg-gradient-to-r from-[#FFFEFB] via-[#F8F5EE] to-[#EEF3F6] p-3 shadow-[0_12px_35px_rgba(23,50,77,0.08)] sm:flex sm:items-center sm:gap-3"
            >
                <input
                    type="text"
                    placeholder="Search restaurants..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="mb-3 w-full rounded-2xl border border-[#D8D2C6] bg-[#FFFEFB] px-4 py-3 text-sm text-[#17212B] outline-none transition placeholder:text-[#8A9095] focus:border-[#9C8050] focus:ring-4 focus:ring-[#C9A66B]/15 sm:mb-0 sm:flex-1"
                />

                <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#17324D] to-[#234E70] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#17324D]/20 transition duration-200 hover:-translate-y-0.5 hover:from-[#122A41] hover:to-[#1D4564] hover:shadow-xl sm:w-auto"
                >
                    <Search className="h-5 w-5" />
                    <span>Search</span>
                </button>
            </form>

            {isLoading ? (
                <div className="rounded-3xl border border-[#D8D2C6] bg-[#FFFEFB] p-10 text-center text-sm text-[#69747D] shadow-[0_10px_35px_rgba(23,50,77,0.07)]">
                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#D8D2C6] border-t-[#17324D]" />
                    Loading restaurants...
                </div>
            ) : restaurants.length === 0 ? (
                <div className="rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#FFFEFB] to-[#F2F5F6] p-10 text-center shadow-[0_10px_35px_rgba(23,50,77,0.07)]">
                    <p className="text-base font-semibold text-[#17212B]">
                        No restaurants found
                    </p>

                    <p className="mt-1 text-sm text-[#69747D]">
                        Try searching for a different restaurant or cuisine.
                    </p>
                </div>
            ) : (
                <div className="space-y-10">
                    {/* Favorites */}
                    <section>
                        <div className="mb-5 flex items-center gap-3">
                            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-[#C9A66B] to-[#9C8050]" />

                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-[#17212B]">
                                    Favorites
                                </h2>

                                <p className="mt-0.5 text-xs text-[#7B8389]">
                                    Your preferred dining spots
                                </p>
                            </div>
                        </div>

                        {favoriteRestaurants.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-[#D8D2C6] bg-gradient-to-br from-[#FFFEFB] to-[#F3F1EB] p-7 text-sm text-[#69747D]">
                                No favorites yet. Tap the heart icon on a restaurant
                                page to add favorites.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                {favoriteRestaurants.map((restaurant) => (
                                    <RestaurantCard
                                        key={restaurant.id}
                                        restaurant={restaurant}
                                        highlight
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* All Restaurants */}
                    <section>
                        <div className="mb-5 flex items-center gap-3">
                            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-[#17324D] to-[#456B87]" />

                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-[#17212B]">
                                    All Restaurants
                                </h2>

                                <p className="mt-0.5 text-xs text-[#7B8389]">
                                    Discover your next favorite place
                                </p>
                            </div>
                        </div>

                        {otherRestaurants.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-[#D8D2C6] bg-gradient-to-br from-[#FFFEFB] to-[#F2F5F6] p-7 text-sm text-[#69747D]">
                                No other restaurants found.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                {otherRestaurants.map((restaurant) => (
                                    <RestaurantCard
                                        key={restaurant.id}
                                        restaurant={restaurant}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            )}
        </CustomerPageShell>
    );
}

function RestaurantCard({ restaurant, highlight = false }) {
    return (
        <Link
            to={`/restaurants/${restaurant.id}`}
            className={`
                group relative block overflow-hidden rounded-3xl border
                bg-gradient-to-br from-[#FFFEFB] via-[#FAF8F3] to-[#EEF3F6]
                p-6
                shadow-[0_8px_30px_rgba(23,50,77,0.08)]
                transition-all duration-300
                hover:-translate-y-1.5
                hover:shadow-[0_20px_45px_rgba(23,50,77,0.14)]
                ${
                    highlight
                        ? 'border-[#C9A66B]/70 ring-1 ring-[#C9A66B]/20'
                        : 'border-[#D8D2C6]'
                }
            `}
        >
            {/* Soft decorative gradients */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#C9A66B]/10 blur-3xl transition-transform duration-500 group-hover:scale-150" />

            <div className="pointer-events-none absolute -bottom-16 -left-12 h-36 w-36 rounded-full bg-[#17324D]/10 blur-3xl" />

            {/* Decorative top line */}
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#17324D] via-[#C9A66B] to-[#234E70] opacity-80" />

            <div className="relative">
                {/* Cuisine + Favorite */}
                <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex rounded-full bg-[#EAF0F3] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#234E70] ring-1 ring-[#D5E0E6]">
                        {restaurant.cuisineType}
                    </span>

                    {highlight ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F3EBDD] px-3 py-1.5 text-xs font-bold text-[#80663C] ring-1 ring-[#E5D6B9]">
                            ♥ Favorite
                        </span>
                    ) : null}
                </div>

                {/* Restaurant information */}
                <div className="mt-7">
                    <h3 className="text-xl font-bold tracking-tight text-[#17212B] transition-colors duration-200 group-hover:text-[#234E70]">
                        {restaurant.name}
                    </h3>

                    <div className="mt-2 flex items-center gap-2 text-sm text-[#69747D]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#C9A66B]" />
                        {restaurant.city}
                    </div>
                </div>

                {/* Menu button */}
                <div className="mt-7">
                    <span className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#17324D] to-[#234E70] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#17324D]/20 transition-all duration-200 group-hover:from-[#122A41] group-hover:to-[#1D4564] group-hover:shadow-xl">
                        <Menu className="h-5 w-5" />
                        Menu
                    </span>
                </div>
            </div>
        </Link>
    );
}