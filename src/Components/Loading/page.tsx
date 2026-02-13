export const LoadingData=()=>{
    return(
<div className="h-screen flex items-center justify-center bg-[#f9fafb]">
  <div className="flex flex-col items-center">

    
    <div className="relative flex items-center justify-center">

      <div className="w-24 h-24 rounded-full border border-gray-200"></div>
      <div className="absolute w-24 h-24 rounded-full border border-transparent border-t-[#ff1493] animate-spin [animation-duration:2.5s]"></div>


      <div className="absolute bg-white rounded-full p-3 shadow-sm">
        <img
          src="Icons/Curate-logoq.png"
          className="h-12 w-12 object-contain"
        />
      </div>
    </div>

 
    <p className="mt-6 text-[13px] text-gray-500 tracking-wide font-medium">
      Preparing your workspace
    </p>

  </div>
</div>

    )
}