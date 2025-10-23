import Card from '@mui/material/Card';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { CardDescription, CardTitle } from './ui/card';


const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink','blue'];

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Page h',
    uv: 3240,
    pv: 4300,
    amt: 2100,
  },
];

const getPath = (x:any, y:any, width:any, height:any) => {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
  Z`;
};

const TriangleBar = (props:any) => {
  const { fill, x, y, width, height } = props;

  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

export default function Barchart() {
  return (
     <Card className="w-full sm:w-full md:w-[48%] lg:w-[49%] pt-0 flex flex-col gap-7 justify-end items-end border" style={{boxShadow:"1px 1px 1px 1px 1px",borderRadius:"10px"}} >
          <div className=' w-full flex flex-col justify-start pl-7'>
            <CardTitle >Services</CardTitle>
            <CardDescription>
            Showing total Task Categories And their Analysis
          </CardDescription>
          </div>

     <ResponsiveContainer  width="100%" height={330} style={{boxShadow:"",display:"flex",alignItems:"end"}}>
      
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Bar dataKey="uv" fill="#8884d8" shape={<TriangleBar />} label={{ position: 'top' }}>
      {data.map((_entry, index) => (
        <Cell key={`cell-${index}`} fill={colors[index % 20]} />
      ))}
    </Bar>
  </BarChart>
 
 </ResponsiveContainer>
  </Card>
  );
}


