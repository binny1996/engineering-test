import React, { useContext, useEffect, useState } from "react"
import { Person } from "shared/models/person"
import { RolllStateType } from "shared/models/roll"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import MainContext from "../solutions/maincontext"

interface Props {
  initialState?: RolllStateType
  size?: number
  onStateChange?: (newState: RolllStateType) => void,
  data: Person
}
export const RollStateSwitcher: React.FC<Props> = ({ initialState = "unmark", size = 40, onStateChange, data }) => {
  const [rollState, setRollState] = useState(initialState)
  const appContext = useContext(MainContext);

  const nextState = () => {
    const states: RolllStateType[] = ["present", "late", "absent"]
    if (rollState === "unmark" || rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }
  useEffect(function(){
    const states: RolllStateType[] = ["present", "late", "absent", "unmark"]
    appContext?.studentsFilter.map(function(item){
      if(item.id === data.id){
        setRollState(states[states.indexOf(item?.roll_state)]);
      }
    })
  },[])

  const onClick = () => {
    const next = nextState()
    setRollState(next)
    let allStudents = appContext?.studentsFilter
    allStudents?.map(function(item){
      if(item.id === data.id){
        item.roll_state = next
      }
    })
    appContext?.setStudentsFilter(allStudents?.slice());
    appContext?.setAllData(allStudents?.slice());

    if (onStateChange) {
      onStateChange(next)
    }
  }

  return <RollStateIcon type={rollState} size={size} onClick={onClick} />
}
