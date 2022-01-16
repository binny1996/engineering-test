import React from "react"
import { Routes, Route } from "react-router-dom"
import "shared/helpers/load-icons"
import { Header } from "staff-app/components/header/header.component"
import { HomeBoardPage } from "staff-app/daily-care/home-board.page"
import { ActivityPage } from "staff-app/platform/activity.page"
import MainContext from "./components/solutions/maincontext"

type GlobalContext = {
  studentsFilter: Array<{ id: number, first_name: string; last_name: string, roll_state:string }>,
  setStudentsFilter: Function
};

function App() {
  const [studentsFilter, setStudentsFilter] = React.useState([]);
  const [allData, setAllData] = React.useState([]);

  const context = {
    studentsFilter: studentsFilter,
    setStudentsFilter: setStudentsFilter,
    allData: allData,
    setAllData: setAllData
  };
  return (
    <>
      <MainContext.Provider value={context}>
        <Header />
        <Routes>
          <Route path="daily-care" element={<HomeBoardPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="*" element={<div>No Match</div>} />
        </Routes>
      </MainContext.Provider>
    </>
  )
}

export default App
