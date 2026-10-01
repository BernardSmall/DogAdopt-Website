import { useRef, useState } from 'react';
import { api } from '../api';
import { limits, validateForm } from '../../../shared/validation';

export const adoptionFields = [
  {name:'name',label:'Name',placeholder:'Your Name',autoComplete:'name'},
  {name:'email',label:'Email',type:'email',placeholder:'Your Email',autoComplete:'email'},
  {name:'phone',label:'Phone Number',type:'tel',placeholder:'Your Phone Number',autoComplete:'tel'},
  {name:'address',label:'Address',type:'textarea',placeholder:'Your Address',autoComplete:'street-address'},
];
export const contactFields = [...adoptionFields.slice(0,2),{name:'message',label:'Message',type:'textarea',placeholder:'Your Message'}];

export function Field({field,namespace,auth,error}) {
  const {name,label,type='text',...rest} = field;
  const Control = type==='textarea'?'textarea':'input';
  return <div className={auth?'field':`${namespace}-form__group`}>
    <label htmlFor={name} className={auth?'field-label':`${namespace}-form__label`}>{label}</label>
    <Control id={name} name={name} type={type==='textarea'?undefined:type} {...rest} required maxLength={limits[name]} className={auth?undefined:`${namespace}-form__${type==='textarea'?'textarea':'input'}`} aria-invalid={Boolean(error)} aria-describedby={error?`${name}-error`:undefined}/>
    {error&&<p id={`${name}-error`} className="field-error">{error}</p>}
  </div>;
}

export default function Form({kind,endpoint,fields,namespace,submitLabel,extra={},disabled=false,onSuccess,children}) {
  const [errors,setErrors] = useState({});
  const [status,setStatus] = useState(null);
  const [pending,setPending] = useState(false);
  const lock = useRef(false);
  const formRef = useRef(null);
  const auth = kind==='login'||kind==='signup';
  async function submit(event) {
    event.preventDefault();
    if(lock.current||disabled)return;
    const data = {...Object.fromEntries(new FormData(event.currentTarget)),...extra};
    const validation = validateForm(kind,data);
    setErrors(validation);setStatus(null);
    if(Object.keys(validation).length){
      setStatus({error:true,message:'Please correct the highlighted fields.'});
      formRef.current.elements.namedItem(Object.keys(validation)[0])?.focus();
      return;
    }
    lock.current=true;setPending(true);
    try {
      const response = await api(endpoint,{method:'POST',body:JSON.stringify(data)});
      setStatus({error:false,message:response.message});
      if(!auth) formRef.current.reset();
      onSuccess?.(response);
    } catch(error) {
      setErrors(error.fields||{});setStatus({error:true,message:error.message});
      formRef.current.elements.namedItem(Object.keys(error.fields||{})[0])?.focus();
    } finally {lock.current=false;setPending(false);}
  }
  return <form ref={formRef} className={auth?'form':`${namespace}-form`} onSubmit={submit} noValidate aria-busy={pending}>
    {fields.map(field=><Field key={field.name} field={field} namespace={namespace} auth={auth} error={errors[field.name]}/>)}
    {children}
    {errors.dogId&&<p className="field-error" role="alert">{errors.dogId}</p>}
    <button className={auth?'cta':`${namespace}-btn ${namespace}-btn--lg`} type="submit" disabled={pending||disabled}>{pending?'Submitting…':submitLabel}</button>
    {status&&<p className={`form-status ${status.error?'is-error':'is-success'}`} role={status.error?'alert':'status'}>{status.message}</p>}
  </form>;
}
