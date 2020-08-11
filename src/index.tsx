import "./index.scss";

import React from "react";
import { render } from "react-dom";

import { register } from "./serviceWorker";
import ChartComponent from "./ChartComponent";
import mockData from "./ChartComponent/Data";

// here we disable console and performance for better production experience
// console.log(process.env.NODE_ENV);
// if (!process || !process.env || process.env.NODE_ENV !== "development") {
//   performance.mark = () => undefined as any;
//   performance.measure = () => undefined as any;
//   console.log = () => undefined as any;
// }

const App = () => {
  const rightRangeInit = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ),
    leftRangeInit = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    );
  leftRangeInit.setDate(leftRangeInit.getDate() - 6);
  return (
    <div>
      <section styleName="down">
        <ChartComponent
          range={{
            rangeLeft: leftRangeInit,
            rangeRight: rightRangeInit,
          }}
          data={mockData}
        />
      </section>
    </div>
  );
};

render(<App />, document.getElementById("root"));

register();
