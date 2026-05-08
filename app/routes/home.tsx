import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect } from "react";
// import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResAnalyze" },
    { name: "description", content: "Get your dream job in a smart way!" },
  ];
}

export default function Home() {
    const { isLoading, auth } = usePuterStore()
    const navigate = useNavigate()
    
    useEffect(()=>{
        if(!auth.isAuthenticated) navigate('/auth?next=/')
    },[auth.isAuthenticated])
  return (
    <main className="bg-[url('images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading" py-16>
          <h1> Track Your Applications & Resume Ratings </h1>
          <h2>Review your submissions and check AI-powered feedback.</h2>
        </div>

        {resumes.length > 0 && (
          <div className="resumes-seciton">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
