import "./App.css";

import SingleFileUploader from "./components/SingleFileUploader";
/*import MultipleFileUploader from "./components/MultipleFileUploader";*/
/*import UploadcareUploader from "./components/UploadcareUploader";*/

function App() {
  return (
    <>
      <h1>FORECASTOR</h1>

      <h2>Upload your timeseries file</h2>
      <SingleFileUploader />

    </>
  );
}

export default App;