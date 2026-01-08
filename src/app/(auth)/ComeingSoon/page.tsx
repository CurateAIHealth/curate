export default function ComeingSoon(){
    return(
        <div className="flex items-center justify-center min-h-[60vh] px-4">
  <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-lg p-8 text-center">
    
    <div className="flex justify-center mb-4">
      <div className="h-14 w-14 flex items-center justify-center rounded-full bg-yellow-100">
        🚧
      </div>
    </div>

    <h1 className="text-xl font-semibold text-gray-800 mb-2">
      Page Under Construction
    </h1>

    <p className="text-sm text-gray-600 mb-6">
      We’re working hard to bring this feature to life.  
      Please check back soon!
    </p>

    <div className="flex justify-center">
      <span className="text-xs text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
        🚀 Coming Soon
      </span>
    </div>

  </div>
</div>

    )
}