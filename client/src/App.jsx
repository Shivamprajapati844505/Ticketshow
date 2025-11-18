import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from './pages/SeatLayout';
import MyBookings from './pages/MyBookings';
import Favorite from './pages/Favorite';
import {Toaster} from 'react-hot-toast'
import Footer from './components/Footer';
import Layout from './pages/Admin/Layout';
import AddShows from './pages/Admin/AddShows';
import ListShows from './pages/Admin/ListShows';
import ListBookings from './pages/Admin/ListBookings';
import Dashboard from './pages/Admin/Dashboard';
import { useAppContext } from './context/AppContext';
import { SignIn } from "@clerk/clerk-react";
import Loading from './components/Loading';
import UpcomingMovies from './pages/UpcomingMovies';
import ReleaseMovies from './pages/ReleaseMovies'



const App = () => {

  <Toaster/>
  const isAdminRoute = useLocation().pathname.startsWith('/admin')
  const {user}  = useAppContext()
  return (
    <>
      { !isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout/>}/>
        <Route path="/my-bookings" element={<MyBookings/>}/>
        <Route path="/loading/:nextUrl" element={<Loading/>}/>

        <Route path="/favorite" element={<Favorite/>}/>
        <Route path="/releases" element={<ReleaseMovies/>}/>
        <Route path="/upcoming" element={<UpcomingMovies/>} />
        <Route path="/admin/*" element={user ?<Layout/> :(
          <div className='min-h-screen flex justify-center items-center'>
            <SignIn fallbackRedirectUrl = {'/admin'}/>
          </div>
        )}>
          <Route index element={<Dashboard/>}/>
          <Route path="add-shows" element={<AddShows/>}/>
          <Route path="list-shows" element={<ListShows/>}/>
          <Route path="list-bookings" element={<ListBookings/>}/>
        </Route>
      </Routes>
     { !isAdminRoute && <Footer/>}
    </>
  );
};

export default App;
