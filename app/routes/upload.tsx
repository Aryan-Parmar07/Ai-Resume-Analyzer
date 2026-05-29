import { stringify } from "querystring";
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdftoimage";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";
const upload = () => {
  const { auth , isLoading , fs , ai ,kv}  = usePuterStore()

  const navigate = useNavigate
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [file,setFile] = useState<File| null>(null);

  const handleFileSelect = (file: File| null)=>{
    setFile(file)
  }
const handleAnalyze = async (
  {
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }
) => {
    setIsProcessing(true);
    setStatusText('Uploading the file ....');

    const uploadedFile = await fs.upload([file])

    if(!uploadedFile) return setStatusText('faield to Upload file ');
    setStatusText('Converting to image...')
    const imagefile = await convertPdfToImage(file);

    if(!imagefile.file) return setStatusText('Failed to convert Pdf to Image');

    setStatusText('Uploading the image ....');

    const uploadedImage = await fs.upload([imagefile.file]);

    if(!uploadedImage) return setStatusText('failed to upload Image ')

    setStatusText('Preparing Data...')

    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback : '',
    }
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText('Analyzing....')

    const feedback = await ai.feedback(
      uploadedFile.path,
      `You are an expert in ATS(applicant Tracking system) and resume analysis....`
    )


};
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => { 
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if(!form) return;
    const fromdata = new FormData(form);

    const companyName =fromdata.get('company-name') as string;
    const jobTitle =fromdata.get('job-title') as string;
    const jobDescription =fromdata.get('job-description') as string;

    if(!file) return ;
    
    handleAnalyze({ companyName, jobTitle,jobDescription,file})


    console.log( {
      companyName , jobTitle, jobDescription , file
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
