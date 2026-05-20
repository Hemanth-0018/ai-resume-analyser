import type { Route } from "./+types/home";
import NavBar from "../components/Navbar"
import {resumes} from "../constants/index"
import ResumeCard from "../components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate ,Link } from "react-router";
import { useEffect,useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Feedback" },
    { name: "description", content: "Smart feedback for your resume" },
  ];
}

export default function Home() {
    const [resumes,setResumes]=useState<Resume[]>([]);
    const [loadingResumes,setLoadingResumes]=useState(false)
  const {auth,kv}=usePuterStore();
    const navigate=useNavigate();
    useEffect(()=>{
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    },[auth.isAuthenticated])

     useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
          JSON.parse(resume.value) as Resume
      ))

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes()
  }, []);

  return (
  <main className="bg-[url('/images/bg-main.svg')] bg-cover ">
    <NavBar/>
    
    <section className="main-section">
      
      <div className="page-heading py-16">
        <h1>
          Track your resume feedback in one place
        </h1>
        {!loadingResumes && resumes?.length===0?(
        <h2>
          No resumes found.Upload your first resume to get feedback.
        </h2>):(
          <h2>Smart feedback for yout resume</h2>
        )}
      </div>
      {!loadingResumes &&resumes.length>0 &&(
      <div className="resumes-section">
      {
        resumes.map((resume)=>(          
        // <div>
        //     <h1>{resume.jobTitle}</h1>
        //   </div>
          
        <ResumeCard key={resume.id} resume={resume}/>
        ))
      }
    </div>)}
    {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
      )}
    </section>
    
  </main>)
}
