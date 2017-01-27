import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import Button from 'muicss/lib/react/button';
// console.clear();
// Contaner Component
// Todo Id
window.id = 0;

const Title = ({todoCount}) => {
  return (
    <div>
       <div>
          <h1>Todo App</h1><hr style={{height:'1px', backgroundColor: 'black'}}/>
          <h2>to-do ({todoCount})</h2>
       </div>
    </div>
  );
}

const Todo = ({todo, remove}) => {
  return (
    <a href="#" className="list-group-item" onClick={() => {remove(todo.id)}}>
      {todo.text}
    </a>
  );
}

const TodoForm = ({addTodo}) => {
  let input;
  return (
    <form onSubmit={(e) => {
        e.preventDefault();
        addTodo(input.value);
        input.value = '';
      }}>
      <input className="form-control col-md-12" ref={node => {
        input = node;
      }} />
      <br />
    </form>
  );
};

const TodoList = ({todos, remove}) => {
  const todoNode = todos.map((todo) => {
    return (<Todo todo={todo} key={todo.id} remove={remove}/>)
  });
  return (<div className="list-group" style={{marginTop:'30px'}}>{todoNode}</div>);
}

class TodoApp extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      data: []
    }
    this.apiUrl = 'https://57b1924b46b57d1100a3c3f8.mockapi.io/api/todos'
  }
  componentWillMount(){
    axios.get(this.apiUrl)
      .then((res) => {
        this.setState({data: res.data});
      });
  }
  addTodo(val){
    const todo = {text: val}
    axios.post(this.apiUrl, todo)
       .then((res) => {
          this.state.data.push(res.data);
          this.setState({data: this.state.data});
       });
  }
  handleRemove(id){
    const remainder = this.state.data.filter((todo) => {
      if(todo.id !== id) return todo;
    });
    axios.delete(this.apiUrl+'/'+id)
      .then((res) => {
        this.setState({data: remainder});
      })
  }
  render(){
    return (
      <div>
        <div style={{float: 'left', marginLeft: '15%'}}>
          <Title todoCount={this.state.data.length}/>
          <div style={{marginTop: '2rem'}}>
            <TodoForm addTodo={this.addTodo.bind(this)}/>
          </div>
          <TodoList
            todos={this.state.data}
            remove={this.handleRemove.bind(this)}
          />
        </div>
        <div style={{float: 'right', marginRight: '15%'}}>
          <Counter/>
        </div>
      </div>
    );
  }
}

// const style = {
//   "backgroundColor": "#4CAF50", /* Green */
//   "border": "none",
//   "color": "white",
//   "padding": "15px 32px",
//   "textAlign": "center",
//   "textDecoration": "none",
//   "display": "inline-block",
//   "fontSize": "16px",
//   "margin": "1rem"
// }

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    }
  }
  increment(){
    this.setState({counter: ++this.state.counter})
  }
  decrement(){
    this.setState({counter: --this.state.counter})
  }
  render() {
    return(
      <div>
        <h1>Counter App</h1><hr style={{height:'1px', backgroundColor: 'black'}}/>
        <div style={{display: '-webkit-box'}}>
          <p style={{fontSize:'30px', margin: '3rem 1rem 0rem 1rem'}}>Counter</p>
          <p style={{fontSize:'70px'}}>{this.state.counter}</p>
        </div>
          <Button color="primary" onClick={this.increment.bind(this)}> + </Button>
          <Button color="primary" onClick={this.decrement.bind(this)}> - </Button>
      </div>
    )
  }
}

render(<TodoApp/>, document.getElementById('container'));
