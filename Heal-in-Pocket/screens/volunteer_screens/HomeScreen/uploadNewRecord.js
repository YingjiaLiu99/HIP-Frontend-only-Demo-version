import React, { useState, useContext, useRef, createRef, useEffect } from 'react';
import { Text, View, TouchableOpacity, Alert, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { StackActions } from '@react-navigation/native';

import axios from 'axios';

import InputBoxWithInnerLabel from '../../../components/InputBoxWithInnerLabel';
import BigInputBoxWithInnerLabel from '../../../components/BigInputBoxWithInnerLabel';
import styles from './styles';

import baseURL from '../../../common/baseURL';

export default function UploadMedicalInfo({ route, navigation }) {


  const { firstName, lastName, DOB, gender, time, date} = route.params;


  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // TODO: create states to store the vitals and medical histories

  // use: "vital_only" for vital only
  // use: "standard" for vital + medical history
  const [record_type, setRecordType] = useState('');
  const [corresponding_id, setCorrespondingId] = useState('');

  // Medical histories
  const [smoking_status, setSmokingStatus] = useState(null);
  const [pregnancy_status, setPregnancyStatus] = useState(null);
  const [chronic_condition, setChronicCondition] = useState('');
  const [current_medications, setCurrentMedications] = useState('');
  const [allergies, setAllergies] = useState('');
  const [chief_complaint, setChiefCompliant] = useState('');

  // Vitals
  const [temperature, setTemperature] = useState('');
  // High and low
  const [systolic_blood_pressure, setSysBloodPressure] = useState('');
  const [diastolic_blood_pressure, setDiaBloodPressure] = useState('');
  const [pulse, setPulse] = useState('');
  const [oxygen, setOxygen] = useState('');
  const [glucose, setGlucose] = useState('');

  //SOAP:
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');

  // provider_name, scribe_name, owner
  const [provider_name, setProviderName] = useState('');
  const [scribe_name, setScribeName] = useState('');
  // const [owner, SetOwner] = useState('');


  // Refs for input elements to manage focus
  const temperatureRef = useRef(null);
  
  const pulseRef = useRef(null);
  const oxygenRef = useRef(null);
  const glucoseRef = useRef(null);


  const labelProperties = {    
    'Temp': { unit: 'F', width: '100%' },
    'Pulse': { unit: 'bpm', width: '100%' },
    'Oxygen': { unit: '%', width: '100%' },
    'Glucose': { unit: 'mg/dl', width: '100%' },
    'Sys_BP': { unit: 'mmHg', width: '100%' },
    'Dia_BP': { unit: 'mmHg', width: '100%' },
  };



  const postNewRequest = async (data) => {
    try {
      const response = await axios.post(`${baseURL}request/volunteer/add`, data);
      return response.data;
    } catch (error) {
      if (error.response) {
        // The request was successfully sent to the server and the server returned an error response. 
        console.log('Backend Error:', error.response.data.message);
      } else if (error.request) {
        // The request was sent, but no response was received from the server. This can be due to network issues, server downtime, etc.
        console.log('Network Error:', error.message);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error:', error.message);
      }
    }
  };


  const uploadRecord = async (data) => {
    try {
      const response = await axios.post(`${baseURL}record`, data);
      return response.data;
    } catch (error) {
      if (error.response) {
        // The request was successfully sent to the server and the server returned an error response. 
        console.log('Backend Error (record):', error.response.data.message);
      } else if (error.request) {
        // The request was sent, but no response was received from the server. This can be due to network issues, server downtime, etc.
        console.log('Network Error:', error.message);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error:', error.message);
      }
    }
  };





  
  
  const handleSubmit = async() => {    
    if(chief_complaint === ''){
        // Set error message
      setErrorMessage('Please fill in reason for consultation');  
    }
    else{
      if (confirmSubmit) {   
        // create a new record here, use all the data you stored in the states.
        // for the fields that needed to be filled by doctors, put null
        // after successfully create the record, get its record id from response
        // and put it in the request's corresponding_record field below
        // try {
        //   const re
        // }

        //  const newRecord ={
        //   allergies: allergies,
        //   ....
        //   doctor_name: null
        //   soapnote:注意 soapnote是一个object
        //   saopnote: {
        //     objective: null,
        //     ...
        //   }
        //  }

        //  axios. ..



      // create new request on server
      const newRequest = {
        patient_name: `${firstName} ${lastName}`,
        corresponding_record: " ", // dummy data now
        new_patient: true, // or based on a condition
        chief_complaint: chief_complaint
      };

      try {
        const request = await postNewRequest(newRequest);
        console.log("The new created request:", request);
      } catch (error) {
        console.error("Failed to send data to server:", error);        
      }
        navigation.dispatch(StackActions.replace('Success')); // prevent going back
      } 
      else {
        setConfirmSubmit(true);        
    }
  }
};

  const handleOutsidePress = () => {
    if(confirmSubmit) {
      setConfirmSubmit(false);
    }    
  };





  
  

  const handleVitalOnlySubmit = async () => {
    setRecordType("vital_only");

    const newRecord = {
      record_type: record_type,
  
      smoking_status: smoking_status,
      pregnancy_status: pregnancy_status,
      chronic_condition: chronic_condition,
      current_medications, current_medications,
      allergies: allergies,
      chief_complaint: chief_complaint,
  
      vitals: {
        temperature: temperature,
        systolic_blood_pressure: systolic_blood_pressure,
        diastolic_blood_pressure: diastolic_blood_pressure, 
        pulse: pulse,
        oxygen: oxygen,
        glucose: glucose,
      },
  
      soap: {
        subjective: subjective,
        objective: objective,
        assessment: assessment,
      },
      
      provider_name: provider_name,
      scribe_name: scribe_name, 
      owner: '64fe7dccf072c23851e8567b'
  
    };

    const uploadRequest = await uploadRecord(newRecord);
    console.log(uploadRecord);
    //uploadRequestRecordId = uploadRequest.record_id;

    const newRequest = {
      patient_name: `${firstName} ${lastName}`,
      corresponding_record: "1231231", 
      new_patient: true, // or based on a condition
      chief_complaint: chief_complaint
    };
    

    try {
      const addRequest = await postNewRequest(newRequest);
      console.log("Request added:", addRequest);
      navigation.navigate('Home');
    } catch (error) {
      console.error("Failed to send data to server:", error);   
    } 

    
  }

  return (
  <View style={{flex:1}}>
    <View style={{
      position: 'absolute',              
      paddingTop: 0, 
      backgroundColor: '#DDE5FD', 
      zIndex: 999, 
      elevation: 3, 
      flexDirection: 'column',
      justifyContent: 'space-between',
      height:85
    }}>
      <View>

      <View style={{ flexDirection: 'row', paddingLeft:5}}>
        <Text style={{fontSize: 25, fontWeight: '500',width:'100%',}}>{firstName} {lastName}</Text>
      </View>              
      
      <View style={{ flexDirection: 'row', paddingLeft:5}}>
        <Text style={{fontSize: 20, fontWeight: '400', width: '45%'}}>DOB: {DOB}</Text>
      </View>

      <View style={{ flexDirection: 'row', paddingLeft:5}}>
        <Text style={{fontSize: 20, fontWeight: '400', width: '100%'}}>Street Corner Care {'['} {date} {']'}</Text>
      </View>

      </View>

  </View>

    <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={
      {
        alignItems: 'center',      
        justifyContent: 'flex-start',
        flexDirection: 'column',
        paddingHorizontal: 20,
        paddingVertical:0,      
        marginTop: 0,
        marginHorizontal:0, 
        paddingTop: 85
      }}>

      <Text style={{fontSize:27}}>Create New Record</Text>

      <Text style={{fontSize:20, fontWeight:400}}>Upload Patient's Medical History</Text>   
      <View style={{width: "100%"}}>
          <BigInputBoxWithInnerLabel
              label="Chronic Illness"
              value={chronic_condition}
              width='100%'
              height={100}
              onChangeText={(text) => setChronicCondition(text)}
              placeholder={'Please enter chronic illness...'}
              onFocus = {handleOutsidePress}
          />
          <BigInputBoxWithInnerLabel
              label="Current Medication"
              value={current_medications}
              width='100%'
              height={100}
              onChangeText={(text) => setCurrentMedications(text)}
              placeholder={'Please enter current medication...'}
              onFocus = {handleOutsidePress}
          />
          <BigInputBoxWithInnerLabel
              label="Allergies"
              value={allergies}
              width='100%'
              height={100}
              onChangeText={(text) => setAllergies(text)}
              placeholder={'Please enter allergies...'}
              onFocus = {handleOutsidePress}
          />
      </View>


      <Text style={{fontSize:20, fontWeight:400}}>Upload Patient's Vitals</Text> 
      <View style={{width: "100%"}}>
          
           {/* the original implementation use map function, don't use it  */}
          {/* <InputBoxWithInnerLabel
              key={index}
              label={label}
              value={vitalValues[label] || ''}
              unit={properties.unit}
              width={properties.width}
              height={60}
              placeholder={'Click to Enter...'}
              onChange={(value) => }
              onFocus = {handleOutsidePress}
              keyboardType={'numeric'}
              autoFocus={label === 'Temp'} // this line is added              
          /> */}

          {/* TODO: use inputBoxWithInnerLabel one by one to store each vital
          into its state. Also need to implement the feature: after click return key,
          it can jump to next vital's box */}
          <InputBoxWithInnerLabel
              
              label={"Temperature"}
              value={temperature}
              unit={labelProperties.Temp.unit}
              width={labelProperties.Temp.width}
              height={60}
              placeholder={'Click to Enter...'}
              onChange={(value) => setTemperature(value)}
              onFocus = {handleOutsidePress}
              keyboardType={'numeric'}
              // onSubmitEditing={() => bloodPressureRef.current.focus()}
              // returnKeyType='next'
              autoFocus          
          /> 

          <InputBoxWithInnerLabel
              
              label={"Systoloc Blood Pressure"}
              value={systolic_blood_pressure}
              unit={labelProperties.Sys_BP.unit}
              width={labelProperties.Sys_BP.width}
              height={60}
              placeholder={'Click to Enter...'}
              onChange={(value) => setSysBloodPressure(value)}
              onFocus = {handleOutsidePress}
              keyboardType={'numeric'}        
          /> 

          <InputBoxWithInnerLabel
              
              label={"Diastolic Blood Pressure"}
              value={diastolic_blood_pressure}
              unit={labelProperties.Dia_BP.unit}
              width={labelProperties.Dia_BP.width}
              height={60}
              placeholder={'Click to Enter...'}
              onChange={(value) => setDiaBloodPressure(value)}
              onFocus = {handleOutsidePress}
              keyboardType={'numeric'}        
          /> 

          <InputBoxWithInnerLabel
              
              label={"Pulse"}
              value={pulse}
              unit={labelProperties.Pulse.unit}
              width={labelProperties.Pulse.width}
              height={60}
              placeholder={'Click to Enter...'}
              onChange={(value) => setPulse(value)}
              onFocus = {handleOutsidePress}
              keyboardType={'numeric'}         
          /> 

          <InputBoxWithInnerLabel
              
              label={"Oxygen"}
              value={oxygen}
              unit={labelProperties.Oxygen.unit}
              width={labelProperties.Oxygen.width}
              height={60}
              placeholder={'Click to Enter...'}
              onChange={(value) => setOxygen(value)}
              onFocus = {handleOutsidePress}
              keyboardType={'numeric'}        
          /> 

          <InputBoxWithInnerLabel
              
              label={"Glucose"}
              value={glucose}
              unit={labelProperties.Glucose.unit}
              width={labelProperties.Glucose.width}
              height={60}
              placeholder={'Click to Enter...'}
              onChange={(value) => setGlucose(value)}
              onFocus = {handleOutsidePress}
              keyboardType={'numeric'}        
          /> 
          
      </View>
      
      
      <Text style={{fontSize:20, fontWeight:400}}>Reason For Consultation</Text>
      <View style={{ marginBottom: 10, width:'100%'}}>
          <BigInputBoxWithInnerLabel
              label="Resaon For Consultation*"
              value={chief_complaint}
              width="100%"
              height={100}
              onChangeText={(text) => setChiefCompliant(text)}
              placeholder={'Please enter patient reason for consultation...'}
              onFocus = {handleOutsidePress}
          />
      </View>

    {errorMessage ? <Text style={{color:'red', fontSize:18, marginBottom:10}}>{errorMessage}</Text> : null}  

      <View style={{width:'80%',alignItems:'center',marginTop:0,marginBottom:20}}>
        <TouchableOpacity style={confirmSubmit ? styles.confirmButton : styles.normalButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {confirmSubmit ? 'Submit Request' : 'Confirm Request'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{width:'80%',alignItems:'center',marginTop:0,marginBottom:60}}>
        <TouchableOpacity style={styles.vitalOnlyButton} onPress={handleVitalOnlySubmit}>
          <Text style={styles.buttonText}>Vital Check Only</Text>
        </TouchableOpacity>
      </View>
      
      {/* reserve empty space for keyboard: */}
      <View style={{ height: 300 }} />

    </ScrollView>
  </View>
  );
}
