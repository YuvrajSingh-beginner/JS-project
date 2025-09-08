let button = document.querySelector(".buttons");
let main = document.querySelector("#main_display");
let upper_dis = document.querySelector("#second_display");

main.value="0";
upper_dis.value="";
answer = "";
string ="";
 let result ="";
//  function to display values on main display 
function display(e){
    main.value = e;
}
// function to display values on upper display
function upperdisplay(e){
    upper_dis.value = e
}
// function to  solve and give answer 
function solve(){
    try{
     return Function("return " + string )();}
     catch{
        Error
     }
}


// handle all button of calculator
button.addEventListener("click", (e)=>{
   let  clicked = e.target.closest("button");
    // if user click on = button then dont = add in string
    if (!["AC","C","="].includes(clicked.value)){
        if (string === "" & answer !== ""){
            upper_dis.value = "";
        }
        string+=clicked.value;
        display(string);
    }   
    //if user click on = butten then it return answer of string
    if (clicked.value=== "="){
        let result = solve();
        answer=Math.round(result * 100)/100;
        
        display(answer); 
        upperdisplay(string);  
        string = "";  
    }
    // for clear button
    if(clicked.value === "C"){
        display("0");
        upperdisplay("");
        string="";
    }
    // for backspace
    if (clicked.value === "AC"){
        string = string.slice(0,-1);
        display(string);
    }
})

