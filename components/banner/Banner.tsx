export default function Banner() {
  return (
    <>
      <aside className="grid grid-cols-3 gap-6 h-[240px]">
        <div className="bg-gray-400 rounded-large flex justify-center items-center">
          <p className="text-white">広告バナー1</p>
        </div>
        <div className="bg-gray-400 rounded-large flex justify-center items-center">
          <p className="text-white">広告バナー2</p>
        </div>
        <div className="bg-gray-400 rounded-large flex justify-center items-center">
          <p className="text-white">広告バナー3</p>
        </div>
      </aside>
    </>
  );
}
