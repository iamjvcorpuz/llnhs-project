import { Children } from 'react'; 
export const EachMethod = ({render,of}) => Children.toArray(of.map((item,index) => render(item,index)));