import React, { JSX, useState } from "react";
import { useSelector } from "react-redux";
import { numberToWords } from "@/Lib/Actions";
import { company, payment, terms } from "@/Lib/Content";
import { Plus } from "lucide-react";

interface InvoiceInfo { number?:string;date?:string;dueDate?:string;terms?:string;serviceFrom?:string;serviceTo?:string; }
interface BillToInfo { name?:string;addressLines?:string;patientName?:string;otherDetails?:string; }
interface ItemRow { description:string;days:number|string;rate:number|string;amount:number|string; }
interface Totals {
  Discount?: any;
  AdvancePaid?: any;
  Tax?: any;
  OtherExpenses?: any;
  RegistraionFee?: any;
  total?: any;
  balanceDue?: any;
}

interface ColorConfig { primary?:string;accent?:string;pink?:string; }
interface Props { invoice?:InvoiceInfo;billTo?:BillToInfo;items?:ItemRow[];totals?:Totals;colors?:ColorConfig; }

export default function ReusableInvoice({
 invoice={}, billTo={}, items=[], totals={},
 colors={primary:"#50c896",accent:"#1392d3",pink:"#ff1493"}
}:Props):JSX.Element{


const InvoiceStatus:boolean = useSelector((s:any)=>s.InvoiceEditStatus);


const [editInvoice,setEditInvoice] = useState(invoice);
const [editBillTo,setEditBillTo] = useState(billTo);
const [editItems,setEditItems] = useState<ItemRow[]>(items);
const [editTotals,setEditTotals] = useState<Totals>({
 Discount: totals.Discount||0,
 AdvancePaid: totals.AdvancePaid||0,
 Tax: totals.Tax||0,
 OtherExpenses: totals.OtherExpenses||0,
 RegistraionFee: totals.RegistraionFee||0,
 total: totals.total||0,
 balanceDue: totals.balanceDue||0,
});


const updateItem=(i:number,f:keyof ItemRow,value:any)=>{
 const arr=[...editItems];
 arr[i][f]=value;

 if(f==="days"||f==="rate"){
  const d=Number(arr[i].days)||0;
  const r=Number(arr[i].rate)||0;
  arr[i].amount=(d*r).toFixed(2);
 }
 setEditItems(arr);
 recalcTotals();
};


const updateTotals=(f:keyof Totals,value:any)=>{
 if(!InvoiceStatus) return;
 const u={...editTotals,[f]:+value};

 u.total = (u.RegistraionFee||0)+(u.OtherExpenses||0)+(u.Tax||0) - (u.Discount||0)-(u.AdvancePaid||0);
 u.balanceDue = u.total;

 setEditTotals(u);
}

const recalcTotals=()=> updateTotals("total",editTotals.total);


const display = InvoiceStatus?editTotals:totals;
const renderItems = InvoiceStatus?editItems:items;

return(
<div style={{padding:"4px",width:"100%",background:"#fff",borderRadius:"10px",boxShadow:"0 0 10px #0001"}}>

<div style={{display:"flex",alignItems:"center",marginBottom:"15px"}}>
 <div style={{width:"8px",height:"100px",background:colors.primary,borderRadius:"0 8px 8px 0"}}/>
 <div style={{flex:1,display:"flex",justifyContent:"space-between",marginLeft:"16px"}}>
  <div>
   <h1 style={{fontSize:"32px",fontWeight:"bold",letterSpacing:"2px",margin:0,color:colors.primary}}>INVOICE</h1>
   <p style={{marginTop:"6px",color:"#475569",fontSize:"16px"}}>Invoice ID: #{invoice.number}</p>
  </div>
  <img src="https://curate-pearl.vercel.app/Icons/Curate-logoq.png" style={{height:70}}/>
 </div>
</div>


<div style={{display:"flex",justifyContent:"space-between"}}>


<div style={{width:"50%"}}>
 <h4 style={{fontSize:18,fontWeight:600}}>Bill To</h4>



 

 <div style={{marginTop:18,fontSize:14}}>
  <strong>Invoice Date:</strong>{" "}
  {InvoiceStatus?<input className="border ml-1" value={editInvoice.date||""} onChange={e=>setEditInvoice({...editInvoice,date:e.target.value})}/> : invoice.date}
  
  <br/><strong>Due Date:</strong>{" "}
  {InvoiceStatus?<input className="border ml-1" value={editInvoice.dueDate||""} onChange={e=>setEditInvoice({...editInvoice,dueDate:e.target.value})}/> : invoice.dueDate}
  
  <br/><strong>Terms:</strong>{" "}
  {InvoiceStatus?<input className="border ml-1" value={editInvoice.terms||""} onChange={e=>setEditInvoice({...editInvoice,terms:e.target.value})}/> : invoice.terms}
 </div>
</div>

<div style={{width:"50%",textAlign:"right"}}>
 <h3 style={{fontWeight:"bold",fontSize:20,color:colors.pink}}>{company.name}</h3>
 {company.addressLines?.map((x,i)=><div key={i}>{x}</div>)}
 <p><b>Patient Name:</b> {billTo.patientName||"-"}</p>

 <p><b>Service Dates:</b><br/>
   {InvoiceStatus?<>
    <input className="border mr-1 w-24" value={editInvoice.serviceFrom||""}
       onChange={e=>setEditInvoice({...editInvoice,serviceFrom:e.target.value})}/>
     to
    <input className="border ml-1 w-24" value={editInvoice.serviceTo||""}
       onChange={e=>setEditInvoice({...editInvoice,serviceTo:e.target.value})}/>
   </>:
   `${invoice.serviceFrom} to ${invoice.serviceTo}`}
 </p>
</div></div>




<table style={{width:"100%",borderCollapse:"collapse",marginTop:10}}>
<thead>
            <tr style={{ background: colors.primary, color: "white" }}>
              <th style={{ padding: "8px", textAlign: "left" }}>#</th>
              <th style={{ padding: "8px", textAlign: "left" }}>
                Service &amp; Description
              </th>
              <th style={{ padding: "8px", textAlign: "right" }}>Days</th>
              <th style={{ padding: "8px", textAlign: "right" }}>Rate</th>
              <th style={{ padding: "8px", textAlign: "right" }}>Amount</th>
            </tr>
          </thead>
 <tbody>
{renderItems.map((it,i)=>(
<tr key={i}>
 <td>{i+1}</td>
 <td>{InvoiceStatus?<input className="border p-1 w-full" value={it.description} onChange={e=>updateItem(i,"description",e.target.value)}/> : it.description}</td>
 <td align="right">{InvoiceStatus?<input className="border p-1 w-14 text-right" value={it.days} onChange={e=>updateItem(i,"days",e.target.value)}/> : it.days}</td>
 <td align="right">{InvoiceStatus?<input className="border p-1 w-20 text-right" value={it.rate} onChange={e=>updateItem(i,"rate",e.target.value)}/>:`₹${it.rate}/-`}</td>
 <td align="right">₹{it.amount}/-</td>
</tr>
))}
 </tbody>
</table>
{InvoiceStatus&&             <Plus  className="bg-teal-800 p-2 ml-2 mb-2 rounded-md text-white cursor-pointer h-8 w-8" />}

<div style={{display:"flex",marginTop:30,gap:25}}>


<div style={{width:"50%"}}>
 <h4>Payment Method</h4>
 <img src="https://curate-pearl.vercel.app/Icons/PaymentScanner.png" style={{height:120}}/>
 <p><b>Account Name:</b> Curate Health Services</p>
 <p><b>Bank Name:</b> UCO Bank</p>
 <p><b>Account Number:</b> 01140210002278</p>
 <p><b>IFSC:</b> UCBA0000114</p>
 <p><b>UPI:</b> curateservices@ucobank</p>
</div>

<div style={{width:"50%",background:"#f1f5f9",padding:"12px",borderRadius:10,maxWidth:300,marginLeft:"auto"}}>
 {renderRow("Discount",display.Discount,updateTotals,InvoiceStatus,"green")}
 {renderRow("AdvancePaid",display.AdvancePaid,updateTotals,InvoiceStatus,"green")}
 {renderRow("Tax",display.Tax,updateTotals,InvoiceStatus,"red")}
 {renderRow("RegistraionFee",display.RegistraionFee,updateTotals,InvoiceStatus)}
 {renderRow("OtherExpenses",display.OtherExpenses,updateTotals,InvoiceStatus)}

 <Row label="Total" value={display.total}/>
 <Row label="Balance Due" value={display.balanceDue} bold red/>

 <p style={{marginTop:6}}>In Words:
   <b style={{textDecoration:"underline"}}>
     {numberToWords(display.total||0)} ONLY
   </b>
 </p>
</div></div>


<div style={{ marginTop: "25px" }}>
        <h5 style={{ fontWeight: 600, marginBottom: "6px" }}>Terms & Conditions</h5>

        <ol
          style={{
            fontSize: "11px",
            color: "#334155",
            lineHeight: "14px",
            paddingLeft: "18px"
          }}
        >
          {terms.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ol>
      </div>

 <h3 style={{textAlign:"center",color:colors.pink,marginTop:25}}>
 A Complete Home Healthcare Professionals. We care for your beloved.
 </h3>
 <p style={{textAlign:"center",marginTop:6}}>https://curatehealthservices.com</p>



{InvoiceStatus&&<button className="w-full bg-slate-900 text-white py-3 mt-5 rounded">Update & Send E-Mail</button>}

</div>)}


function renderRow(label:string,value:any,update:any,active:boolean,color?:string){
return(
<div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}>
<span>{label}</span>
{active?
 <input className="border text-right w-20" style={{color}} value={value}
 onChange={e=>update(label as any,e.target.value)}/>
 :<span style={{fontWeight:600,color}}>₹{value}/-</span>}
</div>)}

function Row({label,value,red,bold}:{label:string;value:any;red?:boolean;bold?:boolean}){
return(
<div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}>
 <span>{label}</span>
 <span style={{color:red?"red":"#000",fontWeight:bold?700:600}}>₹{value}/-</span>
</div>
)}
