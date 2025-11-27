import React from "react";
import "./App.css";
import SignUp from "./pages/SignUp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/app-sidebar";
import Books from "./pages/Books";


function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/books" element={<Books />} />
          </Routes>
        </main>
      </SidebarProvider>
    </BrowserRouter>
  );
}


export default App;
