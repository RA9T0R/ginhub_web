import React from 'react';
import Link from 'next/link';
import { Star, Clock, MapPin } from 'lucide-react';
import FavoriteButton from './FavoriteButton';

interface RestaurantProps {
    restaurant: {
        id: string;
        name: string;
        description: string | null;
        imageUrl: string | null;
        rating?: number;
        menus?: any[];
    };
    isFavorited?: boolean;
}

const RestaurantCard = ({ restaurant, isFavorited = false }: RestaurantProps) => {
    return (
        <Link
            href={`/restaurants/${restaurant.id}`}
            className="group flex flex-row md:flex-col bg-BG_light dark:bg-Dark_BG_light rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-md transition-all duration-300 h-full relative"
        >
            <div className="relative w-[120px] md:w-full min-h-[120px] md:h-48 bg-gray-200 dark:bg-zinc-800 shrink-0">
                <img
                    src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80'}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-2 right-2 z-10">
                    <FavoriteButton
                        restaurantId={restaurant.id}
                        initialIsFavorited={isFavorited}
                    />
                </div>
            </div>

            <div className="p-3 md:p-4 flex flex-col flex-1 justify-between">
                <div>
                    <div className="flex justify-between items-start mb-1 md:mb-2">
                        <h2 className="text-base md:text-lg font-bold text-Text dark:text-Dark_Text line-clamp-1">
                            {restaurant.name}
                        </h2>
                        <div className="hidden md:flex items-center gap-1 bg-orange-50 dark:bg-orange-500/10 px-2 py-1 rounded-md shrink-0 ml-2">
                            <Star size={12} className="text-secondary dark:text-Dark_secondary fill-secondary dark:fill-Dark_secondary" />
                            <span className="text-[10px] md:text-xs font-bold text-primary dark:text-Dark_primary">
                                {restaurant.rating ? restaurant.rating.toFixed(1) : '0.0'}
                            </span>
                        </div>
                    </div>
                    <p className="text-[10px] md:text-xs text-subtext dark:text-Dark_subtext line-clamp-2">
                        {restaurant.description}
                    </p>
                </div>

                <div className="mt-3 flex items-center gap-3 text-[10px] md:text-xs text-subtext dark:text-Dark_subtext font-medium pt-2 border-t border-gray-100 dark:border-zinc-800">
                    <span className="flex items-center gap-1">
                        <MapPin size={12} /> 2.5 กม.
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={12} /> 15 นาที
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default RestaurantCard;