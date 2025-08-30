import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import NotificationPage from './pages/NotificationPage'
import CallPage from './pages/CallPage'
import ChatPage from './pages/ChatPage'
import { Toaster } from 'react-hot-toast'
import PageLoader from './components/PageLoader'
import useAuthUser from './hooks/useAuthUser'
import OnBoardingPage from './pages/OnBoardingPage'
import Layout from './components/Layout'
import { useThemeStore } from './store/useThemeStore'

const App = () => {

  // Tanstack 
  // for delete put & post we will use mutation 
  // for get we will use Query 
  const {theme} = useThemeStore();

  const {isLoading,authUser} = useAuthUser();
// console.log("User bhadva ",authUser)
  const isAuthenticated = Boolean(authUser);
  // console.log("Pehle check onboard",authUser?.data?.isOnboarded)
  const isOnboarded = authUser?.data?.isOnboarded;
  // console.log("Kya scene ",authData.user)

  if (isLoading) return <PageLoader/>
  // console.log({data})
  // console.log({isLoading})
  // console.log({error})

  // To fetch simple api we have to write a long code ,
  // -> Instead we can use tanstack , below is the usual code for api fetching 
  // const [data,setData] = useState({});
  // const [loading,setLoading] = useState(false);
  // const [error,setError] = useState(null);

  // useEffect(()=>{
  //   const getData = async ()=>{
  //     setLoading(true)

  //     try {
  //       const data = await fetch('https://jsonplaceholder.typicode.com/todos')
  //       const json = await data.json()
  //       setData(json)
  //     } catch (error) {
  //       setError(error)
  //     }finally{
  //       setLoading(false)
  //     }
  //   }
  //   getData()
  // },[])

  // console.log(data)



    // {data,isLoading, error} = useQuery("")
  return <>
  <div className='h-screen' data-theme={theme}>
    <Routes>
        <Route path='/' element={isAuthenticated&& isOnboarded ?(
          <Layout showSidebar={true}>
            <HomePage/>
          </Layout>
          ): <Navigate to={!isAuthenticated?"/login": "/onboarding" }/>} />
        <Route path='/signup' element={!isAuthenticated?<SignUpPage/>: <Navigate to="/"/>} />
        <Route path='/login' element={!isAuthenticated?<LoginPage/>: <Navigate to ={isOnboarded?"/":"/onboarding"} />} />
        {/* <Route path='/login' element={<LoginPage/>} /> */}
        <Route path='/notifications' element={isAuthenticated && isOnboarded ?(
          <Layout showSidebar={true}>

            <NotificationPage/>
          </Layout>
      ): <Navigate to={!isAuthenticated?"/login":"/onboarding"} />} />
        <Route path='/call/:id' element={isAuthenticated && isOnboarded?
          <CallPage/>
        
        : <Navigate to={isAuthenticated?"/login":"onboarding" }/>} />

        <Route path='/chat/:id' element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route path='/onboarding' element={isAuthenticated?!isOnboarded?<OnBoardingPage/>:<Navigate to ="/"/>: <Navigate to="/login" />} />
    </Routes>
  <Toaster />
  </div>
  </>
}

export default App