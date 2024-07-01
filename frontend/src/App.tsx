import { Route, Routes } from "react-router-dom"

import './App.css'
import {Header} from "./component/Header.tsx";
import {Login} from "./component/Login.tsx";

function App() {

  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" />
        <Route path="*" element={<p>Not found</p>} />
      </Routes>
    </>
  )
}

export default App
