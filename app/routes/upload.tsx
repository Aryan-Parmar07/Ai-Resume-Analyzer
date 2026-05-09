import { type FormEvent, useState } from "react";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
const upload = () => {
  const [isProcessing, setIsProcessing] = useState();
  const [statusText, setStatusText] = useState();
  const [file,setFile] = useState<File| null>(null);

  const handleFileSelect = (file: File| null)=>{
    setFile(file)
  }
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => { 
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if(!form) return;
    const fromdata = new FormData(form);

    const companyName =fromdata.get('company-name');
    const jobTitle =fromdata.get('job-title');
    const jobDescritption =fromdata.get('job-description');

    console.log( {
      companyName , jobTitle, jobDescritption , file
    })
  };
  return (
    <main className="bg-[url('images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading">
          <h1> Smart Feedback for your dream Job </h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" className="w-full" />
            </>
          ) : (
            <h2> Drop Your Resume for an ATS score and improvement tips</h2>
          )}
          {!isProcessing && (
            <form
              id="upload-from"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 "
            >
              <div className="form-div">
                <label htmlFor="company Name"></label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Company Name"
                  id="company-name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="Job-Title"></label>
                <input
                  type="text"
                  name="Job Title"
                  placeholder="Job Title"
                  id="Job-Title"
                />
              </div>
              <div className="form-div">
                <label htmlFor="Job-Description"></label>
                <textarea rows={5}
                  name="Job Description"
                  placeholder="Job Description"
                  id="Job-Description"
                />
              </div>
              <div className="form-div">
                <label htmlFor="Uploader"> Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
              <button className="primary-button" type="submit"> Analyze Resume </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default upload;
