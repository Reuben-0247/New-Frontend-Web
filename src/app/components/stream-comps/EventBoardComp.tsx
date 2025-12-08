import React from "react";

const EventBoardComp = () => {
  return (
    <div>
      <div className="w-full items-center mt-10 justify-center">
        <button className="flex items-center mx-auto rounded-lg bg-transparent border-white border-[.5px] px-2 h-[45px]">
          <span className="mr-2 text-white text-[16px]">+</span>
          <span className="text-white text-[14px]">Add Boards</span>
        </button>
        <p className="text-[#B9B9B9] text-center w-[70%] mx-auto font-nuni text-[14px] mt-3">
          Got materials for your event? Upload them here—slides, guides,
          links—and keep your audience engaged and informed.
        </p>
      </div>
    </div>
  );
};

export default EventBoardComp;
