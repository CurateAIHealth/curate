"use client";
type SubheadingPopProps = {
  items: {
    value: string;
    title: string;
  }[];
};

const SubheadingPop = ({ items }: SubheadingPopProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 my-8">
      {items.map((item:any, index:any) => (
        <div
          key={index}
          className="group relative px-6 py-3 rounded-full bg-white border border-gray-200 shadow-[0_10px_35px_rgba(0,0,0,0.08)] hover:shadow-[0_18px_45px_rgba(0,0,0,0.14)] transition-all duration-500 hover:-translate-y-1 cursor-pointer overflow-hidden"
        >
          <div className="absolute -left-20 top-0 h-full w-16 bg-white/70 skew-x-12 group-hover:left-[120%] transition-all duration-700"></div>

          <div className="relative z-10 flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-400 tracking-widest">
              {item.value}
            </span>

            <span className="text-base font-bold text-gray-900 tracking-wide">
              {item.title}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubheadingPop;