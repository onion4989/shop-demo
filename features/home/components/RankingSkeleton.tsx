export function RankingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[708px] px-4 md:px-0 lg:max-w-none" aria-hidden>
      <div className="h-6 w-48 animate-pulse rounded bg-pink-100 md:h-9 md:w-56" />
      <div className="my-10 flex flex-col gap-[15px] md:hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-[131px] w-full animate-pulse rounded-[10px] bg-[#D2B48CB4]"
          />
        ))}
      </div>
      <div className="my-10 hidden md:block">
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
