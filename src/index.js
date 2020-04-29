import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Calculator extends React.Component {

  constructor(props) {
    super(props);
    this.calculatorOnClickHandler = this.calculatorOnClickHandler.bind(this);
    this.state = {expression: '0', result: 0, startNum: true};
  }

  calculatorOnClickHandler (value) {

    switch(value){

      // reset everything
      case "AC":
          this.setState({
            result: 0,
            expression: '0',
            startNum: true,  
            
          })
          break;

      
      case "+":
          this.setState({
            expression: this.state.expression + "+",        
            
          })
          break;
      
      case "-":
          this.setState({
            expression: this.state.expression + "-",  
           
          })
          break;
      

      case "*":

          this.setState({
            expression: this.state.expression + "*",         
           
          })
          break;
      
      case "%":
          this.setState({
            expression: this.state.expression + "%",
           
          })
          break;
      
      
      case "=":

          // check for errors in the expression, if found display error 
          var errorExists = errorCheck(this.state.expression)
          if (errorExists === true){
            this.setState({
              expression: "ERROR",
              startNum: true,
              result: 0,
                
                })
            
            break;
          }

          // parse the expression into an array 
          var expression = parser(this.state.expression);

          // calculate the result, or return an error if 0 division error is found 
          var result = calculateResult(expression);

          this.setState({
            expression: result,
              })

          break;
        

      default:

        // if first num, get rid of 0 at the beginning
        if (this.state.startNum === true && this.state.expression === "0-"){
          this.setState({
            expression: "-" + value,
            startNum: false,
            })
        }

        else if (this.state.startNum === true){
          this.setState({
            expression: value,
            startNum: false,
            })
        }

        else{
          this.setState({
            expression: this.state.expression + value,
            })
        }
    }

    return;
  }


  render() {
    return (
      <div className="calculator">
      <OutputScreen value={this.state.expression}/>
      <Keypad onClickHandler={this.calculatorOnClickHandler}/>
      </div>
    );
  }
}

class OutputScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {expression: '', result: this.props.value};
  }

  onClick = button => {
    this.setState({
      result: this.state.result + button
    })
  }

  render() {
    return (
      <div className="output-screen">
        {this.props.value}
      </div>
    );
  }
}

class Keypad extends React.Component {

  constructor(props){
    super(props);
    this.buttonOnClick = this.buttonOnClick.bind(this);
    this.calculatorHandler = this.props.onClickHandler;
    
  }

  buttonOnClick = (event) => {
    this.calculatorHandler(event.target.value);
  }


  render() {
    return (
      <div className="keypad">
      <button className="keypad-num" onClick={this.buttonOnClick} value="7" >7</button>
      <button className="keypad-num" onClick={this.buttonOnClick} value="8" >8</button>
      <button className="keypad-num" onClick={this.buttonOnClick} value="9" >9</button>
      <button className="keypad-button" onClick={this.buttonOnClick} value="*" >*</button>
      <button className="keypad-num" onClick={this.buttonOnClick} value="4" >4</button>
      <button className="keypad-num" onClick={this.buttonOnClick} value="5" >5</button>
      <button className="keypad-num" onClick={this.buttonOnClick} value="6" >6</button>
      <button className="keypad-button" onClick={this.buttonOnClick} value="%" >%</button>
      <button className="keypad-num" onClick={this.buttonOnClick} value="1" >1</button>
      <button className="keypad-num" onClick={this.buttonOnClick} value="2" >2</button>
      <button className="keypad-num" onClick={this.buttonOnClick} value="3" >3</button>
      <button className="keypad-button" onClick={this.buttonOnClick} value="-" >-</button>
      <button className="keypad-num" onClick={this.buttonOnClick} value="0" >0</button>
      <button className="keypad-button" onClick={this.buttonOnClick} value="AC" >AC</button>
      <button className="keypad-button" onClick={this.buttonOnClick} value="=" >=</button>
      <button className="keypad-button" onClick={this.buttonOnClick} value="+" >+</button>
      </div>
    );
  }
}




// ========================================

ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
);


// check expression for errors and return true if error is found
function errorCheck(expression) {

  // check if first char is not a - or a number
  if (expression.charAt(0) !== '-' && isNaN(expression.charAt(0))){
    return true;

  }

  // check if last char is not a number, or has length less than 3
  if (expression.length < 3 || isNaN(expression.charAt((expression.length)-1))){
    return true;
  }

  // check to see if the expression only has numbers
  var hasOnlyNum = /^\d+$/.test(expression);
  if (hasOnlyNum === true){
    return true;
  }

  // check to see if there are more than 1 sign in a row
  for (let i = 0; i < expression.length-1; i++){
    if (isNaN(expression.charAt(i)) && isNaN(expression.charAt(i+1))){
      return true;
    }
  }

  return false; // no error was found in expression, return false

}

// parse and convert into an array to handle the expression 
function parser(expression){

  var res = expression.split("");
  var new_expression = [];
  var num = '';
  var i = 0;
  var first_negative = false;

  // check if the first num should be negative
  if (expression[0] === '-'){
    first_negative = true;
    i = 1;
  }

  for (i; i < res.length; i++){
    if (isNaN(res[i])){

      if (first_negative === true) {
        new_expression.push(parseInt(num) * -1);
        first_negative = false;
      }
      else{
        new_expression.push(parseInt(num));
      }

      new_expression.push(res[i]);
      num = '';
    }
    else{
      num = num.concat(res[i]);
    }

  }
  new_expression.push(parseInt(num));

  return new_expression

}


// scan through expression following PEMDAS order 
function calculateResult(expression) {
  // multiplication
  var scan1 = [];
  var counter_a = 0;
  while (counter_a < (expression.length)){

    if (expression[counter_a] === "*"){
      var first_num_a = scan1[scan1.length - 1]
      var second_num_a = expression[counter_a+1];
      var result_a = parseInt(first_num_a * second_num_a);
      scan1.pop(); // remove last element
      scan1.push(result_a);
      counter_a += 1;

    }
    else{
      scan1.push(expression[counter_a]);

    }
    counter_a += 1;
  }

  // division
  var scan2 = [];
  var counter_b = 0;
  while (counter_b < (scan1.length)){

    if (scan1[counter_b] === "%"){
      var first_num_b = scan2[scan2.length - 1]
      var second_num_b = scan1[counter_b+1];
      if (second_num_b === 0){ // catch zero division error 
        return "ERROR"; 
        
      }
      var result_b = parseInt(first_num_b / second_num_b);
      scan2.pop(); // remove last element
      scan2.push(result_b);
      counter_b += 1;

    }
    else{
      scan2.push(scan1[counter_b]);

    }
    counter_b += 1;
  }

  // Addition and Subtraction
  var scan3 = [];
  var counter_c = 0;
  while (counter_c < (scan2.length)){

    if (scan2[counter_c] === "+"){
      var first_num_c = scan3[scan3.length - 1]
      var second_num_c = scan2[counter_c+1];
      var result_c = parseInt(first_num_c + second_num_c);
      scan3.pop(); // remove last element
      scan3.push(result_c);
      counter_c += 1;

    }

    else if (scan2[counter_c] === "-"){
      var first_num_d = scan3[scan3.length - 1]
      var second_num_d = scan2[counter_c+1];
      var result_d = parseInt(first_num_d - second_num_d);
      scan3.pop(); // remove last element
      scan3.push(result_d);
      counter_c += 1;

    }

    else{
      scan3.push(scan2[counter_c]);

    }
    counter_c += 1;
  }

  return scan3;

}