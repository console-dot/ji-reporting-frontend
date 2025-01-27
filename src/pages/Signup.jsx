import { useContext, useEffect, useState } from "react";
import instance from "../api/instrance";
import { useToastState } from "../context";
import { Loader } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { UIContext } from "../context/ui";
import { FaEye, FaEyeSlash } from "react-icons/fa";
export const Signup = () => {
  const [userAreaType, setUserAreaType] = useState("");
  const [areas, setAreas] = useState([]);
  const [district, setDistrict] = useState([]);
  const [searchArea, setSearchArea] = useState("");
  const { loading, setLoading } = useContext(UIContext);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subject, setSubject] = useState();
  const [showPass, setShowPass] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [maqams, setMaqams] = useState([]);
  const [joiningDate, setJoiningDate] = useState({ title: "", date: "" });
  const { dispatch } = useToastState();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleClick = () => {
    window.open("https://consoledot.com", "_blank");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      userAreaId: formData.get("userAreaId"),
      userAreaType: formData.get("userAreaType"),
      email: formData.get("email"),
      password1: formData.get("password1"),
      password2: formData.get("password2"),
      name: formData.get("name"),
      age: formData.get("age"),
      nazim: formData.get("userAreaType")?.toLowerCase(),
      fatherName: formData.get("fatherName"),
      dob: formData.get("dob"),
      address: formData.get("address"),
      qualification: formData.get("qualification"),
      subject: formData.get("subject"),
      semester: formData.get("semester"),
      institution: formData.get("institution"),
      joiningDate: joiningDate,
      phoneNumber: formData.get("phoneNumber"),
      whatsAppNumber: formData.get("whatsAppNumber"),
      nazimType: formData.get("nazimType"),
    };

    // Validation: Check for empty fields
    const missingFields = Object.entries(data)
      .filter(([key, value]) => !value) // Find fields with falsy values
      .map(([key]) => key); // Extract field names

    if (missingFields.length > 0) {
      alert(`Please fill in the following fields: ${missingFields.join(", ")}`);
      setLoading(false);
      return;
    }
    try {
      const request = await instance.post("/user/signup", data, {
        headers: { "Content-Type": "application/json" },
      });
      dispatch({ type: "SUCCESS", payload: request.data?.message });
      e.target.reset();
      navigate("/login");
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.response.data.message });
    }
    setLoading(false);
  };

  // FETCH ALL SUBJECTS

  const getSubjects = async () => {
    try {
      const request = await instance.get("/subjects", {
        headers: { "Content-Type": "application/json" },
      });
      if (request.status === 200) {
        setSubjects([...request.data.data]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubjectChange = (e) => {
    const value = e.target.value;
    setSelectedSubject(value);
  };
  // ADD NEW SUBJECT CALL
  const addNewSubjectCall = async () => {
    document.getElementById("subject").setAttribute("disabled", true);
    try {
      const request = await instance.post("/subjects", {
        headers: { "Content-Type": "application/json" },
        title: subject,
      });

      if (request.status === 201) {
        await getSubjects();
        document.getElementById("subject").removeAttribute("disabled");
      }
    } catch (error) {
      console.log(error);
      document.getElementById("subject").removeAttribute("disabled");
    }
  };
  useEffect(() => {
    getSubjects();
  }, []);
  const getAreas = async () => {
    let data;
    let data1;
    switch (userAreaType) {
      case "Province":
        setLoading(true);
        data = await instance.get("/locations/province");
        setLoading(false);
        setAreas(data.data.data);
        break;
      case "Division":
        setLoading(true);
        data = await instance.get("/locations/division");
        setLoading(false);
        setAreas(data.data.data);
        break;
      case "Maqam":
        setLoading(true);
        data = await instance.get("/locations/maqam");
        setLoading(false);
        setAreas(data.data.data);
        break;
      case "Halqa":
        setLoading(true);
        data = await instance.get("/locations/halqa");
        data1 = await instance.get("/locations/district");
        let data2 = await instance.get("/locations/maqam");
        setLoading(false);
        setDistrict(data1.data.data);
        setAreas(data.data.data);
        setMaqams(data2.data.data);
        break;
      case "Ilaqa":
        setLoading(true);
        data = await instance.get("/locations/ilaqa");
        setLoading(false);
        setAreas(data.data.data);
        break;
      case "Markaz":
        setLoading(true);
        data = await instance.get("/locations/country");
        setLoading(false);
        setAreas(data.data.data);
        break;
      default:
        break;
    }
  };
  const getDivName = (area, type) => {
    if (type === "tehsil") {
      let div = district?.find((i) => area?.parentId?.district === i._id);
      return `-${div?.division.name}(Division) - ${div?.division?.province?.name}(Province)`;
    } else if (type === "Ilaqa") {
      let maqam = maqams?.find((i) => area?.parentId?.maqam === i._id);
      if (maqam && Object.keys(maqam).length > 0) {
        return `- ${maqam?.name}(Maqam) -${maqam?.province?.name}(Province)`;
      }
    }
  };
  const nonNumaricCal = (e) => {
    // Allow backspace and delete keys for erasing
    if (e.key === "Backspace" || e.key === "Delete") {
      return;
    }

    if (!/^[0-9]$/.test(e.key)) {
      setMessage("No alphabets or special characters are allowed.");
      e.preventDefault();
    } else {
      setMessage("");
    }
  };
  useEffect(() => {
    getAreas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAreaType]);
  const handleEventClick = (e) => {
    if (e?.target?.id !== "autocomplete") {
      if (
        !document
          ?.getElementById("autocomplete-list")
          ?.classList?.contains("hidden")
      ) {
        document?.getElementById("autocomplete-list")?.classList?.add("hidden");
      }
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleEventClick);
    return () => {
      document.removeEventListener("click", handleEventClick);
    };
  }, []);
  useEffect(() => {
    console.log(areas);
  }, [areas]);
  return (
    <div className="relative flex  justify-center min-h-screen overflow-hidden w-full">
      <div className=" w-[40%] bg-secondary min-h-screen p-[40px] md:flex md:flex-col md:justify-between  hidden">
        <div></div>
        <div className="flex flex-col gap-4 fixed bottom-5 left-2">
          <h2 class="text-white font-inter text-2xl font-bold leading-7 text-left">
            Welcome to IJT Reporting
          </h2>
        </div>
      </div>
      <div className="w-full md:p-6 p-2 m-auto">
        <div className="w-full flex flex-col items-center justify-center gap-2">
          <img src="/logo.png" className="h-[104px] w-[142px]" alt="LOGO" />
          <h1 className="text-heading text-[20px] leading-7 font-semibold font-inter">
            Create a new account
          </h1>
        </div>
        <form
          className="space-y-4 bg-white rounded-md shadow-md p-4 w-full"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="w-full">
              <label className="label">
                <span className="text-heading font-inter text-[14px] leading-5">
                  Full Name
                </span>
              </label>
              <input
                type="text"
                placeholder="Full Name"
                name="name"
                className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
                required
              />
            </div>
            <div className="w-full">
              <label className="label">
                <span className="text-heading font-inter text-[14px] leading-5">
                  Father Name
                </span>
              </label>
              <input
                type="text"
                placeholder="Father name"
                name="fatherName"
                className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
                required
              />
            </div>
          </div>
          <div className="flex md:flex-row flex-col items-center justify-between gap-4">
            <div className="w-full">
              <label className="label">
                <span className="text-heading font-inter text-[14px] leading-5">
                  Date of birth
                </span>
              </label>
              <input
                type="month"
                placeholder="Date of birth"
                name="dob"
                min="1947-01"
                className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter min-w-[230px]"
                required
              />
            </div>
            <div className="w-full">
              <label className="label">
                <span className="text-heading font-inter text-[14px] leading-5">
                  Qualifications
                </span>
              </label>
              <select
                name="qualification"
                className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
              >
                <option disabled selected>
                  Qualification
                </option>
                <option value={"matric"}>Matric</option>
                <option value={"intermediate"}>Intermediate</option>
                <option value={"diploma"}>Diploma</option>
                <option value={"bachelors"}>Bachelors</option>
                <option value={"masters"}>Masters</option>
                <option value={"phd"}>PHD</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="w-full relative">
              <label className="label">
                <span className="text-heading font-inter text-[14px] leading-5">
                  Subject
                </span>
              </label>

              <select
                name="subject"
                id="subject"
                className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
                value={selectedSubject}
                onChange={handleSubjectChange}
              >
                <option value={""}>Select or Add</option>
                {subjects?.map((sub) => (
                  <option value={sub?._id} className="capitalize">
                    {sub?.title.split("_").join(" ")}
                  </option>
                ))}
              </select>
              <span
                className="text-sm absolute top-1 p-1 right-0 text-slate-500 cursor-pointer hover:text-primary hover:font-semibold"
                onClick={() =>
                  document.getElementById("add_subject_modal").showModal()
                }
              >
                + Add New
              </span>
            </div>
            <div className="w-full">
              <label className="label">
                <span className="text-heading font-inter text-[14px] leading-5">
                  Semester/Year
                </span>
              </label>
              <select
                name="semester"
                className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
              >
                <option disabled selected>
                  Semester/Year
                </option>
                <option value={"semester 1"}>Semester 1</option>
                <option value={"semester 2"}>Semester 2</option>
                <option value={"semester 3"}>Semester 3</option>
                <option value={"semester 4"}>Semester 4</option>
                <option value={"semester 5"}>Semester 5</option>
                <option value={"semester 6"}>Semester 6</option>
                <option value={"semester 7"}>Semester 7</option>
                <option value={"semester 8"}>Semester 8</option>
                <option value={"semester 9"}>Semester 9</option>
                <option value={"semester 10"}>Semester 10</option>
                <option value={"semester 11"}>Semester 11</option>
                <option value={"semester 12"}>Semester 12</option>
                <option value={"1st year"}>1st Year</option>
                <option value={"2nd year"}>2nd Year</option>
                <option value={"3rd year"}>3rd Year</option>
                <option value={"4th year"}>4th Year</option>
                <option value={"5th year"}>5th Year</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="w-full">
              <label className="label">
                <span className="text-heading font-inter text-[14px] leading-5">
                  Institution
                </span>
              </label>
              <input
                type="text"
                placeholder="Institution"
                name="institution"
                className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
                required
              />
            </div>
            <div className="w-full">
              <label className="label">
                <span className="text-heading font-inter text-[14px] leading-5">
                  Age
                </span>
              </label>
              <input
                type="number"
                placeholder="Age"
                name="age"
                min={12}
                max={80}
                className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
                required
              />
            </div>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="w-full">
              <label className="label">
                <span className="text-heading font-inter text-[14px] leading-5">
                  Email
                </span>
              </label>
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
                required
              />
            </div>
          </div>
          <div className="flex items-center md:flex-row flex-col justify-between gap-4">
            <div className="w-full">
              <label className="label">
                <span className="text-heading font-inter text-[14px] leading-5">
                  Phone Number
                </span>
              </label>
              <input
                type="tel"
                placeholder="030********"
                name="phoneNumber"
                className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
                required
                maxLength={11}
                minLength={11}
                inputMode="numeric" // Suggests a numeric keyboard on mobile devices
                pattern="[0-9]*" // Ensures only numbers are valid for form submission
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, ""); // Removes non-numeric characters
                  e.target.value = value; // Updates the value to only numeric
                }}
                onKeyDown={(e) => nonNumaricCal(e)}
              />
              <div className="text-red-500">{message}</div>
            </div>
            <div className="w-full">
              <label className="label">
                <span className="text-heading font-inter text-[14px] leading-5">
                  WhatsApp Number
                </span>
              </label>
              <input
                type="tel"
                placeholder="WhatsApp Number"
                name="whatsAppNumber"
                className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
                required
                maxLength={11}
                minLength={11}
                inputMode="numeric" // Suggests a numeric keyboard on mobile devices
                pattern="[0-9]*" // Ensures only numbers are valid for form submission
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, ""); // Removes non-numeric characters
                  e.target.value = value; // Updates the value to only numeric
                }}
                onKeyDown={(e) => nonNumaricCal(e)}
              />
              <div className="text-red-500">{message}</div>
            </div>
          </div>

          <div className="flex items-center md:flex-row flex-col justify-between gap-4">
            <div className="relative w-full">
              <label className="label">
                <span className="text-heading font-inter text-[14px] leading-5">
                  Password
                </span>
              </label>
              <input
                name="password1"
                type={showPass ? "text" : "password"}
                placeholder="Enter Password"
                className="w-full text-secondaryText border border-inputBorder outline-none rounded p-2 text-[16px] leading-6 font-inter"
              />
              <span
                className="absolute right-[4%] top-[65%]"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="relative w-full">
              <label className="label">
                <span className="text-heading font-inter text-[14px] leading-5">
                  Confirm Password
                </span>
              </label>
              <input
                name="password2"
                type={showPass ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full text-secondaryText border border-inputBorder outline-none rounded p-2 text-[16px] leading-6 font-inter"
              />
              <span
                className="absolute right-[4%] top-[65%]"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="flex items-start justify-start">
            <div className="w-full">
              <label className="label">
                <span className="text-heading font-inter text-[14px] leading-5">
                  Home address
                </span>
              </label>
              <textarea
                placeholder="Address"
                name="address"
                className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
                required
              ></textarea>
            </div>
          </div>
          <div className="w-full">
            <span className="text-heading font-inter text-[14px] leading-5 mb-2">
              Organization pocket:
            </span>
            <div className="flex items-center justify-start gap-2  flex-wrap border border-inputBorder p-2 rounded-lg">
              <div className="form-control">
                <label className="label cursor-pointer gap-2">
                  <input
                    type="radio"
                    name="userAreaType"
                    className="radio checked:bg-blue-500"
                    value="Markaz"
                    onChange={(e) => {
                      document.getElementById("autocomplete").value = "";
                      setUserAreaType(e.target.value);
                    }}
                  />
                  <span className="label-text">Markaz</span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer gap-2">
                  <input
                    type="radio"
                    name="userAreaType"
                    className="radio checked:bg-blue-500"
                    value="Province"
                    onChange={(e) => {
                      document.getElementById("autocomplete").value = "";
                      setUserAreaType(e.target.value);
                    }}
                  />
                  <span className="label-text">Province</span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer gap-2">
                  <input
                    type="radio"
                    name="userAreaType"
                    className="radio checked:bg-blue-500"
                    value="Division"
                    onChange={(e) => {
                      document.getElementById("autocomplete").value = "";
                      setUserAreaType(e.target.value);
                    }}
                  />
                  <span className="label-text">Division</span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer gap-2">
                  <input
                    type="radio"
                    name="userAreaType"
                    className="radio checked:bg-blue-500"
                    value="Maqam"
                    onChange={(e) => {
                      document.getElementById("autocomplete").value = "";
                      setUserAreaType(e.target.value);
                    }}
                  />
                  <span className="label-text">Maqam</span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer gap-2">
                  <input
                    type="radio"
                    name="userAreaType"
                    className="radio checked:bg-blue-500"
                    value="Ilaqa"
                    onChange={(e) => {
                      document.getElementById("autocomplete").value = "";
                      setUserAreaType(e.target.value);
                    }}
                  />
                  <span className="label-text">Ilaqa/Zone</span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer gap-2">
                  <input
                    type="radio"
                    name="userAreaType"
                    className="radio checked:bg-blue-500"
                    value="Halqa"
                    onChange={(e) => {
                      document.getElementById("autocomplete").value = "";
                      setUserAreaType(e.target.value);
                    }}
                  />
                  <span className="label-text">Halqa</span>
                </label>
              </div>
            </div>
          </div>
          <div className="w-full flex  justify-between gap-2 flex-col ">
            <span className="text-heading font-inter text-[14px] leading-5 mb-2">
              RelationShip with Jamiat
            </span>
            <div className="w-full p-1 mt-2 flex justify-between items-center">
              <div className="form-control">
                <label className="label cursor-pointer gap-2">
                  <input
                    type="radio"
                    id="rukan"
                    name="joiningType"
                    value="rukan"
                    className="radio checked:bg-blue-500"
                    defaultChecked={joiningDate?.title === "rukan"}
                    onChange={(e) =>
                      setJoiningDate((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                  <span className="label-text">Rukan</span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer gap-2">
                  <input
                    type="radio"
                    id="umeedwar"
                    name="joiningType"
                    value="umeedwar"
                    className="radio checked:bg-blue-500"
                    defaultChecked={joiningDate?.title === "umeedwar"}
                    onChange={(e) =>
                      setJoiningDate((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                  <span className="label-text">Umeedwar</span>
                </label>
              </div>
              {userAreaType !== "Markaz" && (
                <div className="form-control">
                  <label className="label cursor-pointer gap-2">
                    <input
                      type="radio"
                      id="joininType"
                      name="joiningType"
                      value="nazim"
                      className="radio checked:bg-blue-500"
                      defaultChecked={joiningDate?.title === "nazim"}
                      onChange={(e) => {
                        setJoiningDate((prev) => ({
                          ...prev,
                          title: e.target.value,
                          date: "",
                        }));
                      }}
                    />
                    <span className="label-text">Rafeeq</span>
                  </label>
                </div>
              )}
            </div>
            <span className="text-heading font-inter text-[14px] leading-5 mb-2">
              Month of becoming {joiningDate?.title.toUpperCase()}:
            </span>
            <input
              required
              type="month"
              disabled={joiningDate?.title === "nazim"}
              placeholder="No data"
              name="joiningDate"
              min="1947-01"
              className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
              defaultValue={joiningDate?.date?.split("-").slice(0, 2).join("-")}
              onChange={(e) =>
                setJoiningDate((prev) => ({ ...prev, date: e.target.value }))
              }
            />
          </div>
          {/* NAZIM TYPES */}
          {joiningDate?.title && (
            <div className="w-full">
              <span className="px-1 py-2 block font-semibold"> Status:</span>
              <div className="flex  items-center justify-start flex-wrap border border-primary p-2 rounded-lg">
                {joiningDate?.title === "nazim" && (
                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="nazimType"
                        className="radio checked:bg-blue-500"
                        value="nazim"
                      />
                      <span className="label-text">Rafeeq-Nazim</span>
                    </label>
                  </div>
                )}
                {joiningDate?.title === "rukan" && (
                  <>
                    <div className="form-control">
                      <label className="label cursor-pointer gap-2">
                        <input
                          type="radio"
                          name="nazimType"
                          className="radio checked:bg-blue-500"
                          value="rukan"
                        />
                        <span className="label-text">Rukan</span>
                      </label>
                    </div>

                    {userAreaType !== "Markaz" && (
                      <div className="form-control">
                        <label className="label cursor-pointer gap-2">
                          <input
                            type="radio"
                            name="nazimType"
                            className="radio checked:bg-blue-500"
                            value="rukan-nazim"
                          />
                          <span className="label-text">Rukan-Nazim</span>
                        </label>
                      </div>
                    )}
                  </>
                )}
                {joiningDate?.title === "umeedwar" && (
                  <>
                    <div className="form-control">
                      <label className="label cursor-pointer gap-2">
                        <input
                          type="radio"
                          name="nazimType"
                          className="radio checked:bg-blue-500"
                          value="umeedwar"
                        />
                        <span className="label-text">Umeedwaar</span>
                      </label>
                    </div>

                    {userAreaType !== "Markaz" && (
                      <div className="form-control">
                        <label className="label cursor-pointer gap-2">
                          <input
                            type="radio"
                            name="nazimType"
                            className="radio checked:bg-blue-500"
                            value="umeedwaar-nazim"
                          />
                          <span className="label-text">Umeedwaar-Nazim</span>
                        </label>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
          <div className="relative">
            <div
              className=" w-full"
              data-tip={
                userAreaType
                  ? `Organization is ${userAreaType}`
                  : "Select organization "
              }
            >
              <span className="text-heading font-inter text-[14px] leading-5 mb-2 text-left">
                Area:
              </span>
              <input type="hidden" name="userAreaId" id="userAreaId" />
              <input
                id="autocomplete"
                type="search"
                autoComplete="off"
                className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
                placeholder="Select area"
                onChange={(e) => setSearchArea(e.target.value)}
                onClick={() => {
                  if (
                    document
                      .getElementById("autocomplete-list")
                      .classList.contains("hidden")
                  ) {
                    document
                      .getElementById("autocomplete-list")
                      .classList.remove("hidden");
                  } else {
                    document
                      .getElementById("autocomplete-list")
                      .classList.add("hidden");
                  }
                }}
              />
              <div
                id="autocomplete-list"
                class="absolute hidden z-10 max-h-[100px] overflow-y-scroll bg-white border text-start border-gray-300 w-full mt-1"
              >
                {areas
                  ?.sort((a, b) => a?.name?.localeCompare(b?.name))
                  ?.filter((item) => {
                    if (searchArea && searchArea !== "") {
                      if (
                        item?.name
                          ?.toString()
                          ?.toLowerCase()
                          ?.includes(searchArea?.toString()?.toLowerCase())
                      ) {
                        return true;
                      }
                      return false;
                    } else {
                      return true;
                    }
                  })
                  ?.map((area, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        document.getElementById("userAreaId").value = area?._id;
                        document.getElementById("autocomplete").value = `${
                          area?.name
                        }${
                          userAreaType === "Halqa"
                            ? ` - ${area?.parentId?.name} (${area?.parentType})`
                            : ""
                        }`;
                        document
                          .getElementById("autocomplete-list")
                          .classList.add("hidden");
                      }}
                      className="p-2 cursor-pointer text-start hover:bg-gray-100"
                    >
                      {area?.name}
                      {userAreaType === "Halqa"
                        ? ` - ${area?.parentId?.name} (${area?.parentType}) ${
                            area?.parentType === "Tehsil"
                              ? getDivName(area, "tehsil")
                              : area.parentType === "Ilaqa"
                              ? getDivName(area, "Ilaqa")
                              : ""
                          }`
                        : userAreaType === "Ilaqa"
                        ? ` - ${area?.maqam?.name}(Maqam) -${area?.maqam?.province?.name}(Province)`
                        : userAreaType === "Maqam"
                        ? ` - ${area?.province?.name} `
                        : userAreaType === "Division"
                        ? ` - ${area?.province?.name}`
                        : ""}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="w-full p-4">
            <Link
              to="/"
              className="text-[14px] py-4 leading-5 font-medium text-accentForeground font-inter underline"
            >
              Already have an account?
            </Link>
          </div>
          <div className="w-full">
            <button
              type="submit"
              className="text-[14px] leading-6 font-medium font-inter text-white bg-primary w-full py-2 border rounded"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div
          className="w-full flex items-center justify-center mt-2 gap-2 y cursor-pointer"
          onClick={handleClick}
        >
          <span className="text-black font-inter text-[14px]">Powered By:</span>
          <div className="flex gap-2 items-center">
            <img src="/cd.png" alt="icon" width={15} height={15} />
            <span className="text-black font-inter text-[14px]">
              ConsoleDot
            </span>
          </div>
        </div>
      </div>
      {loading && <Loader />}
      <dialog id="add_subject_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add Subject</h3>
          <div className="space-y-4">
            <div className="w-full">
              <label className="label">
                <span className="text-heading font-inter text-[14px] leading-5">
                  Subject
                </span>
              </label>
              <input
                name="subject"
                type="text"
                placeholder="Enter Subject Name"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-secondaryText border outline-none border-inputBorder rounded p-2 text-[16px] leading-6 font-inter"
                required
              />
            </div>
          </div>
          <div className="modal-action w-full">
            <form method="dialog" className="w-full">
              <div className=" w-full flex justify-end gap-3 items-center">
                <button
                  id="close-division-modal"
                  className="p-5 py-3 rounded-md bg-slate-400 text-white font-semibold border ms-3"
                >
                  Cancel
                </button>
                <button
                  id="close-division-modal"
                  className="btn ms-3 capitalize"
                  onClick={addNewSubjectCall}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};
