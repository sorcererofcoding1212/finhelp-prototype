import React from "react";

const PageHeading = ({heading}: {heading: string}) => {
  return (
    <div className="text-center mt-4 text-slate-600 text-2xl lg:text-4xl font-semibold">
      {heading}
    </div>
  );
};

export default PageHeading;
