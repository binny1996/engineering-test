import React, {useRef, useState } from "react"
import styled, { keyframes } from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { Person } from "shared/models/person"

type PropsType = {
  data: Person[] | undefined,
  setData: Function | undefined,
  allData: Person[] | undefined
}

export default function Sorter(props: PropsType) {
  const dropdown = useRef<HTMLUListElement>(null)
  const button = useRef<HTMLButtonElement>(null)

  const [rotation, setRotation] = useState<number>(0)
  const filterOptions = ["First Name", "Last Name", "First Name: Descending", "Last Name: Descending"]

  function toggleSortDropdown(el: HTMLUListElement) {
    if (el.offsetHeight < 6) {
      el.style.height = el.scrollHeight + "px"
      setRotation(180)
    } else {
      el.style.height = "0px"
      setRotation(0)
    }
  }

  function selectSort(ev: React.MouseEvent<Element>, btn: HTMLButtonElement) {
    const dropLI = document.querySelectorAll(".dropli")
    dropLI.forEach(function (item) {
      item.classList.remove("active")
    })
    if (dropdown?.current !== null) {
      toggleSortDropdown(dropdown?.current)
    }
    btn.innerHTML = `Sorting...`
    btn.nextElementSibling?.classList.add("none")
    if (btn.parentElement !== null) {
      btn.parentElement.classList.add("shake")
    }
    let eventCurrent = ev.currentTarget
    setTimeout(function () {
      if(props?.setData === undefined){
        return;
      }
      let output = doSort(eventCurrent)
      props?.setData(output?.slice())
      btn.nextElementSibling?.classList.remove("none")
      eventCurrent.classList.add("active")
      btn.innerHTML = `Sort by: ${eventCurrent.innerHTML}`
      if (btn.parentElement !== null) {
        btn.parentElement.classList.remove("shake")
      }
    }, 1000)
  }

  function doSort(eventCurrent: EventTarget & Element) {
    let output
    switch (eventCurrent.getAttribute("data-value")) {
      case "FirstName":
        output = props?.allData?.sort((a, b) => (a.first_name > b.first_name ? 1 : -1))
        break
      case "FirstName:Descending":
        output = props?.allData?.sort((a, b) => (a.first_name > b.first_name ? -1 : 1))
        break
      case "LastName":
        output = props?.allData?.sort((a, b) => (a.last_name > b.last_name ? 1 : -1))
        break
      case "LastName:Descending":
        output = props?.allData?.sort((a, b) => (a.last_name > b.last_name ? -1 : 1))
        break
      default:
        break
    }
    return output
  }

  return (
    <>
      <SortWrap>
        <Sort
          onClick={() => {
            if (dropdown?.current !== null) {
              toggleSortDropdown(dropdown?.current)
            }
          }}
        >
          <span ref={button}>Sort by: First Name</span>
          <Icon icon={faChevronDown} color="#555" transform={{ rotate: rotation }} />
        </Sort>
        <SortUl ref={dropdown}>
          {filterOptions.map((item, index) => {
            return (
              <SortLi
                key={index}
                data-value={item.replaceAll(" ", "")}
                onClick={(e: React.MouseEvent) => {
                  if (button.current !== null) {
                    selectSort(e, button.current)
                  }
                }}
                className={"dropli " + (index === 0 ? "active" : "")}
              >
                {item}
              </SortLi>
            )
          })}
        </SortUl>
      </SortWrap>
    </>
  )
}

const shake = keyframes`
  0% {
    transform: translateY(1.5px);
  }
  50%{
    transform: translateY(-1.5px);
  }
  100% {
    transform: translateY(1.5px);
  }
`
const Sort = styled.button`
  background-color: transparent;
  border: 0px;
  padding: 10px 20px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 270px;
  &:active {
    padding: 12px 22px;
  }
  &.shake {
    animation: ${shake} 0.3s linear infinite;
  }
  & .none {
    display: none !important;
  }
`
const SortWrap = styled.div`
  background-color: white;
  position: relative;
  border-radius: 4px;
  transition: all 0.05s linear;
  display: inline-block;
  color: #333;
`
const SortUl = styled.ul`
  margin: 0px;
  padding: 0px;
  position: absolute;
  height: 0px;
  transition: height 0.3s ease;
  top: 35px;
  left: 0px;
  right: 0px;
  box-shadow: 0px 11px 10px rgba(0, 0, 0, 0.05);
  z-index: 1;
  overflow: hidden;
  background-color: white;
  padding-top: 5px;
  border-radius: 0px 0px 4px 4px;
`
const SortLi = styled.li`
  margin: 8px;
  padding: 10px 12px;
  list-style: none;
  font-size: 13px;
  text-align: left;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    background-color: #eee;
  }
  &::before {
    content: "";
    display: inline-block;
    margin-right: 8px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  &.active::before {
    background-color: dodgerblue;
  }
`
const Icon = styled(FontAwesomeIcon)`
  margin-left: 10px;
  transition: all 0.5s ease;
`
