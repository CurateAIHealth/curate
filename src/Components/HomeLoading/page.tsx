type LoadingProps = {
    progress: number;
    message: string;
};

export const HomeLoadingData = ({
    progress,
    message,
}: LoadingProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f8fb] px-4">

            <div className=" flex flex-col items-center justify-center bg-white border border-[#e6edf5] shadow-xl rounded-3xl px-10 py-12 w-[380px]">

              <img
            src="/Icons/Curate-logoq.png"
            className="h-12"
            alt="Company Logo"
          />

                <h2 className="mt-8 text-base font-semibold text-center">
                    {message}
                </h2>

                <p className="text-sm text-gray-500 text-center mt-2">
                    Please wait while we securely organize your data.
                </p>

                {/* Progress */}

                <div className="mt-8">

                    <div className="flex justify-between mb-2">

                        <span className="text-sm text-gray-500">
                            Progress
                        </span>

                        <span className="font-semibold text-[#1392d3]">
                            {progress}%
                        </span>

                    </div>

                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">

                        <div
                            className="h-full bg-[#1392d3] transition-all duration-500 rounded-full"
                            style={{
                                width: `${progress}%`,
                            }}
                        />

                    </div>

                </div>

            </div>

        </div>
    );
};