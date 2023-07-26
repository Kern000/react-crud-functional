import React, {useState, useCallback, useEffect, useMemo} from 'react';
import "bootstrap/dist/css/bootstrap.min.css"

export default function CRUD (){

  let [toDos, setToDos] = useState([])
  let [newToDoName, setNewToDoName] = useState('')
  let [filter, setFilter] = useState('all')

  const addNew = useCallback(()=>{
    setToDos(
      [...toDos,
      { _id: Math.floor(Math.random()*10000),
        name: newToDoName,
        done: false
      }]
    )}, 
    [toDos, newToDoName]
  )

  const toggleToDo = useCallback((taskIndex)=> {
      const clonedTask = {...toDos[taskIndex]};
      clonedTask.done = !clonedTask.done;
      setToDos(
        [...toDos.slice(0, taskIndex),clonedTask,...toDos.slice(taskIndex+1)]
      )
    },
    [toDos]
  )

 
  useEffect(()=>{
    //assume JSON format, when saving toDos later, will put into localStorage
    //on first render only, will retrieve the toDos saved in the localStorage
    const storedToDos=JSON.parse(localStorage.getItem('toDos'));
    setToDos(storedToDos || []);
  },[])

  const saveToDo = useCallback(()=>{
      //setItem(key, value)
      localStorage.setItem('toDos', JSON.stringify(toDos))
    },
    [toDos]
  )

  const selectFilter = useCallback((event)=>{
    setFilter(event.target.value);
  },
  []
  )

  let filterToDos = useMemo(()=>{
      //useMemo is a hook that allows you to memorize the result of a function call and avoid unnecessary recalculations. It is used to optimize the performance of functional components by caching expensive computations and reusing their results between renders
      let results;
      if (filter === "all"){
        results=toDos;
      } else if (filter === "completed"){
        results= toDos.filter(task => task.done)
      } else if (filter === "incomplete"){
        results = toDos.filter(task => !task.done)
      }
      return results || []
    },
    [toDos, filter]
  )

  return(
    <React.Fragment>
      <div className="container-fluid">
        <h1> My Todo list </h1>
        <div className="ms-2 mb-2">
          <input  type="text"
                  className="form-control"
                  value={newToDoName}
                  onChange={(event)=>{setNewToDoName(event.target.value)}}
          />
          <button className="btn btn-danger mt-2 mb-2"
                  onClick={addNew}
          >
            Add New Task
          </button>
        </div>
        <div>
          <button className="btn btn-primary ms-2 mb-2"
                  onClick={saveToDo}
          >
            save to local
          </button>
        </div>
        <div>
          <h2> Filter Tasks </h2>
          <div className="form-check form-check-inline">
            <input  className="form-check-input"
                    type="radio"
                    name="filterOptions"
                    value="all"
                    onClick={selectFilter}
                    checked={filter==="all"}
            />
            <label  className="form-check-label ms-1"> 
              All 
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input  className="form-check-input"
                    type="radio"
                    name="filterOptions"
                    value="completed"
                    onClick={selectFilter}
                    checked={filter==="completed"}
            />
            <label  className="form-check-label ms-1"> 
              Completed 
            </label>
          </div>
            <div className="form-check form-check-inline">
            <input  className="form-check-input"
                    type="radio"
                    name="filterOptions"
                    value="incomplete"
                    onClick={selectFilter}
                    checked={filter==="incomplete"}
            />
            <label  className="form-check-label ms-1"> 
              incomplete 
            </label>
          </div>
          
          <div>
            <ul className="list-group">
              {filterToDos.map((task, taskIndex) =>
                  <li className="list-group-item">
                    {task.name}
                    <input  type="checkbox"
                            checked={task.done}
                            className="ms-2 form-check-inline"
                            onChange={()=> toggleToDo(taskIndex)}
                    />
                  </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}






