import axios from "axios";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/fileupload.scss";
import 'bootstrap/dist/css/bootstrap.min.css';


// import "../styles/toggle.scss";

const FileUpload = () => {
  const [category, setCategory] = useState("MRI");
  const [image, setImage] = useState(null);
  const [patientName, setpatientName] = useState("");

  const [loading, setLoading] = useState(false);
  const submitImage = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("patientName", patientName);
    formData.append("category", category);
    console.log(formData);
    setpatientName("");

    setImage(null);
    try {
      const response = await axios.post(
        "http://localhost:4000/image/uploadimage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Data uploaded successfully");
      const gotresponse = response.data;
      console.log("Response from server:", response.data);
    } catch (error) {
      toast.error("Error uploading data");
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = (e) => {
    console.log(e);
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
  };
  const updatePatientName = (e) => {
    const input = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(); // Allow only letters and numbers
    setpatientName(input);
    console.log(e);
    console.log(e.target.value);
  };
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };
  return (
    <div>
      <div className="fileupload" >
        <div className="card">
          <form onSubmit={submitImage}>
            <div class="form-floating">
              <select
                value={category}
                onChange={handleCategoryChange}
                class="form-select"
                id="floatingSelect"
                aria-label="Floating label select example"
              >
                <option value="MRI">MRI</option>
                <option value="X-RAY">X-RAY</option>
              </select>
              <label for="floatingSelect">Medical Imaging Type</label>
            </div>
            <div className="form-floating">
              <input
                maxLength="12"
                type="text"
                class="form-control"
                id="floatingInputregisno"
                value={patientName}
                onChange={updatePatientName}
              />
              <label htmlFor="floatingInputregisno">Patient Name</label>
            </div>
            <div>
              <div>
                <label htmlFor="input-file" className="upload">
                  Upload image
                </label>
              </div>
              <div className="selected-file-box">
                {image && <span>{image.name}</span>}
              </div>
              <input
                type="file"
                id="input-file"
                accept="image/*"
                onChange={uploadImage}
              />
            </div>
            <div>
              {loading ? (
                <p>loading...</p>
              ) : (
                image &&
                category &&
                patientName && (
                  <div>
                    <button type="submit" className="btn btn-success">
                      submit
                    </button>
                  </div>
                )
              )}
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FileUpload;
