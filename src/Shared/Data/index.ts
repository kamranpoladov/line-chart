import { PlotProps } from '../Interfaces';

const data: PlotProps = {
    data: 
    [

    ]
};

const firstDate = new Date(2000, 5, 13);
const secondDate = new Date(2020, 6, 18);

while( firstDate < secondDate ) {
    firstDate.setDate(firstDate.getDate() + 1);
    data.data.push({date: new Date(firstDate as unknown as VarDate), value: Math.floor(Math.random() * 100) });
};
 

export default data;