export const LoadingData=()=>{
    return(
<div className="min-h-screen flex items-center justify-center bg-[#f5f8fb] px-4">
  <div className="bg-white border border-[#e6edf5] shadow-xl rounded-3xl px-10 py-12 flex flex-col items-center relative overflow-hidden">

  
    <div className="absolute w-40 h-40 bg-[#e8f1ff] rounded-full blur-3xl opacity-60 animate-pulse"></div>

 
    <div className="relative flex items-center justify-center">

      <span className="absolute w-24 h-24 rounded-full border border-[#dbeafe] animate-[heartbeat_2.2s_ease-in-out_infinite]"></span>

 
      <div className="relative bg-white border border-gray-200 rounded-full p-4 shadow-md">
        <img
          src="Icons/Curate-logoq.png"
          className="h-10 w-10 object-contain"
          alt="Curate"
        />
      </div>
    </div>

 
    <h2 className="mt-8 text-base font-semibold text-[#1f2937]">
   Preparing your space…
    </h2>

 
    <p className="mt-2 text-sm text-gray-500 text-center max-w-[240px]">
      Please wait while we securely organize Client information.
    </p>

   
    <div className="mt-8 w-48 h-[32px] overflow-hidden">
      <svg viewBox="0 0 200 40" className="w-full h-full">
        <path
          d="M0 20 L20 20 L30 10 L40 30 L50 20 L70 20 L80 5 L90 35 L100 20 L200 20"
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
          className="animate-ecg"
        />
      </svg>
    </div>

  
    <div className="flex gap-2 mt-6">
      <span className="w-2 h-2 bg-[#93c5fd] rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-[#93c5fd] rounded-full animate-bounce [animation-delay:.15s]"></span>
      <span className="w-2 h-2 bg-[#93c5fd] rounded-full animate-bounce [animation-delay:.3s]"></span>
    </div>

  </div>
</div>





    )
}