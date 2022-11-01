import React, { FunctionComponent, useState } from "react"
import { SchoolClass, SchoolClassContextType } from "./types"
import NewSchoolClass from "./NewSchoolClass"
import SchoolClassList from "./SchoolClassList"

type SchoolClassesProps = {}

const SchoolClassContext = React.createContext<SchoolClassContextType>(null!)

export const useSchoolClassContext = () => React.useContext(SchoolClassContext)

const SchoolClasses: FunctionComponent<SchoolClassesProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const [schoolClasses, setSchoolClasses] = useState<SchoolClass[]>()

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const updateSchoolClasses = () => {}

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return (
    <SchoolClassContext.Provider value={{ schoolClasses, updateSchoolClasses }}>
      <div className="display-4">Klassen</div>
      <NewSchoolClass />
      <SchoolClassList />
    </SchoolClassContext.Provider>
  )
}

export default SchoolClasses
