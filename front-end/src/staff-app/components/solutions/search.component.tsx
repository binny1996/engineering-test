import React, {useRef} from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { Person } from "shared/models/person"

type PropsType = {
  data: Person[] | undefined,
  setData: Function | undefined,
  allData: Person[] | undefined
}

export default function Search(props:PropsType) {
  const input = useRef<HTMLInputElement>(null);
  const btnText = useRef<HTMLSpanElement>(null);
  const btn = useRef<HTMLSpanElement>(null);

  function showSearch() {
    if(props?.setData === undefined){
      return;
    }
    let el = input.current;
    if (el !== null && el?.offsetWidth < 6) {
      el.classList.add("expand");
      btn.current?.classList.add("show");
    } else if (el !== null && el.value.trim() !== "") {
      searchData();
    } else {
      props?.setData(props.allData);
      btn.current?.classList.remove("show");
      input.current?.classList.remove("expand");
    }
  }

  function searchData() {
    if (btnText.current !== null) {
      btnText.current.innerHTML = "Searching...";
      setTimeout(function () {
        if (btnText.current !== null) {
          let q = input?.current?.value.toLowerCase() || "";
          getSearchData(q);
          btnText.current.innerHTML = "Search";
          btn.current?.classList.remove("show");
          input.current?.classList.remove("expand");
        }
      }, 500);
    }
  }

  function getSearchData(q: string) {
    if(props?.setData === undefined){
      return;
    }
    let searchArrayFN = props?.allData?.filter(x => (x.first_name+' '+x.last_name).toLowerCase().search(q)===0) || [];
    let searchArrayLN = props?.allData?.filter(x => (x.last_name+ ' '+x.first_name).toLowerCase().search(q)===0) || [];
    let matchArrayFN = props?.allData?.filter(x => x.first_name.toLowerCase().match(q)) || [];
    let matchArrayLN = props?.allData?.filter(x => x.last_name.toLowerCase().match(q)) || [];
    let output = [...searchArrayFN, ...searchArrayLN];
    if(output.length === 0){
      output = [...matchArrayFN, ...matchArrayLN];
    }
    props?.setData(output);
  }

  return (
    <>
      <SearchBtn htmlFor="search">
        <Input id="search" ref={input} placeholder="Search by name" />
        <SearchBtnWrap ref={btn} onClick={showSearch}>
          <span ref={btnText}>Search</span>
          <Icon icon={faSearch} />
        </SearchBtnWrap>
      </SearchBtn>
    </>
  );
}

const SearchBtn = styled.label`
  margin: 0px;
  background-color: white;
  border: 0px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  user-select: none;
  padding: 3px 4px;
  display:inline-block;
  color: #333;
`;
const SearchBtnWrap = styled.span`
  display: inline-block;
  padding: 7px 18px;
  margin: 0px;
  border-radius: 4px;
  border: 2px solid transparent;
  &.show {
    background-color: #eee;
    border-color: #ccc;
  }
  &:active {
    border-color: #999;
  }
`;
const Input = styled.input`
  background-color: transparent;
  border: 0px;
  outline: none;
  font-family: "Poppins", san-serif;
  font-weight: 500;
  width: 0px;
  transition: width 0.3s ease;
  opacity: 0;
  &.expand {
    padding: 7px 20px;
    width: 200px;
    max-width: 100%;
    opacity: 1;
  }
`;
const Icon = styled(FontAwesomeIcon)`
  margin-left: 10px;
`;
