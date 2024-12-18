import React from 'react'

const Breadcrumbs: React.FC = () => {
    return (
        <>
            {/* <nav className="bg-gray-100 p-4">
                    <ol className="flex space-x-2">
                        {breadcrumbs.map((breadcrumb, index) => (
                            <li key={index} className="flex items-center">
                                {index > 0 && (
                                    <span className="mx-2 text-gray-600">/</span>
                                )}
                                <a href={breadcrumb.href} className="text-green-700 hover:text-green-900">
                                    {breadcrumb.name}
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav> */}
            <div className=' px-4 py-2 mt-4 flex items-center justify-between'>
                <p className='text-md md:text-lg font-semibold'>Dashboard</p>
                <p className='text-md md:text-lg text-gray-700'>breadcrumbs</p>
            </div>
        </>
    )
}

export default Breadcrumbs