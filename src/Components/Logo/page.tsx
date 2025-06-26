 import Image from 'next/image';
 const Logo=()=>{
    return(
        <div className="flex flex-col items-center justify-center space-y-4">
        
          <div className="bg-white rounded-full pl-2 shadow-md w-[100px] h-[100px] flex items-center justify-center">
            <Image
              src="/Icons/Curate-logo.png"
              alt="Curate AI Health Logo"
              width={80}
              height={80}
              priority
              className="object-contain"
            />
          </div>
        </div>
    )
}

export default Logo