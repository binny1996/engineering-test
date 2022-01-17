import React, { useState, useEffect, useRef, Ref, useContext } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import Sorter from "staff-app/components/solutions/sorter.component"
import Search from "staff-app/components/solutions/search.component"
import MainContext from "staff-app/components/solutions/maincontext"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [saveRoll, rollData, rollLoadState] = useApi<{}>({ url: "save-roll" })
  const [activities, actData, actLoad] = useApi<{}>({ url: "get-activities" })
  // const [theStudents, setTheStudents] = useState<Person[]>();
  const appContext = useContext(MainContext)

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(
    function () {
      // setTheStudents(data?.students);
      let dataWithRolls =
        data?.students.map(function (item) {
          item.roll_state = "unmark"
          return item
        }) || []
      appContext?.setStudentsFilter(dataWithRolls.slice())
      appContext?.setAllData(dataWithRolls.slice())
      // let student_roll_states:Array<object> = []
      // dataWithRolls.map(function(item){
      //   student_roll_states.push({
      //     student_id: item.id,
      //     roll_state: item.roll_state
      // })
      // })
      // saveRoll({student_roll_states})
    },
    [loadState]
  )

  useEffect(function(){
    console.log(rollData);
    activities()
  },[rollLoadState])

  useEffect(function(){
    console.log(actData);
  },[actLoad])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "complete") {
      let student_roll_states: Array<object> = []
      appContext?.allData.map(function (item) {
        student_roll_states.push({
          student_id: item.id,
          roll_state: item.roll_state,
        })
      })
      saveRoll({ student_roll_states })
    }
    setIsRollMode(false)
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} allData={appContext?.allData} data={appContext?.studentsFilter} setData={appContext?.setStudentsFilter} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && data?.students && (
          <>
            {appContext?.studentsFilter?.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  data: Person[] | undefined
  setData: Function | undefined
  allData: Person[] | undefined
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick } = props
  return (
    <S.ToolbarContainer>
      {/* <div onClick={() => onItemClick("sort")}>First Name</div> */}
      <Sorter allData={props?.allData} data={props.data} setData={props.setData} />
      {/* <div>Search</div> */}
      <Search allData={props?.allData} data={props.data} setData={props.setData} />
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
