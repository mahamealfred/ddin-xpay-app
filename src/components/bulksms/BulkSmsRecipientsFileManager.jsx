/**
 * *@gniyonge
 * Bulk SMS Recipients File Manager

 */

import React,{useState} from "react";
import {read,utils,writeFile} from "xlsx";


const BulkSmsRecipientsFileManager=()=>{
const[users,setUsers]=useState([]);
const handleImport = $event=>{
    const files=$event.target.files;
    if(files.length){
        const file=files[0];
        const reader=new FileReader();
        reader.onload=event=>{
            const wb=reader(event.target.result);
            const sheets=wb.SheetNames;
            if(sheets.length){
                 const rows=utils.sheet_to_json(wb.Sheets[sheets[0]]);
                 setUsers(rows);

            }
        };
        reader.readAsArrayBuffer(file);

    }
}
}
