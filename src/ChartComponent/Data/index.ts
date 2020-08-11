import { DataPoint } from "../Interfaces";

const mockData: DataPoint[] = [];

const firstDate = new Date(2010, 6, 13);
const secondDate = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate()
);

while (firstDate < secondDate) {
  firstDate.setDate(firstDate.getDate() + 1);
  mockData.push({
    date: new Date((firstDate as unknown) as Date),
    value: Math.floor(Math.random() * 100000),
  });
}

export default mockData;
