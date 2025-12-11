// components/banner/Banner.tsx
export default function Banner() {
  return (
    <aside
      className="
        w-full max-w-[1200px] mx-auto
        px-4
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
        gap-6
      "
    >
      <div
        className="
          w-full aspect-8/5
          bg-gray-400
          rounded-large
          flex items-center justify-center
        "
      >
        <p className="text-white">広告バナー1</p>
      </div>

      <div
        className="
          w-full aspect-8/5
          bg-gray-400
          rounded-large
          flex items-center justify-center
        "
      >
        <p className="text-white">広告バナー2</p>
      </div>

      <div
        className="
          w-full aspect-8/5
          bg-gray-400
          rounded-large
          flex items-center justify-center
        "
      >
        <p className="text-white">広告バナー3</p>
      </div>
    </aside>
  );
}
