import { Children } from 'react'; 
export const EachMethod = ({render,of}) => Children.toArray((typeof(of)!="undefined"&&of!=null&&of.length>0)?of.map((item,index) => render(item,index)):null);