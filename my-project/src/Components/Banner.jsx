import React, { useEffect, useRef, useState } from 'react';

export const Banner = () => {
  const [indexActive, setIndexActive] = useState(0);
  const slide = [
    {
      image: "/Images/Banner/banner_xiaomi14.png",
      path: "/xiaomi14u",
    },
    {
      image: "/Images/Banner/banner_ip15max.png",
      path: "/ip15max",
    },
    {
      image: "/Images/Banner/banner_ss24u.png",
      path: "/ss24u",
    }
  ];

  const handlePrev = () => {
    const newIndex = (indexActive - 1 + slide.length) % slide.length;
    setIndexActive(newIndex);
  };

  const handleNext = () => {
    const newIndex = (indexActive + 1) % slide.length;
    setIndexActive(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [indexActive]);

  return (
    <div className='w-full relative bg-white rounded-lg '>
      <div className="w-full overflow-hidden rounded-lg">
        <div className="flex" style={{ width: `${slide.length * 100}%`, transform: `translateX(-${indexActive * (100 / slide.length)}%)`, transition: '1s ' }}>
          {slide.map((item, index) => {
            return (
              <a key={index} href={item.path} className="h-[400px] flex-shrink-0" style={{width: `${(1/slide.length)*100}%`}}>
                <img className="w-full h-full object-cover" src={item.image} alt="" />
              </a>
            )
          })}
        </div>
      </div>
      <div className="w-full flex justify-between absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <button onClick={handlePrev} className='mx-3 w-[40px] aspect-square rounded-full text-gray-400'>
          <i className="fa-solid fa-chevron-left fa-lg"></i>
        </button>
        <button onClick={handleNext} className='mx-3 w-[40px] aspect-square rounded-full text-gray-400'>
          <i className="fa-solid fa-chevron-right fa-lg"></i>
        </button>
      </div>
    </div>
  )
};
