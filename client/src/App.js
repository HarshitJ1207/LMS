import React, { useEffect, useState, useContext } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Home from './pages/member/Home';
import Books from './pages/member/Books';
import Login from './pages/member/Login';
import Signup from './pages/member/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBooks from './pages/admin/AdminBooks';
import AdminBookDetail from './pages/admin/AdminBookDetail';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import PrivateRoute from './components/PrivateRoute';
import Signout from './components/Signout';
import AdminBookIssue from './pages/admin/AdminBookIssue';
import AdminBookReturn from './pages/admin/AdminBookReturn';
import Test from './pages/Test';
import { AuthContext } from './context/AuthContext'; 
import LoadingComponent from './components/extras/LoadingComponent';
import NavigationBar from './components/NavigationBar';
import AdminAddBook from './pages/admin/AdminAddBook';
import AdminRemoveBook from './pages/admin/AdminRemoveBook';
import AdminAddUser from './pages/admin/AdminAddUser';
import AdminRemoveUser from './pages/admin/AdminRemoveUser';
import Me from './pages/member/Me';
import PageNotFound from './pages/PageNotFound'; // Import the PageNotFound component

function App() {
    const { login } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    console.log(process.env.REACT_APP_API_BASE_URL);
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/loginStatus`, {
                    credentials: 'include',
                });
                if (!res.ok) {
                    login(false);
                    setLoading(false);
                    return;
                }
                const data = await res.json();
                if (data) login(data.userType);
                console.log(data);
            }
            catch (error) {
                login(false);
            }
            finally {
                setLoading(false);
            }
        };
        checkLoginStatus();
    }, [login]);

    if (loading) {
        return <LoadingComponent/>;
    }
    return (
        <React.Fragment>
            <Router>
                <NavigationBar/>
                <Routes>
                    <Route path="/Test" element={<Test />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/me" element={<Me />} />
                    <Route path="/books" element={<Books />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signout" element={<Signout />} />
                    <Route path="/admin/" element={<PrivateRoute element={AdminDashboard} />} />
                    <Route path="/admin/books" element={<PrivateRoute element={AdminBooks} />} />
                    <Route path="/admin/book/:id" element={<PrivateRoute element={AdminBookDetail} />} />
                    <Route path="/admin/users" element={<PrivateRoute element={AdminUsers} />} />
                    <Route path="/admin/user/:id" element={<PrivateRoute element={AdminUserDetail} />} />
                    <Route path="/admin/bookIssue" element={<PrivateRoute element={AdminBookIssue} />} />
                    <Route path="/admin/bookReturn" element={<PrivateRoute element={AdminBookReturn} />} />
                    <Route path="/admin/addBook" element={<PrivateRoute element={AdminAddBook} />} />
                    <Route path="/admin/removeBook" element={<PrivateRoute element={AdminRemoveBook} />} />
                    <Route path="/admin/addUser" element={<PrivateRoute element={AdminAddUser} />} />
                    <Route path="/admin/removeUser" element={<PrivateRoute element={AdminRemoveUser} />} />
                    <Route path="*" element={<PageNotFound />} /> {/* Catch-all route for unrecognized URLs */}
                </Routes>
            </Router>
        </React.Fragment>
    );
}

export default App;