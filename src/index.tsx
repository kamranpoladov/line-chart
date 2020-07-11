import './index.scss';

import React from 'react';
import { render } from 'react-dom';

import { register } from './serviceWorker';
import TestComponent from './TestComponent';

// here we disable console and performance for better production experience
// console.log(process.env.NODE_ENV);
// if (!process || !process.env || process.env.NODE_ENV !== "development") {
//   performance.mark = () => undefined as any;
//   performance.measure = () => undefined as any;
//   console.log = () => undefined as any;
// }

const App = () => (
  <div styleName='wrapper'>
    <section styleName='up'>
      <div styleName='component upper' />
      <div styleName='component upper' />
      <div styleName='component upper' />
      <div styleName='component upper' />
    </section>
    <section styleName='down'>
      <TestComponent />
      <div styleName='component bottom' />
      <div styleName='component bottom' />
    </section>
  </div>
);

render(<App />, document.getElementById("root"));

register();
