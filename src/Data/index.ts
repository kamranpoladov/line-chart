import { PlotProps } from '../Interfaces';

const data: PlotProps = {
    data: 
    [

    ]
};

let firstDate = new Date(2010, 6, 11);
let secondDate = new Date(2020, 6, 11);

while( firstDate < secondDate ) {
    firstDate.setDate(firstDate.getDate() + 1);
    data.data.push({date: new Date(firstDate as unknown as VarDate), value: Math.floor(Math.random() * 100) });
};
 

export default data;