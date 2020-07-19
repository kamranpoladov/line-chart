import { PlotProps } from '../Interfaces';

const data: PlotProps = {
    data: 
    [

    ]
};

const firstDate = new Date(2010, 6, 13);
const secondDate = new Date(
    new Date().getFullYear(), 
    new Date().getMonth(), 
    new Date().getDate());

while( firstDate < secondDate ) {
    firstDate.setDate(firstDate.getDate() + 1);
    data.data.push({ date: new Date(firstDate as unknown as VarDate), value: Math.floor(Math.random() * 3000) });
};
 

export default data;