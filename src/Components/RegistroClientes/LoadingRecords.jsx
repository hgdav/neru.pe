import React from 'react'

const LoadingRecords = () => {
    return (
        <>
            <div className="shadow-lg rounded-3xl p-6 mb-4 bg-base-white min-h-[300px]">
                <div className="card-header">
                    <div className="flex items-center justify-between gap-2">
                        {/* Simular carga de un título */}
                        <div className="h-4 bg-gray-200 rounded-full w-3/4 animate-pulse"></div>
                    </div>
                </div>
                <div className="my-2">
                    <div className="info-row">
                        {/* Simular carga de información */}
                        <div className="h-3 bg-gray-200 rounded-full w-full animate-pulse"></div>
                    </div>
                </div>
                <div className="info-row mt-2">
                    <div className="h-3 bg-gray-200 rounded-full w-5/6 animate-pulse"></div>
                </div>
                <div className="info-row mt-2">
                    <div className="h-3 bg-gray-200 rounded-full w-4/6 animate-pulse"></div>
                </div>
                <div className="info-row mt-2">
                    <div className="h-3 bg-gray-200 rounded-full w-3/6 animate-pulse"></div>
                </div>
            </div>

        </>
    )
}

export { LoadingRecords }
