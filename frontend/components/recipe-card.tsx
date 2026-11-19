"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/lib/context/favorites-context";
import { useRecipes } from "@/lib/context/recipes-context";
import { Icon } from "@/components/ui/icon";

export interface RecipeCardProps {
  id: string | number;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  prepTime: string;
  rating: number;
  portions: string;
  authorName: string;
  authorInitial?: string;
  category?: string;
  onQuickView?: (title: string) => void;
  onBookmarkToggle?: (id: string | number, isBookmarked: boolean) => void;
}

export function RecipeCard({
  id,
  title,
  description,
  image,
  imageAlt,
  prepTime,
  rating,
  portions,
  authorName,
  authorInitial,
  onQuickView,
  onBookmarkToggle,
}: RecipeCardProps) {
  const { isFavorited, toggleFavorite } = useFavorites();
  const { recipes } = useRecipes();
  const recipe = recipes.find((item) => item.id === String(id));
  const isBookmarked = isFavorited(String(id));
  const toggleBookmark = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!recipe) return;
    const nextState = toggleFavorite(recipe.id, recipe);
    onBookmarkToggle?.(id, nextState);
  };

  const initial = authorInitial || authorName.charAt(0).toUpperCase();

  return (
    <article className="recipe-card bg-surface-container-lowest rounded-3xl p-3 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-outline-variant/30 group">
      <div>
        {/* Image Container with Padding Rule */}
        <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-surface-container">
          <Image
            src={image}
            alt={imageAlt || title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Prep time badge */}
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm font-label-mono-sm text-label-mono-sm text-on-surface font-medium shadow-xs">
            {prepTime}
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={toggleBookmark}
            disabled={!recipe}
            title={isBookmarked ? "Bỏ lưu công thức" : "Lưu vào yêu thích"}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm flex items-center justify-center transition-colors shadow-xs cursor-pointer ${
              isBookmarked ? "text-primary" : "text-outline hover:text-primary"
            }`}
          >
            <Icon
              name={isBookmarked ? "bookmark" : "bookmark_border"}
              filled={isBookmarked}
              size={18}
            />
          </button>
        </div>

        {/* Metadata & Title */}
        <div className="p-space-sm pt-space-md">
          <div className="flex items-center justify-between text-outline font-label-mono-sm text-label-mono-sm mb-1.5">
            <span className="flex items-center gap-1 text-secondary font-semibold">
              <Icon name="star" filled size={16} />
              {rating.toFixed(1)}
            </span>
            <span>{portions}</span>
          </div>

          <Link href={`/recipes/${id}`}>
            <h3 className="font-title-md text-title-md text-on-surface font-semibold line-clamp-1 mb-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
          </Link>

          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-space-sm">
            {description}
          </p>
        </div>
      </div>

      {/* Author Strip & Quick Action */}
      <div className="p-space-sm pt-0 flex items-center justify-between gap-2 border-t-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface font-label-mono-sm text-label-mono-sm shrink-0">
            {initial}
          </div>
          <span className="font-body-sm text-body-sm text-on-surface truncate">
            {authorName}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onQuickView && onQuickView(title)}
          title="Xem chi tiết"
          className="p-2 rounded-xl bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary transition-all shadow-xs cursor-pointer"
        >
          <Icon name="arrow_forward" size={18} />
        </button>
      </div>
    </article>
  );
}
