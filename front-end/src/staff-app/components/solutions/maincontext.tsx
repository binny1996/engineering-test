import { createContext } from "react";

type GlobalContext = {
  studentsFilter: Array<{ id: number, first_name: string; last_name: string, roll_state: string }>,
  setStudentsFilter: Function
};

const MainContext = createContext<GlobalContext | null>(null);

export default MainContext;
