import { cn } from "@/lib/utils"
import { Marquee } from "@/components/magicui/marquee"

const reviews = [
  {
    name: "Alex Chen",
    username: "@alexchen",
    body: "This design is absolutely stunning. Clean, minimal, and so elegant.",
    img: "https://avatar.vercel.sh/alex",
  },
  {
    name: "Sarah Mills",
    username: "@sarahmills",
    body: "The animations are so smooth. This is the best portfolio site I've seen.",
    img: "https://avatar.vercel.sh/sarah",
  },
  {
    name: "Jordan Lee",
    username: "@jordanlee",
    body: "Incredible work. The attention to detail is amazing.",
    img: "https://avatar.vercel.sh/jordan",
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)
const thirdRow = reviews.slice(0, reviews.length / 2)
const fourthRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <figure
      className={cn(
        "relative h-fit w-60 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-border bg-card hover:bg-secondary/50",
        "dark:border-border dark:bg-card dark:hover:bg-secondary/50",
        "transition-colors duration-300"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt={name} src={img || "/placeholder.svg"} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-foreground">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-muted-foreground">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-foreground/80">{body}</blockquote>
    </figure>
  )
}

export function Marquee3D() {
  return (
    <div className="relative w-full flex items-center justify-center py-12 px-4">
      <div className="relative flex h-96 w-full max-w-4xl flex-row items-center justify-center gap-4 overflow-hidden rounded-lg [perspective:300px]">
        <div
          className="flex flex-row items-center justify-center gap-4"
          style={{
            transform: "translateZ(0) rotateX(0deg) rotateY(0deg)",
          }}
        >
          <div className="h-80 w-64 overflow-y-hidden">
            <Marquee pauseOnHover vertical className="[--duration:20s]">
              {firstRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
          </div>
          <div className="h-80 w-64 overflow-y-hidden">
            <Marquee reverse pauseOnHover className="[--duration:20s]" vertical>
              {secondRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
          </div>
          <div className="hidden md:block h-80 w-64 overflow-y-hidden">
            <Marquee reverse pauseOnHover className="[--duration:20s]" vertical>
              {thirdRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
          </div>
          <div className="hidden md:block h-80 w-64 overflow-y-hidden">
            <Marquee pauseOnHover className="[--duration:20s]" vertical>
              {fourthRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
      </div>
    </div>
  )
}
