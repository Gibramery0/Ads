import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface GameCardProps {
  id: string
  title: string
  imageUrl: string
  category: string[]
  className?: string
  aspectRatio?: "portrait" | "square" | "video"
  width?: number
  height?: number
}

export function GameCard({
  id,
  title,
  imageUrl,
  category,
  className,
  aspectRatio = "square",
  width,
  height,
}: GameCardProps) {
  const [imgError, setImgError] = useState(false);
  const fallbackImage = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop&auto=format&q=80';

  return (
    <div className={cn("relative overflow-hidden rounded-sm", className)}>
      <Link href={`/game/${id}`} className="block h-full w-full hover-card">
        <div className="relative">
          <div
            className={cn(
              "overflow-hidden rounded-sm",
              {
                "aspect-square": aspectRatio === "square",
                "aspect-[3/4]": aspectRatio === "portrait",
                "aspect-video": aspectRatio === "video",
              }
            )}
          >
            <Image
              src={imgError ? fallbackImage : imageUrl}
              alt={title}
              width={width || 300}
              height={height || 300}
              className="object-cover"
              onError={() => setImgError(true)}
              unoptimized
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-1">
            <div>
              <h3 className="font-medium text-white line-clamp-2 text-xs">{title}</h3>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
} 