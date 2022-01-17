import React, { useContext } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { Spacing, FontWeight } from "shared/styles/styles"
import { RolllStateType } from "shared/models/roll"
import MainContext from "../solutions/maincontext"

interface Props {
  stateList: StateList[]
  size?: number
  isClick?: boolean
}
export const RollStateList: React.FC<Props> = ({ stateList, size = 14, isClick = true }) => {
  const appContext = useContext(MainContext)

  function setStateFilter(type: string) {
    if (isClick === false) {
      return
    }
    let filter
    switch (type) {
      case "all":
        filter = appContext?.allData
        break
      default:
        filter = appContext?.allData.filter((x) => x.roll_state === type)
        break
    }
    appContext?.setStudentsFilter(filter?.slice())
  }

  return (
    <S.ListContainer>
      {stateList.map((s, i) => {
        if (s.type === "all") {
          return (
            <S.ListItem key={i}>
              <FontAwesomeIcon icon="users" size="sm" style={{ cursor: "pointer" }} onClick={() => setStateFilter(s.type)} />
              <span>{s.count}</span>
            </S.ListItem>
          )
        }

        return (
          <S.ListItem key={i}>
            <RollStateIcon type={s.type} size={size} onClick={() => setStateFilter(s.type)} />
            <span>{s.count}</span>
          </S.ListItem>
        )
      })}
    </S.ListContainer>
  )
}

const S = {
  ListContainer: styled.div`
    display: flex;
    align-items: center;
  `,
  ListItem: styled.div`
    display: flex;
    align-items: center;
    margin-right: ${Spacing.u2};

    span {
      font-weight: ${FontWeight.strong};
      margin-left: ${Spacing.u2};
    }
  `,
}

interface StateList {
  type: ItemType
  count: number
}

type ItemType = RolllStateType | "all"
