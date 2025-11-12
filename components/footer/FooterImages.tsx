export default function FooterBar() {
  return (
    <section className="grid grid-cols-12 mb-24 gap-6">
      <div className="col-span-5 grid grid-cols-3 grid-rows-2 gap-2">
        <div className="rounded-large bg-gray-400 flex justify-center items-center w-[156px] h-[156px]">店舗外観</div>
        <div className="rounded-large bg-gray-400 flex justify-center items-center w-[156px] h-[156px]">店舗外観</div>
        <div className="rounded-large bg-gray-400 flex justify-center items-center w-[156px] h-[156px]">店舗外観</div>
        <div className="rounded-large bg-gray-400 flex justify-center items-center w-[156px] h-[156px]">店舗外観</div>
        <div className="rounded-large bg-gray-400 flex justify-center items-center w-[156px] h-[156px]">店舗外観</div>
        <div className="rounded-large bg-gray-400 flex justify-center items-center w-[156px] h-[156px]">店舗外観</div>
      </div>
      <div className="col-span-7">
        <div className="rounded-large bg-gray-400 flex justify-center items-center w-full h-full">MAP</div>
      </div>
    </section>
  );
}
