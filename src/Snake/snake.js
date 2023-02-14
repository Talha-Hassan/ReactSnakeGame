import './snake.css';
import { useEffect, useState } from 'react';
import useInterval from '../extra.js'
import { IoArrowUpCircleSharp,IoArrowBackCircleSharp,IoArrowDownCircleSharp,IoArrowForwardCircleSharp } from 'react-icons/io5';
import {BsArrowClockwise} from 'react-icons/bs'

const BORAD_SIZE =15;
var NewCordinates ;

const DIRECTION = {
  UP : 'UP',
  DOWN : 'DOWN',
  RIGHT : 'RIGHT',
  LEFT : 'LEFT'
}
const START ={
      row : (BORAD_SIZE%2 === 1)? (BORAD_SIZE-1)/2 : BORAD_SIZE/2 ,
      col : (BORAD_SIZE%2 === 1)? (BORAD_SIZE-1)/2 : BORAD_SIZE/2 ,
      snake_start : (((BORAD_SIZE%2 === 1)? (BORAD_SIZE-1)/2 : BORAD_SIZE/2)*BORAD_SIZE) + ((BORAD_SIZE%2 === 1)? (BORAD_SIZE-1)/2 + 1: BORAD_SIZE/2 +1), 
      food_start : Math.ceil((((BORAD_SIZE%2 === 1)? (BORAD_SIZE-1)/4 : BORAD_SIZE/4)*BORAD_SIZE) + ((BORAD_SIZE%2 === 1)? (BORAD_SIZE-1)/2 + 1: BORAD_SIZE/2)) 
}
class LinkedListNode{
  constructor(value){
    this.value = value; 
    this.next = null;
  }
}
class SinglyLinkList{
  constructor(value){
    const node = new LinkedListNode(value);
    this.head = node;
    this.tail = node;
  }
}
class cell{
  constructor(row,col,value,direction_store){
    this.row = row
    this.col = col
    this.value=value
    this.direction_store = direction_store  
  }
}
function SnakeGame() {
  const [board,setBoard] = useState(Create_board(BORAD_SIZE))
  const [snakeCell,SetsnakeCell] = useState(new Set([START.snake_start]))
  const [snake,setSnake] = useState(new SinglyLinkList(new cell(START.row,START.col,START.snake_start,DIRECTION.RIGHT)))
  const [direction,setDirection] = useState(DIRECTION.RIGHT)
  const [foodCell,setFoodCell] = useState(START.food_start)
  const [score,setScore] = useState(0)
  const [over,setOver] = useState(false)
  const [reverse,setReverse] = useState(false)
  const [presskey,setPresskey] = useState(true) 
  const [previousScore,setPreviousScroce] =useState(0)
  const [startgame,setStartgame] = useState(false)
  useEffect(()=>{
    let currentDirection = direction
    window.addEventListener('keydown', e => {
       setStartgame(true)
       setPresskey(false)
       const NewDirection = GetNewDirection(e.key, currentDirection);
       if(!over){
            if (NewDirection !== '') {
                currentDirection = NewDirection;
                setDirection(NewDirection);
            }
        }
     }
     )

  },[])
  


  useInterval(()=>{
    if(foodCell%7 === 0){
      setReverse(true)
    }
    if(startgame && !over && !presskey){
        Snake_Movement()
    }
  },90)
  
  const Board_border_collison_check = (NewCordinates)=>{
    if(NewCordinates.row < 0 || NewCordinates.row > BORAD_SIZE-1 || NewCordinates.col < 0 || NewCordinates.col > BORAD_SIZE-1 ){
      Reset_Game(true,false)
      return true
    }
    return false
  }

  const RandomGenerator =(interval)=>{
      let number = Math.random(interval)*interval
      number =  Math.ceil(number)
      return number
  }
  const Food_cell =()=>{
      let maxSize = BORAD_SIZE * BORAD_SIZE;
      let randomFoodPositionNumber;
      setScore(score + 1)
      if(previousScore <= score){
        setPreviousScroce(score+1)
      }
      while(true){
          randomFoodPositionNumber = RandomGenerator(maxSize)
          if(randomFoodPositionNumber !== foodCell && !snakeCell.has(randomFoodPositionNumber)){
            break;
          }
        }
      if(randomFoodPositionNumber%7 === 0){
        setReverse(true)
        }
      setFoodCell(randomFoodPositionNumber)
  }
  const Reset_Game = (bool1,bool2)=>{
    if(bool1){
    setOver(true)
    setStartgame(false)
    setScore(0)
    }
    if(bool2){
    SetsnakeCell(new Set([START.snake_start]))
    setSnake(new SinglyLinkList(new cell(START.row,START.col,START.snake_start,DIRECTION.RIGHT)))
    setFoodCell(START.food_start)
    setPreviousScroce(0)
    }
  }
  const  Snake_Movement= () => {  
    const currentCoordinates= {
        row : snake.head.value.row,
        col : snake.head.value.col,
      }
      NewCordinates = GetNewCordinates(currentCoordinates,direction)
      if(Board_border_collison_check(NewCordinates)){}
      else{
        let newValue = board[NewCordinates.row][NewCordinates.col]
        if(snakeCell.has(newValue)){
          Reset_Game(true,false)
        }
        let newNode = new LinkedListNode( new cell(NewCordinates.row,NewCordinates.col,newValue,direction))
        const newCell = new Set()
        if(newValue === foodCell){
          if(reverse){
            if(snake.head !== snake.tail){
              let temp_head1 = snake.head
              let temp_head2 = null;
              let temp_head3 = snake.head
              snake.head = snake.head.next; 
              while(snake.head.next != null){
                  temp_head2 = temp_head1
                  temp_head1 = snake.head
                  snake.head = snake.head.next
                  temp_head1.next = temp_head2
              }
              snake.head.next = temp_head1
              snake.tail = temp_head3
              snake.tail.next = null
              }
              NewCordinates = GetNewCordinates({row: snake.head.value.row , col : snake.head.value.col},
                (snake.head.value.direction_store === DIRECTION.DOWN)?DIRECTION.UP:
                (snake.head.value.direction_store === DIRECTION.UP)?DIRECTION.DOWN:
                (snake.head.value.direction_store === DIRECTION.RIGHT)?DIRECTION.LEFT:
                (snake.head.value.direction_store === DIRECTION.LEFT)?DIRECTION.RIGHT:direction
                )
              Board_border_collison_check(NewCordinates)
              newValue = board[NewCordinates.row][NewCordinates.col]
              newNode = new LinkedListNode( new cell(NewCordinates.row,NewCordinates.col,newValue,direction))
              setReverse(false)
            }
            if(snake.head === snake.tail){
              snake.head  = newNode
              snake.head.next = snake.tail
              newCell.add(newValue)
              newCell.add(snakeCell.values().next().value)
              SetsnakeCell(newCell)
              Food_cell()
          }
          else{
            let sample = snake.head
            snake.head = newNode
            snake.head.next = sample
            newCell.add(newValue)
            snakeCell.forEach((e)=>{
            newCell.add(e)
            })
            SetsnakeCell(newCell)
            Food_cell()
          }
        }
        else{
          if(snake.head === snake.tail){
            snake.head= newNode
            snake.tail = snake.head
            newCell.add(newValue)
            SetsnakeCell(newCell)
          }
          else{
            newCell.add(newValue)
            snakeCell.forEach((e)=>{
             newCell.add(e)
            })
            newCell.delete(snake.tail.value.value)
            var sample1 = snake.head
            var sample2 = snake.head.next
            snake.head = newNode
            snake.head.next = sample1
            while(sample2 !== snake.tail){
              sample1 = sample2
              sample2 = sample2.next
            }
            snake.tail = sample1
            snake.tail.next = null
            SetsnakeCell(newCell)
          }
        }
        
      }
  }
  const GetNewCordinates=(currentCoordinates,direction)=>{
    setDirection(direction)
    if(direction === DIRECTION.UP){
      return{
        row : currentCoordinates.row - 1,
        col : currentCoordinates.col
      }
    }
    if(direction === DIRECTION.DOWN){
      return{
        row : currentCoordinates.row + 1,
        col : currentCoordinates.col
      }
    }
    if(direction === DIRECTION.LEFT){
      return{
        row : currentCoordinates.row ,
        col : currentCoordinates.col - 1 
      }
    }
    if(direction === DIRECTION.RIGHT){
      return{
        row : currentCoordinates.row,
        col : currentCoordinates.col + 1
      }
    }
  }  
  return (
    <div className="App">
        <h1>Snake Game</h1>
        <h1>Score : {score}</h1>
        <div className="flexx">
          <div className={'icons'}>
            <div>
              <IoArrowUpCircleSharp size={50} style={(direction === DIRECTION.UP)?{color: 'limegreen'}:''}/>
            </div>
            <div>
              <IoArrowBackCircleSharp size={50} style={(direction === DIRECTION.LEFT)?{color: 'limegreen' }:''}/>
              <IoArrowDownCircleSharp size={50} style={(direction === DIRECTION.DOWN)?{color: 'limegreen'}:''}/>
              <IoArrowForwardCircleSharp size={50} style={(direction === DIRECTION.RIGHT)?{color: 'limegreen'}:''}/>
            </div>
            <div className={`${over ? 'over2' : 'hidden'}`}>Your Score : {previousScore} </div> 
            <div className={'over2'} style={{fontSize: '60px'}} >{(over)?'Game Over' : (presskey)? 'Press Any Key To Start!':''}</div> 
            <div className={`${over ? 'over2' : 'hidden'}`}><button onClick={()=>{setOver(false);setPresskey(true);setStartgame(true);Reset_Game(false,true)}}><BsArrowClockwise size={50} /></button></div> 
          </div>
          <div className={ `${over?'boardover' : 'board'}`} >
            {
              board.map((row,rowId)=>(
                <div key={rowId}className={'row'}>
                  {row.map((cell,cellId)=>(
                    <div key={cellId} className={`${over? 'gameover': 'cell '}  ${snakeCell.has(cell)? 'snake_cell' : ''} 
                      ${(cell === foodCell)? `food_cell ${(foodCell%7===0)? 'purple' : '' }`: ''}` }>
                      <div></div>
                    </div>
                    ))}
                </div>
              ))
            }
        </div>
        <div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  </div>
        </div>
       
    </div>
  );
}
const Create_board= (BORAD_SIZE)=>{
  let counter = 1;
  let board = []
  for (let i = 0; i < BORAD_SIZE; i++) {
    let array = []
    for (let j = 0; j < BORAD_SIZE; j++) {
      array.push(counter)
      counter++;
    }
    board.push(array)
  }
  return board;
}

const GetNewDirection= (key,direction)=>{
  if(key === 'ArrowUp' && direction !== DIRECTION.DOWN ){return DIRECTION.UP}
  if(key === 'ArrowDown' && direction !== DIRECTION.UP){return DIRECTION.DOWN}
  if(key === 'ArrowLeft' && direction !== DIRECTION.RIGHT){return DIRECTION.LEFT}
  if(key === 'ArrowRight' && direction !== DIRECTION.LEFT){return DIRECTION.RIGHT}
  return ''
}

export default SnakeGame;
