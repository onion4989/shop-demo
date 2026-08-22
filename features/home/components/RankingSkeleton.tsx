export function RankingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[708px] lg:max-w-none" aria-hidden>
      <div className="h-9 w-56 animate-pulse rounded bg-pink-100" />
      <div className="my-10">
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-[300px] w-[220px] shrink-0 animate-pulse rounded-[10px] bg-[#D2B48CB4] lg:h-[340px] lg:min-w-0 lg:w-auto lg:flex-1"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
