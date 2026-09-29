import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createSubmissionPdf } from "./submission-pdf.mjs";

const FIELD_IDS = new Set(`full_name form_date birth_date_age phone email gender weight_kg height_cm bmi abw_kg ibw_kg bee total_calories protein_needs waist_cm recent_weight_change weight_change_amount weight_change_period biochem_0 biochem_1 biochem_2 biochem_3 biochem_4 biochem_5 biochem_6 biochem_7 biochem_8 biochem_9 biochem_10 biochem_11 biochem_12 medical_history medical_history_other bmi_category activity_level diet_order pes primary_goal previous_program previous_program_experience allergies medications breakfast morning_snack lunch afternoon_snack dinner evening_snacks beverages meals_per_day eating_out sleep_hours sleep_quality stress_level stress_eating eat_without_hunger cravings common_cravings craving_times craving_times_other portion_control skip_meals meal_preparer meal_preparer_other cook_home prep_time privacy_acknowledged client_name_confirmation signature_confirmation`.split(/\s+/));
const LABELS = {
 full_name:"Name",form_date:"Today's date",birth_date_age:"Date of birth",phone:"Phone",email:"Email",gender:"Gender",weight_kg:"Weight (kg)",height_cm:"Height (cm)",bmi:"BMI",abw_kg:"ABW (kg)",ibw_kg:"IBW (kg)",bee:"BEE",total_calories:"Total calories (kcal)",protein_needs:"Protein needs (g)",waist_cm:"WC (cm)",recent_weight_change:"Recent weight change",weight_change_amount:"Weight change amount (kg)",weight_change_period:"Weight change period",biochem_0:"HCT",biochem_1:"CR",biochem_2:"TG",biochem_3:"HDL",biochem_4:"HB",biochem_5:"NA",biochem_6:"CHOL",biochem_7:"FBG",biochem_8:"BUN",biochem_9:"K+",biochem_10:"LDL",biochem_11:"HBA1C",biochem_12:"Other biochemical information",medical_history:"Past medical history",medical_history_other:"Other medical history",bmi_category:"BMI category",activity_level:"Activity level",diet_order:"Diet order",pes:"PES",primary_goal:"Primary goal",previous_program:"Previously followed a diet or nutrition program",previous_program_experience:"Previous program experience",allergies:"Allergy / food intolerance",medications:"Medications / supplements",breakfast:"Breakfast — time & foods",morning_snack:"Morning snack",lunch:"Lunch — time & foods",afternoon_snack:"Afternoon snack",dinner:"Dinner — time & foods",evening_snacks:"Evening snacks",beverages:"Beverages",meals_per_day:"Meals per day",eating_out:"Eating outside / ordering food",sleep_hours:"Average sleep (hours/night)",sleep_quality:"Sleep quality",stress_level:"Current stress level",stress_eating:"Stress affects eating",eat_without_hunger:"Eating without physical hunger",cravings:"Strong food cravings",common_cravings:"Common cravings",craving_times:"Craving times",craving_times_other:"Other craving times",portion_control:"Difficulty controlling portions",skip_meals:"Regularly skips meals",meal_preparer:"Meal preparer",meal_preparer_other:"Other meal preparer",cook_home:"Cooking at home",prep_time:"Meal preparation time",privacy_acknowledged:"Privacy acknowledgment",client_name_confirmation:"Client name",signature_confirmation:"Electronic signature confirmation"
};
const MAX_BYTES = 48_000;
const json=(data,status,headers={})=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store",...headers}});
const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
function valid(responses){if(!responses||typeof responses!=="object"||Array.isArray(responses))return false;for(const [key,value] of Object.entries(responses)){if(!FIELD_IDS.has(key))return false;if(typeof value==="string"&&value.length>5000)return false;if(Array.isArray(value)&&(!value.every(item=>typeof item==="string"&&item.length<150)||value.length>15))return false;if(typeof value!=="string"&&!Array.isArray(value)&&typeof value!=="boolean")return false}return typeof responses.full_name==="string"&&!!responses.full_name.trim()&&responses.privacy_acknowledged===true&&typeof responses.signature_confirmation==="string"&&!!responses.signature_confirmation.trim()}
export default async (request) => {
 const origin=request.headers.get("Origin"),allowedOrigin=process.env.ALLOWED_ORIGIN;
 const corsHeaders={"Access-Control-Allow-Origin":origin===allowedOrigin?origin:"null","Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type","Vary":"Origin"};
 if(request.method==="OPTIONS")return new Response(null,{status:204,headers:corsHeaders});
 if(request.method!=="POST")return json({error:"Method not allowed"},405,corsHeaders);
 if(!allowedOrigin||origin!==allowedOrigin)return json({error:"Origin not allowed"},403,corsHeaders);
 const {RESEND_API_KEY,CLINIC_EMAIL,RESEND_FROM}=process.env;
 if(!RESEND_API_KEY||!CLINIC_EMAIL||!RESEND_FROM)return json({error:"The clinic email service is not configured."},503,corsHeaders);
 try{
  const raw=await request.text();if(new TextEncoder().encode(raw).byteLength>MAX_BYTES)return json({error:"Form is too large"},413,corsHeaders);
  const body=JSON.parse(raw);if(body.website)return json({ok:true},200,corsHeaders);
  const answers=body.responses;if(!valid(answers))return json({error:"Please complete the required fields and check the information."},400,corsHeaders);
  const reference=crypto.randomUUID(),submittedAt=new Date().toISOString();
  const pdfBytes=await createSubmissionPdf({PDFDocument,StandardFonts,rgb,clinicName:"Dietitian Rawan Chamseddine",labels:LABELS,submissionId:reference,submittedAt,answers});
  const result=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${RESEND_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({from:RESEND_FROM,to:CLINIC_EMAIL.split(/[;,]/).map(address=>address.trim()).filter(Boolean),subject:"New patient form submission",html:`<p>A new patient form submission is attached as a PDF.</p><p>Submission reference: ${escapeHtml(reference)}</p>`,attachments:[{filename:`patient-submission-${reference}.pdf`,content:Buffer.from(pdfBytes).toString("base64"),content_type:"application/pdf"}]})});
  if(!result.ok)return json({error:"We could not send your information to the clinic. Your answers are still on this page; please try again."},502,corsHeaders);
  return json({ok:true,id:reference},201,corsHeaders);
 }catch{return json({error:"Unable to send the form. Your answers are still on this page; please try again."},400,corsHeaders)}
};



