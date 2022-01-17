import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { RollStateList } from "staff-app/components/roll-state/roll-state-list.component"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const ActivityPage: React.FC = () => {
  const [activities, actData, actLoad] = useApi<{
    activity: Array<{ date: string; entity: { name: string; id: number; student_roll_states: Array<{ roll_state: string; id: number }> } }>
  }>({ url: "get-activities" })
  const graphLines = [
    { type: "present", color: "orange", width: "50%", borders: "50px 0px 0px 50px" },
    { type: "absent", color: "green", width: "10%", borders: "0px 0px 0px 0px" },
    { type: "late", color: "grey", width: "10%", borders: "0px 0px 0px 0px" },
    { type: "unmark", color: "#eee", width: "10%", borders: "0px 50px 50px 0px" },
  ]
  const [graphData, setGraphData] = useState<Array<{ roll_state: string; id: number }>>()

  useEffect(function () {
    activities()
  }, [])

  useEffect(
    function () {
      setGraphData(actData?.activity[0].entity.student_roll_states)
    },
    [actLoad]
  )

  function setGraph(index: number) {
    setGraphData(actData?.activity[index].entity.student_roll_states)
  }

  return (
    <>
      <S.Container>
        <h1>Activity Page</h1>
        <h4>Rolls: Line Graph</h4>
        <S.Graph>
          {graphLines.map(function (item, index) {
            if (graphData === undefined) {
              return
            }
            return (
              <S.Graphline
                key={index}
                color={item.color}
                lineLength={(graphData.filter((x) => x.roll_state === item.type).length / graphData.length) * 100 + "%"}
                borders={item.borders}
              />
            )
          })}
        </S.Graph>
        <h4>List of Activities</h4>
        {actLoad === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}
        {actLoad === "loaded" &&
          actData?.activity.map((item, index) => (
            <S.List htmlFor={"acts" + index} key={index}>
              <S.Input
                id={"acts" + index}
                type="radio"
                name="acts"
                value={index}
                onChange={() => {
                  setGraph(index)
                }}
                defaultChecked={index === 0 ? true : false}
              />
              <S.Wrap>
                <S.Rolldetails>
                  <span>
                    Roll Name: <S.Rollspan>{item?.entity.name}</S.Rollspan>
                  </span>
                  <span>
                    Date: <S.Rollspan>{item?.date.split("T")[0].split("-").reverse().join("/")}</S.Rollspan>
                  </span>
                </S.Rolldetails>
                <RollStateList
                  isClick={false}
                  stateList={[
                    { type: "all", count: item?.entity.student_roll_states.length || 0 },
                    { type: "present", count: item?.entity.student_roll_states.filter((x) => x.roll_state === "present").length || 0 },
                    { type: "late", count: item?.entity.student_roll_states.filter((x) => x.roll_state === "late").length || 0 },
                    { type: "absent", count: item?.entity.student_roll_states.filter((x) => x.roll_state === "absent").length || 0 },
                  ]}
                />
              </S.Wrap>
            </S.List>
          ))}
      </S.Container>
    </>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
  List: styled.label`
    padding: 20px;
    font-size: 14px;
    color: #333;
    border-radius: 8px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
  `,
  Graph: styled.div`
    padding: 20px;
    font-size: 14px;
    color: #333;
    border-radius: 8px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
  `,
  Graphline: styled.div<PropsType>`
    flex-grow: 1;
    background-color: ${(props) => props.color};
    width: ${(props) => props.lineLength};
    height: 4px;
    border-radius: ${(props) => props.borders};
    transition: all 0.5s ease;
  `,
  Rolldetails: styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  `,
  Rollspan: styled.span`
    font-weight: 500;
  `,
  Wrap: styled.div`
    width: 100%;
  `,
  Input: styled.input`
    margin-right: 10px;
  `,
}

type PropsType = {
  color: string
  lineLength: string
  borders: string
}
