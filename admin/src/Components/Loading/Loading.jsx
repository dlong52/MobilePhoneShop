import React, { memo } from 'react';
import './Loading.css'; // Import CSS file for styling

const Loading = () => {
    return (
        <div className=" w-full min-h-[500px] h-full bg-transparent flex justify-center items-center">
            <div class="">
                <div class="border-t-transparent border-solid animate-spin  rounded-full border-blue-400 border-8 h-[100px] w-[100px]"></div>
            </div>
        </div>   
    );
};

export default memo(Loading);  