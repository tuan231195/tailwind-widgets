import React from 'react';

export function Avatar({ src }) {
    return (
        <div className="w-8 h-8 relative">
            <div className="group w-full h-full rounded-full overflow-hidden shadow-inner text-center bg-purple table cursor-pointer">
                <span className="hidden group-hover:table-cell text-white font-bold align-middle">KR</span>
                <img
                    src={src}
                    alt="lovely avatar"
                    className="object-cover object-center w-full h-full visible group-hover:hidden"
                />
            </div>
        </div>
    );
}
