import React, { useEffect, useMemo, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import { FaLongArrowAltDown } from "react-icons/fa";
import { FaLongArrowAltUp } from "react-icons/fa";

export default function Chart() {
  let [data, setdata] = useState([]);
  let [arrow, setarrow] = useState({
    id: "Ascending",
    firstName: "Ascending",
    age: "Ascending",
  });
  let [gender, setgender] = useState("");
  let [country, setcountry] = useState("");
  let [key, setkey] = useState("id");
  let [direction, setdirection] = useState("Ascending");
  let [page,setpage]=useState(1);
  let constantpage=10;

  async function fetchingdata() {
    let response = await fetch("https://dummyjson.com/users");
    let apidata = await response.json();
    setdata(apidata.users);
  }

  useEffect(() => {
    fetchingdata();
  }, []);

  let changegender = (e) => {
    setgender(e.target.value);
  };

  let changecountry = (e) => {
    setcountry(e.target.value);
  };

  let filterdata = useMemo(() => {
    return data.filter((e) => {
      let checkgender = gender ? e.gender === gender : true;
      let checkcountry = country ? e.address.country === country : true;
      return checkcountry && checkgender;
    });
  }, [data, gender, country]);

  let arrowwisesorting = (key) => {
    let newdirection = arrow[key] === "Ascending" ? "Descending" : "Ascending";
    setarrow({ ...arrow, [key]: newdirection });
    setkey(key);
    setdirection(newdirection);
  };

  let sorteddata = useMemo(() => {
    return [...filterdata].sort((a, b) => {
      if (key === "age") {
        return direction === "Ascending" ? a[key] - b[key] : b[key] - a[key];
      } else {
        return direction === "Ascending"
          ? a[key] > b[key]
            ? 1
            : -1
          : a[key] < b[key]
          ? 1
          : -1;
      }
    }).slice((page-1)*constantpage,page*constantpage);
  }, [filterdata, key, direction , page]);

  let totalpage=Math.ceil(filterdata.length/constantpage);

  let nextpage=()=>{
    if(page<totalpage){
      setpage(page+1);
    }
  }

  let prevpage=()=>{
    if(page>1){
      setpage(page-1);
    }
  }

  return (
    <>
      <div className="border-solid border-2 border-gray-600 w-full">
        <div className="flex align-middle mt-6 ml-7">
      <h1 className="font-sans font-bold text-[30px]">Employees</h1>
      </div>
        <div className="flex mr-9 mt-[-12px] mb-8 justify-end">

          <div className="flex gap-4 mt-[-25px] ">
          <FaFilter className="mt-1" />

            <select name="country" id="country" onChange={changecountry} className="border-2 p-2 border-solid">
              <option value="">Country</option>
              <option value="India">INDIA</option>
              <option value="USA">USA</option>
            </select>

            <select name="Gender" id="gender" onChange={changegender} className="border-2 p-2 border-solid">
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <div className="border-2  mt-[-22px]">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="text-center">

                  <div className="flex flex-row justify-center items-center">
                  <div>Id{" "}</div>
                  <div
                    onClick={() => arrowwisesorting("id")}
                    className="flex align-middle justify-center"
                  >
                    <FaLongArrowAltUp /> <FaLongArrowAltDown className="text-red-500" />
                  </div>
                  </div>
                </th>

                <th className="text-center">Images</th>
                <th className="text-center">
                <div className="flex flex-row justify-center items-center">
                 <div> Full Name{" "}</div>
                  <div
                    onClick={() => arrowwisesorting("firstName")}
                    className="flex align-middle justify-center"
                  >
                    <FaLongArrowAltUp /> <FaLongArrowAltDown className="text-red-500" /> 
                  </div>
                  </div>
                </th>
                <th className="text-center">
                <div className="flex flex-row justify-center items-center">
                  <div>
                  Demography{" "}
                  </div>
                  <div
                    onClick={() => arrowwisesorting("age")}
                    className="flex align-middle justify-center"
                  >
                    <FaLongArrowAltUp /> <FaLongArrowAltDown className="text-red-500" />
                  </div>
                  </div>
                </th>
                <th className="text-center">Designation</th>
                <th className="text-center">Location</th>
              </tr>
              
            </thead>
            <tbody>
              {sorteddata.map((ele) => (
                <tr key={ele.id}>
                  <td className="text-center">{ele.id}</td>
                  <td className="text-center w-12 ml-12">
                    <img src={ele.image} alt="" className="" />
                  </td>
                  <td className="text-center">
                    {ele.firstName || ele.lastName}
                  </td>
                  <td className="text-center">
                    {ele.age}/{ele.gender}
                  </td>
                  <td className="text-center">{ele.company.title}</td>
                  <td className="text-center">
                    {ele.address.city}, {ele.address.country}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end gap-8">
             <button onClick={prevpage} className="px-4 py-2 bg-red-300 rounded" >Previous</button>
             <button onClick={nextpage} className="px-4 py-2 bg-red-300 rounded">Nextpage</button>
          </div>
        </div>
      </div>
    </>
  );
}
