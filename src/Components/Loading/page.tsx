export const LoadingData=()=>{
    return(
          <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        
   
        <div className="relative w-24 h-24 flex items-center justify-center">
          
     
          <div className="absolute inset-0 rounded-full border-4 border-[#ff1493] opacity-30 animate-ping"></div>
          
      
       

       
          <img
            src="Icons/Curate-logoq.png"
            className="h-20 w-20 object-contain"
          />
        </div>

   
        <span className="text-[#50c896] font-semibold tracking-wide text-sm">
          Loading.....
        </span>
      </div>
    </div>
    )
}