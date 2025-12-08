// "use client";

// import { useState } from "react";

// type Props = {
//   categoryId: string;
// };

// export default function BulkUploader({ categoryId }: Props) {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setSelectedFile(e.target.files[0]);
//     }
//   };

//   const uploadFile = async () => {
//     if (!selectedFile) return alert("Please select a file");

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("file", selectedFile);
//     console.log(selectedFile);
//     try {
//       const res = await fetch(
//         `http://localhost:8000/api/category/bulk-upload/e808578d-c7b6-4372-82b1-72174d1f058c`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const data = await res.json();
//       setResult(data);
//     } catch (err) {
//       console.error(err);
//       alert("Upload failed!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 border rounded-lg bg-white shadow-md w-full max-w-md">
//       <h2 className="text-lg font-semibold mb-3">Bulk Upload Questions</h2>

//       <input
//         type="file"
//         accept=".xlsx,.xls"
//         onChange={handleFileChange}
//         className="border p-2 w-full"
//       />

//       <button
//         onClick={uploadFile}
//         disabled={loading}
//         className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">
//         {loading ? "Uploading..." : "Upload Excel File"}
//       </button>

//       {result && (
//         <div className="mt-4 p-3 border rounded bg-gray-100">
//           <p>Total Uploaded: {result.totalUploaded}</p>
//           <p>Total Inserted: {result.totalInserted}</p>
//           <p>Skipped Duplicates: {result.skippedDuplicates}</p>
//         </div>
//       )}
//     </div>
//   );
// }

import React from "react";

const page = () => {
  return <div>page</div>;
};

export default page;
