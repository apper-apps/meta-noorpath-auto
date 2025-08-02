import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import HomePage from "@/components/pages/HomePage"
import TrackPage from "@/components/pages/TrackPage"
import TasksPage from "@/components/pages/TasksPage"
import PartnersPage from "@/components/pages/PartnersPage"
import ProgressPage from "@/components/pages/ProgressPage"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-body islamic-pattern">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="track" element={<TrackPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="partners" element={<PartnersPage />} />
            <Route path="progress" element={<ProgressPage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  )
}

export default App