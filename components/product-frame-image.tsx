"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

type Props = {
  src: string
  alt: string
  sizes: string
  unoptimized: boolean
  priority?: boolean
  withHover?: boolean
  className?: string
}

export function ProductFrameImage({
  src,
  alt,
  sizes,
  unoptimized,
  priority,
  withHover,
  className,
}: Props) {
  return (
    <div className={cn("min-h-0 min-w-0 overflow-hidden bg-muted", className)}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src={src}
          alt=""
          fill
          className="object-cover object-center blur-2xl scale-125 opacity-45"
          sizes={sizes}
          unoptimized={unoptimized}
          aria-hidden
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-3">
        <div
          className={cn(
            "relative h-full w-full",
            withHover && "transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          )}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain object-center"
            sizes={sizes}
            unoptimized={unoptimized}
            priority={priority}
          />
        </div>
      </div>
    </div>
  )
}

type ThumbProps = {
  src: string
  sizes: string
  unoptimized: boolean
}

export function ProductThumbImage({ src, sizes, unoptimized }: ThumbProps) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-muted">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src={src}
          alt=""
          fill
          className="object-cover object-center blur-md scale-110 opacity-35"
          sizes={sizes}
          unoptimized={unoptimized}
          aria-hidden
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-0.5">
        <div className="relative h-full w-full">
          <Image
            src={src}
            alt=""
            fill
            className="object-contain object-center"
            sizes={sizes}
            unoptimized={unoptimized}
          />
        </div>
      </div>
    </div>
  )
}
