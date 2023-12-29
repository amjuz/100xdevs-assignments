## Counter without setInterval

Without using setInterval, try to code a counter in Javascript. There is a hint at the bottom of the file if you get stuck.

function printSeconds(){
  
  console.clear();
  console.log(++count)
  
  setTimeout(()=>{
    printSeconds();
  },1000)
  
}

let count = 0;
printSeconds();
  






































































(Hint: setTimeout)
