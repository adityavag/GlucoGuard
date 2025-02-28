import React from "react";
const Card = (props) => {
    return (
        <div className="p-4 max-w-lg mx-auto my-4 bg-white shadow-lg rounded-lg overflow-hidden border">
            <div className="px-6 py-4 flex flex-col justify-center items-center">
                <div className="mt-4">
                    <div className="flex items-center gap-3 font-bold text-2xl mb-2"><span className="text-[#4f45e4]">{props.icon}</span>{props.title}</div>
                    <p className="text-gray-700 text-base mt-2 ">
                        {props.content}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Card;

