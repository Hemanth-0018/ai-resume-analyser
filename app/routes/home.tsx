import type { Route } from "./+types/home";
import NavBar from "../components/navbar"
import {resumes} from "../constants/index"
import ResumeCard from "../components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect } from "react";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Feedback" },
    { name: "description", content: "Smart feedback for your resume" },
  ];
}

export default function Home() {
  
  const {auth}=usePuterStore();
    const navigate=useNavigate();
    useEffect(()=>{
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    },[auth.isAuthenticated])

  return (
  <main className="bg-[url('/images/bg-main.svg')] bg-cover ">
    <NavBar/>
    
    <section className="main-section">
      
      <div className="page-heading py-16">
        <h1>
          Track your resume feedback in one place
        </h1>
        <h2>
          Smart feedback for yout resume
        </h2>
      </div>
      {resumes.length>0 &&(
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
    </section>
    
  </main>)
}
